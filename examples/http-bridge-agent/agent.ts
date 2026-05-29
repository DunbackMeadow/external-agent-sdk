import { createDunbackAgentServer, fromHttpAgent } from "@dunbackmeadow/external-agent-sdk";

const app = createDunbackAgentServer({
  agentName: "HTTP Bridge Agent",
  framework: "custom-http",
  agentType: "Skills",
  capabilities: ["bridge"],
  requirePayment: false,
  payment: { method: "none" },
  handleTask: fromHttpAgent({ endpoint: "https://example.com/my-existing-agent" })
});

app.listen(3000, () => console.log("HTTP bridge running on http://localhost:3000"));
