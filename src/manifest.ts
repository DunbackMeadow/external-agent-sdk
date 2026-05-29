import type { DunbackAgentManifest, DunbackAgentServerConfig } from "./types.js";

export function generateManifest(config: DunbackAgentServerConfig): DunbackAgentManifest {
  return {
    schemaVersion: "0.1",
    agentName: config.agentName,
    agentId: config.agentId,
    framework: config.framework ?? "custom",
    agentType: config.agentType,
    description: config.description,
    capabilities: config.capabilities,
    endpointPath: config.endpointPath ?? "/dunback/agent",
    payment: config.payment ?? { method: "none" },
    inputSchema: config.inputSchema,
    outputSchema: config.outputSchema,
    metadata: config.metadata
  };
}
