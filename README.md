# Skylark BI Agent: Monday.com Intelligence Suite

Skylark is a modern, AI-powered Business Intelligence agent designed to interface directly with Monday.com boards. Built on Next.js 16 and powered by Llama-3.3-70B via Groq, it utilizes the Model Context Protocol (MCP) to execute read-only queries against your Deal and Work Order pipelines.

## 🚀 Key Features
- **Conversational BI:** Ask natural language questions about your Monday.com data.
- **MCP Integration:** Native tool-calling via the official `@mondaydotcomorg/monday-api-mcp`.
- **Data Resilience:** Built-in safeguards for missing CSV data and strict token-limit management via backend data pruning.
- **Glassmorphic UI:** A state-of-the-art, scroll-linked animated interface powered by `framer-motion`.

## 🛠 Tech Stack
- **Framework:** Next.js 16.1 (App Router, Turbopack)
- **AI SDK:** Vercel AI SDK v3.4+
- **LLM:** Llama-3.3-70B-Versatile (via Groq)
- **Protocol:** Model Context Protocol (MCP) SDK
- **Styling & Animation:** Tailwind CSS, Framer Motion

## 📦 Local Setup Instructions

1. **Clone the repository:**
   \`\`\`bash
   git clone <your-repo-url>
   cd skylark-bi-agent
   \`\`\`

2. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your keys:
   \`\`\`env
   MONDAY_API_TOKEN=your_monday_personal_access_token
   GROQ_API_KEY=your_free_groq_api_key
   \`\`\`

4. **Run the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Navigate to \`http://localhost:3000\` to interact with the agent.

## 🏗 Architecture Overview
1. **Frontend:** Client-side React components manage the chat state and UI streaming using \`useChat\`.
2. **API Route (\`/api/chat\`):** Acts as the orchestrator. It passes the conversation to the Groq LLM.
3. **Tool Execution:** When Llama-3 decides to fetch data, the API route spawns a local \`npx\` process to run the Monday MCP server, executes the GraphQL query, prunes the massive JSON response down to essential tokens, and returns it to the LLM for reasoning.
