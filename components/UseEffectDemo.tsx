"use client";

import { memo, useEffect, useRef, useState } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";
import { debugLog } from "@/lib/debugLog";

function UseEffectDemo() {
  const [dep, setDep] = useState(0);
  const [bump, setBump] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const noDepsCount = useRef(0);
  const { count } = useRenderDebug("UseEffectDemo", { dep, bump });

  useEffect(() => {
    const message = "[empty deps] setup";
    debugLog(message);
    setLogs((current) =>
      [...current, `${new Date().toLocaleTimeString()} ${message}`].slice(-24),
    );

    return () => {
      debugLog("[empty deps] cleanup");
    };
  }, []);

  useEffect(() => {
    const message = `[dep=${dep}] setup`;
    debugLog(message);
    setLogs((current) =>
      [...current, `${new Date().toLocaleTimeString()} ${message}`].slice(-24),
    );

    return () => {
      debugLog(`[dep=${dep}] cleanup`);
    };
  }, [dep]);

  useEffect(() => {
    noDepsCount.current += 1;
    debugLog(`[no deps] setup #${noDepsCount.current}`);

    return () => {
      debugLog(`[no deps] cleanup #${noDepsCount.current}`);
    };
  });

  return (
    <section className="effect-demo">
      <h2>useEffect playground</h2>
      <p className="drill-description">
        Use the buttons and watch the log below and the browser console. The{" "}
        <code>no deps</code> effect logs to the console only.
      </p>

      <div className="effect-demo-controls">
        <button type="button" onClick={() => setDep((value) => value + 1)}>
          Change dep ({dep})
        </button>
        <button type="button" onClick={() => setBump((value) => value + 1)}>
          Re-render only ({bump})
        </button>
      </div>

      <ul className="effect-demo-legend">
        <li>
          <code>[]</code> — setup on mount, cleanup on unmount
        </li>
        <li>
          <code>[dep]</code> — cleanup then setup when <code>dep</code> changes
        </li>
        <li>
          <code>no array</code> — cleanup then setup after every render
          (console only)
        </li>
      </ul>

      <div className="effect-demo-log" aria-live="polite">
        <RenderDebugBadge name="UseEffectDemo" count={count} />
        <p className="state-demo-note">
          bump {bump}, no-deps runs {noDepsCount.current}
        </p>
        {logs.length === 0 ? (
          <p className="effect-demo-log-empty">Waiting for events...</p>
        ) : (
          <ul>
            {logs.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default memo(UseEffectDemo);
