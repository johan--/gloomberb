import type { GloomPlugin } from "../../types/plugin";
import type { BrokerAdapter, BrokerPosition } from "../../types/broker";

const manualBroker: BrokerAdapter = {
  id: "manual",
  name: "Manual Entry",

  async validate() {
    return true; // Always valid
  },

  async importPositions(): Promise<BrokerPosition[]> {
    // Manual entry doesn't import - positions are created directly
    return [];
  },

  configSchema: [],
};

export const manualEntryPlugin: GloomPlugin = {
  id: "manual-entry",
  name: "Manual Entry",
  version: "1.0.0",
  broker: manualBroker,
};
