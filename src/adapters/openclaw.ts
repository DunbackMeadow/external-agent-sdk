import { fromHttpAgent } from "./http.js";

export function fromOpenClawEndpoint(config: { endpoint: string; apiKey?: string }) {
  return fromHttpAgent({
    endpoint: config.endpoint,
    apiKey: config.apiKey,
    transformResponse: (data) => ({
      status: data.status ?? "success",
      message: data.message ?? data.output ?? "OpenClaw agent completed the task.",
      result: data
    })
  });
}
