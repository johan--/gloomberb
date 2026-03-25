export interface BrokerPosition {
  ticker: string;
  exchange: string;
  shares: number;
  avgCost: number;
  currency: string;
  dateAcquired?: string;
}

export interface BrokerConfigField {
  key: string;
  label: string;
  type: "text" | "password" | "file" | "select";
  required: boolean;
  placeholder?: string;
  options?: string[]; // for select type
}

export interface BrokerAdapter {
  readonly id: string;
  readonly name: string;
  validate(config: Record<string, unknown>): Promise<boolean>;
  importPositions(config: Record<string, unknown>): Promise<BrokerPosition[]>;
  configSchema: BrokerConfigField[];
}
