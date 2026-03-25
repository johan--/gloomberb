import { readdir, readFile, writeFile, unlink, watch } from "fs/promises";
import { join } from "path";
import type { TickerFile, TickerFrontmatter } from "../types/ticker";
import { parseTicker, serializeTicker } from "../utils/frontmatter";

export class MarkdownStore {
  constructor(private dataDir: string) {}

  async loadAllTickers(): Promise<TickerFile[]> {
    const files = await readdir(this.dataDir);
    const mdFiles = files.filter((f) => f.endsWith(".md") && f !== "README.md");
    const tickers: TickerFile[] = [];

    for (const file of mdFiles) {
      try {
        const ticker = await this.loadFile(join(this.dataDir, file));
        tickers.push(ticker);
      } catch {
        // Skip invalid files
      }
    }

    return tickers;
  }

  async loadTicker(symbol: string): Promise<TickerFile | null> {
    const filePath = join(this.dataDir, `${symbol}.md`);
    try {
      return await this.loadFile(filePath);
    } catch {
      return null;
    }
  }

  private async loadFile(filePath: string): Promise<TickerFile> {
    const content = await readFile(filePath, "utf-8");
    return parseTicker(filePath, content);
  }

  async saveTicker(ticker: TickerFile): Promise<void> {
    const content = serializeTicker(ticker);
    await writeFile(ticker.filePath, content, "utf-8");
  }

  async createTicker(
    frontmatter: TickerFrontmatter,
    notes = "",
  ): Promise<TickerFile> {
    const filePath = join(this.dataDir, `${frontmatter.ticker}.md`);
    const ticker: TickerFile = { frontmatter, notes, filePath };
    await this.saveTicker(ticker);
    return ticker;
  }

  async deleteTicker(symbol: string): Promise<void> {
    const filePath = join(this.dataDir, `${symbol}.md`);
    await unlink(filePath);
  }

  /** Watch for external changes to markdown files */
  watchChanges(callback: (event: string, filename: string) => void): AbortController {
    const ac = new AbortController();
    (async () => {
      try {
        const watcher = watch(this.dataDir, { signal: ac.signal });
        for await (const event of watcher) {
          if (event.filename?.endsWith(".md")) {
            callback(event.eventType, event.filename);
          }
        }
      } catch {
        // Aborted or error
      }
    })();
    return ac;
  }
}
