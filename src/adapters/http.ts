import type { DunbackAgentHandler, DunbackAgentRequest } from "../types.js";

export function fromHttpAgent(config: {
  endpoint: string;
  apiKey?: string;
  transformRequest?: (ctx: DunbackAgentRequest) => unknown;
  transformResponse?: (data: any) => any;
}): DunbackAgentHandler {
  return async function handleTask(ctx) {
    const resp = await fetch(config.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.apiKey ? { Authorization: `Bearer ${config.apiKey}` } : {})
      },
      body: JSON.stringify(config.transformRequest ? config.transformRequest(ctx) : ctx)
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return { status: "error", message: data?.message ?? `HTTP agent failed with ${resp.status}`, result: data };
    }

    if (config.transformResponse) return config.transformResponse(data);

    return {
      status: data.status ?? "success",
      message: data.message ?? data.output ?? data.result ?? "Task completed.",
      result: data
    };
  };
}
