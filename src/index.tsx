import { createCliRenderer } from "@opentui/core";
import { createRoot } from "@opentui/react";
import { App } from "./app";
import { getDataDir, initDataDir } from "./data/config-store";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

async function main() {
  // Determine data directory
  let dataDir = await getDataDir();

  if (!dataDir) {
    // First run - use default location
    dataDir = join(process.env.HOME || "~", "gloomberb-data");
  }

  // Ensure data dir exists
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  // Load or create config
  const config = await initDataDir(dataDir);

  // Create renderer
  const renderer = await createCliRenderer({
    exitOnCtrlC: true,
    backgroundColor: "#000000",
  });

  // Render app
  createRoot(renderer).render(<App config={config} renderer={renderer} />);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
