import { describe, expect, it } from "vitest";
import { generateManifest } from "../src/manifest.js";

describe("generateManifest", () => {
  it("creates a Dunback manifest", () => {
    const manifest = generateManifest({
      agentName: "Test Agent",
      framework: "custom",
      capabilities: ["test"],
      handleTask: async () => ({ status: "success", message: "ok" })
    });
    expect(manifest.schemaVersion).toBe("0.1");
    expect(manifest.agentName).toBe("Test Agent");
    expect(manifest.endpointPath).toBe("/dunback/agent");
  });
});
