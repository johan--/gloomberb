import type { ReactNode } from "react";
import type { TickerFile } from "./ticker";
import type { TickerFinancials } from "./financials";
import type { BrokerAdapter } from "./broker";
import type { ColumnConfig } from "./config";

/** All available slot definitions for plugins */
export interface GloomSlots {
  /** Extra tabs in the right detail panel */
  "detail:tab": { ticker: TickerFile; financials: TickerFinancials | null };
  /** Extra sections in the detail panel */
  "detail:section": { ticker: TickerFile; financials: TickerFinancials | null };
  /** Extra columns in ticker list tables */
  "list:column": { ticker: TickerFile; financials: TickerFinancials | null };
  /** Extra items in the command bar */
  "command:extra": { query: string };
  /** Pluggable command presets */
  "command:preset": Record<string, never>;
  /** Widgets in the status bar */
  "status:widget": Record<string, never>;
  /** Extra sections on the config page */
  "config:section": Record<string, never>;
  /** Hook into data refresh cycle */
  "data:post-refresh": { ticker: string; financials: TickerFinancials };
  /** For agent-driven data enrichment */
  "data:enricher": { ticker: TickerFile };
}

export interface PaneProps {
  focused: boolean;
  width: number;
  height: number;
}

export interface PaneDef {
  id: string;
  name: string;
  icon?: string; // single char for tab display
  component: (props: PaneProps) => ReactNode;
  defaultPosition: "left" | "right" | "bottom";
  defaultWidth?: string;
}

export interface CommandDef {
  id: string;
  label: string;
  keywords: string[];
  shortcut?: string;
  execute: () => void | Promise<void>;
  category: "navigation" | "data" | "portfolio" | "config";
}

export interface CustomColumnDef extends ColumnConfig {
  render: (ticker: TickerFile, financials: TickerFinancials | null) => string;
}

export interface GloomPluginContext {
  registerPane(pane: PaneDef): void;
  registerCommand(command: CommandDef): void;
  registerColumn(column: CustomColumnDef): void;
  registerBroker(broker: BrokerAdapter): void;
  getData(ticker: string): TickerFinancials | null;
  getTicker(ticker: string): TickerFile | null;
}

export interface GloomPlugin {
  id: string;
  name: string;
  version: string;
  order?: number;

  setup?(ctx: GloomPluginContext): void | Promise<void>;
  dispose?(): void;

  panes?: PaneDef[];
  broker?: BrokerAdapter;
  slots?: Partial<{
    [K in keyof GloomSlots]: (props: GloomSlots[K]) => ReactNode;
  }>;
}
