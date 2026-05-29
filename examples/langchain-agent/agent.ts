import { createDunbackAgentServer, fromLangChainAgent } from "@dunbackmeadow/external-agent-sdk";

// Replace this mock with a real LangChain/LangGraph agent.
const mockLangChainAgent = {
  async invoke(input: any) {
    return {
      messages: [
        { role: "assistant", content: `LangChain-style response to: ${input.input}` }
      ]
    };
  }
};

const app = createDunbackAgentServer({
  agentName: "LangChain Job Search Agent",
  framework: "langchain",
  agentType: "Skills",
  capabilities: ["job_search"],
  requirePayment: false,
  payment: {
    method: "x402",
    network: "polygon",
    asset: "USDC",
    price: "0.10",
    facilitatorUrl: "https://dunbackmeadow.com/api/x402"
  },
  handleTask: fromLangChainAgent(mockLangChainAgent)
});

app.listen(3000, () => console.log("LangChain Dunback agent running on http://localhost:3000"));
