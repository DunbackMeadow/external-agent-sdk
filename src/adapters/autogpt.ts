import { fromHttpAgent } from "./http.js";

export function fromAutoGPTTrigger(config: { triggerUrl: string; apiKey?: string }) {
  return fromHttpAgent({
    endpoint: config.triggerUrl,
    apiKey: config.apiKey,
    transformRequest: (ctx) => ({
      input: ctx.userInput,
      taskId: ctx.taskId,
      sessionId: ctx.sessionId,
      userWallet: ctx.userWallet,
      metadata: ctx.metadata
    }),
    transformResponse: (data) => ({
      status: data.done === false ? "processing" : data.status ?? "success",
      message: data.message ?? "AutoGPT workflow started.",
      externalTaskId: data.id ?? data.taskId,
      result: data
    })
  });
}
