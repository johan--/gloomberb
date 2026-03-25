import { useState } from "react";
import { useKeyboard } from "@opentui/react";
import { TextAttributes } from "@opentui/core";
import { colors } from "../../theme/colors";
import { useAppState } from "../../state/app-context";

const SECTIONS = ["general", "columns", "brokers"] as const;
const SECTION_LABELS: Record<string, string> = {
  general: "General",
  columns: "Columns",
  brokers: "Brokers",
};

function GeneralSection() {
  const { state } = useAppState();
  const config = state.config;

  const rows: [string, string][] = [
    ["Data Directory", config.dataDir],
    ["Base Currency", config.baseCurrency],
    ["Refresh Interval", `${config.refreshIntervalMinutes} min`],
    ["Portfolios", config.portfolios.map((p) => p.name).join(", ")],
    ["Watchlists", config.watchlists.map((w) => w.name).join(", ")],
    ["Plugins", config.plugins.join(", ")],
  ];

  return (
    <box flexDirection="column" gap={1}>
      <text attributes={TextAttributes.BOLD} fg={colors.textBright}>General Settings</text>
      <box height={1} />
      {rows.map(([label, value]) => (
        <box key={label} flexDirection="row" height={1}>
          <box width={25}><text fg={colors.textDim}>{label}</text></box>
          <text fg={colors.text}>{value}</text>
        </box>
      ))}
    </box>
  );
}

function ColumnsSection() {
  const { state } = useAppState();

  return (
    <box flexDirection="column" gap={1}>
      <text attributes={TextAttributes.BOLD} fg={colors.textBright}>Column Configuration</text>
      <box height={1} />
      <box flexDirection="row" height={1}>
        <box width={12}><text attributes={TextAttributes.BOLD} fg={colors.textDim}>ID</text></box>
        <box width={12}><text attributes={TextAttributes.BOLD} fg={colors.textDim}>Label</text></box>
        <box width={8}><text attributes={TextAttributes.BOLD} fg={colors.textDim}>Width</text></box>
        <box width={8}><text attributes={TextAttributes.BOLD} fg={colors.textDim}>Align</text></box>
        <box width={10}><text attributes={TextAttributes.BOLD} fg={colors.textDim}>Format</text></box>
      </box>
      {state.config.columns.map((col) => (
        <box key={col.id} flexDirection="row" height={1}>
          <box width={12}><text fg={colors.text}>{col.id}</text></box>
          <box width={12}><text fg={colors.text}>{col.label}</text></box>
          <box width={8}><text fg={colors.text}>{String(col.width)}</text></box>
          <box width={8}><text fg={colors.text}>{col.align}</text></box>
          <box width={10}><text fg={colors.text}>{col.format || "—"}</text></box>
        </box>
      ))}
      <box height={1} />
      <text fg={colors.textMuted}>Edit config.json in your data directory to customize columns.</text>
    </box>
  );
}

function BrokersSection() {
  const { state } = useAppState();

  return (
    <box flexDirection="column" gap={1}>
      <text attributes={TextAttributes.BOLD} fg={colors.textBright}>Broker Configuration</text>
      <box height={1} />
      {Object.entries(state.config.brokers).length === 0 ? (
        <text fg={colors.textDim}>No brokers configured. Edit config.json to add broker credentials.</text>
      ) : (
        Object.entries(state.config.brokers).map(([id, config]) => (
          <box key={id} flexDirection="column">
            <text attributes={TextAttributes.BOLD} fg={colors.text}>{id}</text>
            {Object.entries(config).map(([key, val]) => (
              <box key={key} flexDirection="row" height={1} paddingLeft={2}>
                <box width={20}><text fg={colors.textDim}>{key}</text></box>
                <text fg={colors.text}>
                  {key.includes("token") || key.includes("password") ? "••••••••" : String(val)}
                </text>
              </box>
            ))}
          </box>
        ))
      )}
    </box>
  );
}

export function ConfigPage() {
  const { dispatch } = useAppState();
  const [sectionIdx, setSectionIdx] = useState(0);
  const activeSection = SECTIONS[sectionIdx]!;

  // Capture ALL keyboard events so they don't leak to panes below
  useKeyboard((event) => {
    if (event.name === "escape" || (event.name === "," && event.ctrl)) {
      dispatch({ type: "TOGGLE_CONFIG" });
      event.stopPropagation();
      return;
    }

    // Navigate sections with arrows/j/k
    if (event.name === "up" || event.name === "k") {
      setSectionIdx((i) => Math.max(i - 1, 0));
      event.stopPropagation();
    } else if (event.name === "down" || event.name === "j") {
      setSectionIdx((i) => Math.min(i + 1, SECTIONS.length - 1));
      event.stopPropagation();
    }

    // Consume all other navigation keys so they don't reach panes
    if (["left", "right", "h", "l", "tab", "enter"].includes(event.name)) {
      event.stopPropagation();
    }
  });

  return (
    <box
      position="absolute"
      top={1}
      left={2}
      right={2}
      bottom={1}
      flexDirection="column"
      backgroundColor={colors.bg}
      borderStyle="single"
      borderColor={colors.borderFocused}
      zIndex={200}
    >
      {/* Header */}
      <box flexDirection="row" height={1} paddingX={1} backgroundColor={colors.header}>
        <text attributes={TextAttributes.BOLD} fg={colors.headerText}>Settings</text>
        <box flexGrow={1} />
        <text fg={colors.textDim}>↑↓ navigate sections  Esc close</text>
      </box>

      <box flexDirection="row" flexGrow={1}>
        {/* Sidebar */}
        <box flexDirection="column" width={20} borderStyle="single" border={["right"]} borderColor={colors.border}>
          {SECTIONS.map((s, idx) => (
            <box
              key={s}
              height={1}
              paddingX={1}
              backgroundColor={idx === sectionIdx ? colors.selected : colors.bg}
            >
              <text fg={idx === sectionIdx ? colors.selectedText : colors.textDim}>
                {SECTION_LABELS[s]}
              </text>
            </box>
          ))}
        </box>

        {/* Content */}
        <scrollbox flexGrow={1} scrollY paddingX={2} paddingY={1}>
          {activeSection === "general" && <GeneralSection />}
          {activeSection === "columns" && <ColumnsSection />}
          {activeSection === "brokers" && <BrokersSection />}
        </scrollbox>
      </box>
    </box>
  );
}
