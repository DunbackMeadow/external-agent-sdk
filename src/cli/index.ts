#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const command = process.argv[2];

function writeFileSafe(filePath: string, content: string) {
  if (fs.existsSync(filePath)) {
    console.error(`Refusing to overwrite existing file: ${filePath}`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function init() {
  const target = process.argv[3] ?? "dunback-agent";
  const dir = path.resolve(process.cwd(), target);
  fs.mkdirSync(dir, { recursive: true });

  writeFileSafe(path.join(dir, "package.json"), JSON.stringify({
    name: target,
    version: "0.1.0",
    type: "module",
    scripts: { dev: "tsx src/agent.ts" },
    dependencies: { "@dunbackmeadow/external-agent-sdk": "latest", tsx: "latest" },
    devDependencies: { typescript: "latest" }
  }, null, 2));

  writeFileSafe(path.join(dir, "src/agent.ts"), `import { createDunbackAgentServer } from "@dunbackmeadow/external-agent-sdk";\n\nconst app = createDunbackAgentServer({\n  agentName: "My Dunback Agent",\n  framework: "custom",\n  agentType: "Skills",\n  capabilities: ["demo"],\n  requirePayment: false,\n  payment: { method: "none" },\n  async handleTask(ctx) {\n    return {\n      status: "success",\n      message: \`Echo: \${ctx.userInput}\`,\n      result: { taskId: ctx.taskId }\n    };\n  }\n});\n\napp.listen(3000, () => {\n  console.log("Dunback agent listening on http://localhost:3000");\n});\n`);

  console.log(`Created ${target}`);
}

async function validate() {
  const url = process.argv[3];
  if (!url) {
    console.error("Usage: dunback-agent validate <base-url>");
    process.exit(1);
  }
  const manifestUrl = `${url.replace(/\/$/, "")}/.well-known/dunback-agent.json`;
  const resp = await fetch(manifestUrl);
  if (!resp.ok) {
    console.error(`Manifest check failed: ${resp.status} ${resp.statusText}`);
    process.exit(1);
  }
  const manifest = await resp.json();
  console.log(JSON.stringify(manifest, null, 2));
  console.log("Validation passed.");
}

if (command === "init") init();
else if (command === "validate") validate();
else {
  console.log(`Dunback External Agent SDK CLI\n\nCommands:\n  init [dir]              Create a starter external agent\n  validate <base-url>     Fetch and print the Dunback manifest\n`);
}
