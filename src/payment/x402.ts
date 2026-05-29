import type { NextFunction, Request, Response } from "express";
import type { DunbackPaymentConfig } from "../types.js";

export type X402MiddlewareOptions = DunbackPaymentConfig & {
  enabled?: boolean;
  verifyHeaderName?: string;
};

export function requireX402Payment(options: X402MiddlewareOptions) {
  return async function x402Middleware(req: Request, res: Response, next: NextFunction) {
    if (options.enabled === false || options.method === "none") return next();

    const headerName = options.verifyHeaderName ?? "x-dunback-payment-verified";
    const alreadyVerified = req.header(headerName);

    // V1 assumption: Dunback AgentRelay verifies/settles x402 before calling the external agent.
    // The external server only accepts calls carrying a verification header injected by AgentRelay.
    // Later versions can add direct facilitator /verify and /settle calls here.
    if (alreadyVerified === "true") return next();

    return res.status(402).json({
      status: "error",
      message: "Payment required. Call this endpoint through Dunback Meadow AgentRelay or include a valid x402 payment verification.",
      payment: {
        method: options.method ?? "x402",
        network: options.network ?? "polygon",
        asset: options.asset ?? "USDC",
        price: options.price,
        receiver: options.receiver,
        facilitatorUrl: options.facilitatorUrl
      }
    });
  };
}
