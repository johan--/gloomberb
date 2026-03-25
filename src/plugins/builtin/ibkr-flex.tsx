import type { GloomPlugin } from "../../types/plugin";
import type { BrokerAdapter, BrokerPosition } from "../../types/broker";

const IBKR_STATEMENT_URL = "https://gdcdyn.interactivebrokers.com/Universal/servlet/FlexStatementService.SendRequest";
const IBKR_STATEMENT_GET_URL = "https://gdcdyn.interactivebrokers.com/Universal/servlet/FlexStatementService.GetStatement";

interface FlexQueryConfig {
  token: string;
  queryId: string;
  endpoint?: string;
}

async function requestFlexStatement(config: FlexQueryConfig): Promise<string> {
  const endpoint = config.endpoint || IBKR_STATEMENT_URL;
  const url = `${endpoint}?t=${config.token}&q=${config.queryId}&v=3`;
  const resp = await fetch(url, { signal: AbortSignal.timeout(30_000) });
  const text = await resp.text();

  // Parse XML response for reference code
  const codeMatch = text.match(/<ReferenceCode>(\d+)<\/ReferenceCode>/);
  if (!codeMatch) {
    const errorMatch = text.match(/<ErrorMessage>([^<]+)<\/ErrorMessage>/);
    throw new Error(errorMatch?.[1] || "Failed to request Flex statement");
  }
  return codeMatch[1]!;
}

async function getFlexStatement(token: string, referenceCode: string): Promise<string> {
  // Wait a bit for the statement to be generated
  await new Promise((r) => setTimeout(r, 3000));

  const url = `${IBKR_STATEMENT_GET_URL}?t=${token}&q=${referenceCode}&v=3`;

  // Retry up to 5 times with increasing delays
  for (let i = 0; i < 5; i++) {
    const resp = await fetch(url, { signal: AbortSignal.timeout(30_000) });
    const text = await resp.text();

    if (text.includes("<FlexQueryResponse") || text.includes("<FlexStatements")) {
      return text;
    }

    // Check if still generating
    if (text.includes("Statement generation in progress")) {
      await new Promise((r) => setTimeout(r, 2000 * (i + 1)));
      continue;
    }

    const errorMatch = text.match(/<ErrorMessage>([^<]+)<\/ErrorMessage>/);
    if (errorMatch) throw new Error(errorMatch[1]);
  }

  throw new Error("Flex statement generation timed out");
}

function parseFlexPositions(xml: string): BrokerPosition[] {
  const positions: BrokerPosition[] = [];

  // Parse OpenPosition elements
  const posRegex = /<OpenPosition[^>]*>/g;
  let match;

  while ((match = posRegex.exec(xml)) !== null) {
    const tag = match[0];
    const attr = (name: string) => {
      const m = tag.match(new RegExp(`${name}="([^"]*)"`));
      return m?.[1] || "";
    };

    const symbol = attr("symbol");
    const quantity = parseFloat(attr("position") || attr("quantity") || "0");
    const costBasis = parseFloat(attr("costBasisPrice") || attr("costPrice") || "0");
    const currency = attr("currency") || "USD";
    const exchange = attr("listingExchange") || attr("exchange") || "";

    if (symbol && quantity !== 0) {
      positions.push({
        ticker: symbol,
        exchange,
        shares: Math.abs(quantity),
        avgCost: costBasis,
        currency,
      });
    }
  }

  return positions;
}

const ibkrBroker: BrokerAdapter = {
  id: "ibkr-flex",
  name: "Interactive Brokers (Flex Query)",

  async validate(config) {
    const { token, queryId } = config as unknown as FlexQueryConfig;
    return !!(token && queryId);
  },

  async importPositions(config): Promise<BrokerPosition[]> {
    const { token, queryId, endpoint } = config as unknown as FlexQueryConfig;

    // Step 1: Request the statement
    const referenceCode = await requestFlexStatement({ token, queryId, endpoint });

    // Step 2: Get the statement
    const xml = await getFlexStatement(token, referenceCode);

    // Step 3: Parse positions
    return parseFlexPositions(xml);
  },

  configSchema: [
    { key: "token", label: "Flex Token", type: "password", required: true, placeholder: "Your Flex Web Service token" },
    { key: "queryId", label: "Query ID", type: "text", required: true, placeholder: "Flex Query ID" },
    { key: "endpoint", label: "Endpoint", type: "text", required: false, placeholder: IBKR_STATEMENT_URL },
  ],
};

export const ibkrFlexPlugin: GloomPlugin = {
  id: "ibkr-flex",
  name: "IBKR Flex Query",
  version: "1.0.0",
  broker: ibkrBroker,
};
