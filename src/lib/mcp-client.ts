import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";


// Explicitly type the expected content blocks from the MCP Server
interface MCPContent {
  type: string;
  text?: string;
  [key: string]: unknown;
}

/**
 * Executes a specific tool via the Monday MCP server using a dynamic stdio transport.
 * @param toolName The name of the MCP tool to execute (e.g., 'monday_graphql_query')
 * @param args The arguments required by the tool
 * @returns The parsed JSON response from the MCP tool
 */

export async function executeMondayMCPTool(toolName: string, args: Record<string, unknown>) {
  const token = process.env.MONDAY_API_TOKEN;
  if (!token) {
    throw new Error("MONDAY_API_TOKEN environment variable is missing.");
  }

  const transport = new StdioClientTransport({
    command: "npx",
    args: [
      "-y",
      "@mondaydotcomorg/monday-api-mcp@latest",
      "-t",
      token
    ],
    env: {
        ...process.env,
        npm_config_cache: '/tmp/.npm'
    } as Record<string , string>
  });

  // FIX: Clients do not declare 'tools' in capabilities.
  const client = new Client(
    { name: "skylark-bi-client", version: "1.0.0" },
    { capabilities: {} } 
  );

  try {
    await client.connect(transport);

    const result = await client.callTool({
      name: toolName,
      arguments: args,
    });

    // FIX: Explicitly cast the generic content object to our MCPContent array interface
    const content = result.content as MCPContent[];

    if (content && content.length > 0) {
      const textResponse = content.find((c) => c.type === 'text');
      
      if (textResponse && typeof textResponse.text === 'string') {
          try {
             return JSON.parse(textResponse.text);
          } catch {
             return textResponse.text;
          }
      }
    }
    
    return null;

  } catch (error) {
    console.error(`Error executing Monday MCP tool ${toolName}:`, error);
    throw error;
  } finally {
    await transport.close();
  }
}