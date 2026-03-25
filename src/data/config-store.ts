import { readFile, writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";
import type { AppConfig } from "../types/config";
import { createDefaultConfig } from "../types/config";

const GLOBAL_CONFIG_DIR = join(process.env.HOME || "~", ".gloomberb");
const GLOBAL_CONFIG_FILE = join(GLOBAL_CONFIG_DIR, "config.json");

/** Get the data directory from global config, or null if not set */
export async function getDataDir(): Promise<string | null> {
  try {
    const raw = await readFile(GLOBAL_CONFIG_FILE, "utf-8");
    const config = JSON.parse(raw);
    return config.dataDir || null;
  } catch {
    return null;
  }
}

/** Save the data directory to global config */
export async function setDataDir(dataDir: string): Promise<void> {
  await mkdir(GLOBAL_CONFIG_DIR, { recursive: true });
  await writeFile(GLOBAL_CONFIG_FILE, JSON.stringify({ dataDir }, null, 2), "utf-8");
}

/** Load the app config from the data directory */
export async function loadConfig(dataDir: string): Promise<AppConfig> {
  const configPath = join(dataDir, "config.json");
  try {
    const raw = await readFile(configPath, "utf-8");
    const saved = JSON.parse(raw);
    const defaults = createDefaultConfig(dataDir);
    return { ...defaults, ...saved, dataDir };
  } catch {
    return createDefaultConfig(dataDir);
  }
}

/** Save the app config to the data directory */
export async function saveConfig(config: AppConfig): Promise<void> {
  const configPath = join(config.dataDir, "config.json");
  await mkdir(dirname(configPath), { recursive: true });
  const { dataDir, ...rest } = config;
  await writeFile(configPath, JSON.stringify(rest, null, 2), "utf-8");
}

/** Ensure the data directory exists and has a config */
export async function initDataDir(dataDir: string): Promise<AppConfig> {
  await mkdir(dataDir, { recursive: true });
  const config = await loadConfig(dataDir);
  await saveConfig(config);
  await setDataDir(dataDir);
  return config;
}
