import { streamText, tool, convertToModelMessages, stepCountIs } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { z } from 'zod';
import { executeMondayMCPTool } from '@/lib/mcp-client';
import { SYSTEM_PROMPT } from '@/lib/prompts';

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

export const maxDuration = 60;

function simplifyMondayData(data: any) {
  if (!data) return "No data returned.";
  
  // If it's a board items page, simplify the items
  if (data.boards?.[0]?.items_page?.items) {
    return data.boards[0].items_page.items.map((item: any) => ({
      name: item.name,
      values: item.column_values?.reduce((acc: any, cv: any) => {
        // Only keep the readable text value to save tokens
        acc[cv.id || cv.title] = cv.text;
        return acc;
      }, {})
    }));
  }
  
  // If it's a general search result or schema, return as is but stringify
  return typeof data === 'string' ? data : JSON.stringify(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Body received:", JSON.stringify(body, null, 2));
  
  const { messages } = body;
  
  // Strip UI-only parts that Groq/Llama cannot process
  const sanitizedMessages = messages.map((m: any) => ({
    ...m,
    parts: m.parts
      ?.filter((p: any) =>
        p.type === 'text' || p.type === 'tool-call' || p.type === 'tool-result'
      )
      .map(({ providerMetadata, state, ...rest }: any) => rest) // strip Groq-incompatible fields
    ?? []
  }));

  const converted = await convertToModelMessages(messages);
  console.log("Converted messages:", JSON.stringify(converted, null, 2));

  const result = await streamText({
    model: groq('llama-3.3-70b-versatile'),
    messages: converted,
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(5),
    tools: {
      call_monday_tool: tool({
        description: `Monday.com MCP integration. Tools: list_workspaces, get_board_info, get_board_schema, get_full_board_data, get_board_items_page, search.`,
        inputSchema: z.object({
          tool_name: z.string().describe('The Monday MCP tool name to call.'),
          arguments: z.object({
            board_id: z.union([z.number(), z.string()]).optional(), // Allow string for flexibility            
            query: z.string().optional(),
            searchType: z.enum(['BOARD', 'DOCUMENTS', 'FOLDERS']).optional(),
            limit: z.coerce.number().optional().default(10),            
            cursor: z.string().optional(),
          }).optional().default({ limit: 10 }).describe('Arguments for the tool. Pass {} if no arguments needed.'),
        }),
        execute: async ({ tool_name, arguments: args }) => {
          try {
            let finalArgs: Record<string, any> = { ...args };
            
            // FIX 1: Prevent Cursor Hallucination
            // If the model sends a placeholder string instead of a real cursor, delete it.
            if (finalArgs.cursor && (finalArgs.cursor.includes('{') || finalArgs.cursor.includes('id_of'))) {
              console.warn("Stripping hallucinated cursor:", finalArgs.cursor);
              delete finalArgs.cursor;
            }

            if (args?.board_id) {
              const rawId = args.board_id.toString();
              const cleanId = parseInt(rawId.replace('board-', ''), 10);
              
              finalArgs.boardId = cleanId;
              delete finalArgs.board_id;
            }

            if (args?.searchType) {
              finalArgs.searchType = args.searchType;
            }

            if (tool_name === 'get_board_items_page' || tool_name === 'get_full_board_data') {
              finalArgs.includeColumns = true;
              finalArgs.limit = 10; // Absolutely restrict payload to 10 items
            }

            console.log(`Calling MCP [${tool_name}] with:`, JSON.stringify(finalArgs));
            
            const data = await executeMondayMCPTool(tool_name, finalArgs);
            const cleanData = simplifyMondayData(data);
            return typeof cleanData === 'string' ? cleanData : JSON.stringify(data);
          } catch (error) {
            console.error('MCP Tool Error:', error);
            return `Error: ${(error as Error).message}`;
          }
        },
      }),
    },
    onStepFinish: ({ text, toolCalls, toolResults, finishReason }) => {
      console.log("--- Step Finished ---");
      console.log("Finish reason:", finishReason);
      console.log("Text produced:", text);
      console.log("Tool calls:", JSON.stringify(toolCalls, null, 2));
      console.log("Tool results:", JSON.stringify(toolResults, null, 2));
    },
  });

  return result.toUIMessageStreamResponse();
}