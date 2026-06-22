import { useRef } from "react";
import { debugLog } from "@/lib/debugLog";

export type RenderDebugResult = {
  count: number;
  countRef: React.RefObject<number>;
};

export function useRenderDebug(
  name: string,
  data?: Record<string, unknown>,
): RenderDebugResult {
  const renderCount = useRef(0);
  renderCount.current += 1;

  debugLog(`[${name}] render #${renderCount.current}`, data);

  return { count: renderCount.current, countRef: renderCount };
}
