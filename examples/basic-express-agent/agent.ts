import { createDunbackAgentServer } from "@dunbackmeadow/external-agent-sdk";

const app = createDunbackAgentServer({
  agentName: "Basic Dunback Demo Agent",
  framework: "custom",
  agentType: "Skills",
  description: "A simple demo external agent for Dunback Meadow.",
  capabilities: ["demo", "echo"],
  requirePayment: false,
  payment: { method: "none" },
  async handleTask(ctx) {
    return {
      status: "success",
      message: `I received your request: ${ctx.userInput}`,
      result: { taskId: ctx.taskId, sessionId: ctx.sessionId }
    };
  }
});

app.listen(3000, () => console.log("Agent running on http://localhost:3000"));
