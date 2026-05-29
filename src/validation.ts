import { z } from "zod";

export const DunbackAgentRequestSchema = z.object({
  taskId: z.string().min(1),
  sessionId: z.string().optional(),
  agentId: z.string().optional(),
  userWallet: z.string().optional(),
  userInput: z.string().min(1),
  metadata: z.record(z.unknown()).optional()
});

export const DunbackAgentResponseSchema = z.object({
  status: z.enum(["success", "clarification_needed", "processing", "error"]),
  message: z.string(),
  result: z.unknown().optional(),
  clarificationQuestion: z.string().optional(),
  externalTaskId: z.string().optional(),
  metadata: z.record(z.unknown()).optional()
});
