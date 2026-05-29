import type { DunbackAgentHandler } from "../types.js";

function extractMessage(output: any): string {
  const messages = output?.messages;
  if (Array.isArray(messages) && messages.length > 0) {
    const last = messages[messages.length - 1];
    if (typeof last?.content === "string") return last.content;
    if (Array.isArray(last?.content)) return last.content.map((x: any) => x?.text ?? x).join("\n");
  }
  if (typeof output?.output === "string") return output.output;
  if (typeof output?.content === "string") return output.content;
  return "LangChain agent completed the task.";
}

export function fromLangChainAgent(agent: { invoke: (input: any, config?: any) => Promise<any> }, options?: { systemInputKey?: string }): DunbackAgentHandler {
  return async function handleTask(ctx) {
    const input = {
      messages: [{ role: "user", content: ctx.userInput }],
      input: ctx.userInput,
      taskId: ctx.taskId,
      sessionId: ctx.sessionId,
      metadata: ctx.metadata
    };

    const output = await agent.invoke(input, {
      configurable: {
        thread_id: ctx.sessionId ?? ctx.taskId
      }
    });

    return {
      status: "success",
      message: extractMessage(output),
      result: output
    };
  };
}
