export type DunbackAgentFramework =
  | "custom"
  | "langchain"
  | "langgraph"
  | "autogpt"
  | "openclaw"
  | string;

export type DunbackAgentType = "Personal" | "Skills" | "Resources" | string;

export type DunbackAgentStatus =
  | "success"
  | "clarification_needed"
  | "processing"
  | "error";

export type DunbackPaymentConfig = {
  method: "x402" | "dunback_internal" | "none" | string;
  network?: "polygon" | string;
  asset?: "USDC" | string;
  price?: string;
  receiver?: string;
  facilitatorUrl?: string;
};

export type DunbackAgentManifest = {
  schemaVersion: "0.1";
  agentName: string;
  agentId?: string;
  framework: DunbackAgentFramework;
  agentType?: DunbackAgentType;
  description?: string;
  capabilities: string[];
  endpointPath: string;
  payment: DunbackPaymentConfig;
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

export type DunbackAgentRequest = {
  taskId: string;
  sessionId?: string;
  agentId?: string;
  userWallet?: string;
  userInput: string;
  metadata?: Record<string, unknown>;
};

export type DunbackAgentResponse = {
  status: DunbackAgentStatus;
  message: string;
  result?: unknown;
  clarificationQuestion?: string;
  externalTaskId?: string;
  metadata?: Record<string, unknown>;
};

export type DunbackAgentHandler = (
  ctx: DunbackAgentRequest
) => Promise<DunbackAgentResponse> | DunbackAgentResponse;

export type DunbackAgentServerConfig = {
  agentName: string;
  agentId?: string;
  framework?: DunbackAgentFramework;
  agentType?: DunbackAgentType;
  description?: string;
  capabilities: string[];
  endpointPath?: string;
  manifestPath?: string;
  payment?: DunbackPaymentConfig;
  corsOrigins?: string[] | "*";
  inputSchema?: Record<string, unknown>;
  outputSchema?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  requirePayment?: boolean;
  handleTask: DunbackAgentHandler;
};
