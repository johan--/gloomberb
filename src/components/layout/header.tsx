import { useState, useEffect } from "react";
import { TextAttributes } from "@opentui/core";
import { colors } from "../../theme/colors";
import { useAppState } from "../../state/app-context";

function useClock() {
  const [time, setTime] = useState(formatTime());
  useEffect(() => {
    const interval = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

function formatTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export function Header() {
  const time = useClock();
  const { state } = useAppState();

  return (
    <box
      flexDirection="row"
      height={1}
      backgroundColor={colors.header}
    >
      <box flexGrow={1} paddingLeft={1}>
        <text attributes={TextAttributes.BOLD} fg={colors.headerText}>
          GLOOMBERB TERMINAL
        </text>
      </box>
      <box paddingRight={1}>
        <text fg={colors.headerText}>
          {time}  {state.config.baseCurrency}
        </text>
      </box>
    </box>
  );
}
