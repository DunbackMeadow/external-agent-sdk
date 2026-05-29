import express from "express";
import cors from "cors";
import type { DunbackAgentServerConfig } from "./types.js";
import { generateManifest } from "./manifest.js";
import { DunbackAgentRequestSchema, DunbackAgentResponseSchema } from "./validation.js";
import { requireX402Payment } from "./payment/x402.js";

export function createDunbackAgentServer(config: DunbackAgentServerConfig) {
  const app = express();
  const endpointPath = config.endpointPath ?? "/dunback/agent";
  const manifestPath = config.manifestPath ?? "/.well-known/dunback-agent.json";

  app.use(
    cors({
      origin: config.corsOrigins === "*" || !config.corsOrigins ? true : config.corsOrigins
    })
  );
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, agentName: config.agentName });
  });

  app.get(manifestPath, (_req, res) => {
    res.json(generateManifest({ ...config, endpointPath }));
  });

  const paymentConfig = config.payment ?? { method: "none" };
  const shouldRequirePayment = config.requirePayment ?? paymentConfig.method === "x402";

  app.post(
    endpointPath,
    requireX402Payment({ ...paymentConfig, enabled: shouldRequirePayment }),
    async (req, res) => {
      try {
        const parsed = DunbackAgentRequestSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json({
            status: "error",
            message: "Invalid Dunback agent request.",
            details: parsed.error.flatten()
          });
        }

        const result = await config.handleTask(parsed.data);
        const response = DunbackAgentResponseSchema.safeParse(result);

        if (!response.success) {
          return res.status(500).json({
            status: "error",
            message: "Agent returned an invalid Dunback response.",
            details: response.error.flatten()
          });
        }

        return res.json(response.data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Agent failed.";
        return res.status(500).json({ status: "error", message });
      }
    }
  );

  return app;
}
