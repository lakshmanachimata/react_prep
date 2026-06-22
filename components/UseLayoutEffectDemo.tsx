"use client";

import {
  memo,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";
import { debugLog } from "@/lib/debugLog";

function EffectMeasurePanel({ active }: { active: boolean }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [markerTop, setMarkerTop] = useState(0);
  const { count: renders } = useRenderDebug("EffectMeasurePanel", {
    active,
    markerTop,
  });

  useEffect(() => {
    if (!active || !targetRef.current) {
      setMarkerTop(0);
      return;
    }

    const height = targetRef.current.offsetHeight;
    setMarkerTop(height + 4);
    debugLog("[useEffect] measured target and moved marker");
  }, [active]);

  return (
    <div className="state-demo-panel layout-measure-panel">
      <RenderDebugBadge name="EffectMeasurePanel" count={renders} />
      <h3>useEffect measure</h3>
      <p className="state-demo-note">
        Marker updates after paint — you may see a brief jump.
      </p>
      <div className="layout-measure-stage">
        <div ref={targetRef} className="layout-measure-target">
          Target box
        </div>
        {active && (
          <div className="layout-measure-marker" style={{ top: markerTop }}>
            Marker
          </div>
        )}
      </div>
    </div>
  );
}

function LayoutMeasurePanel({ active }: { active: boolean }) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [markerTop, setMarkerTop] = useState(0);
  const { count: renders } = useRenderDebug("LayoutMeasurePanel", {
    active,
    markerTop,
  });

  useLayoutEffect(() => {
    if (!active || !targetRef.current) {
      setMarkerTop(0);
      return;
    }

    const height = targetRef.current.offsetHeight;
    setMarkerTop(height + 4);
    debugLog("[useLayoutEffect] measured target and moved marker");
  }, [active]);

  return (
    <div className="state-demo-panel layout-measure-panel">
      <RenderDebugBadge name="LayoutMeasurePanel" count={renders} />
      <h3>useLayoutEffect measure</h3>
      <p className="state-demo-note">
        Marker updates before paint — should look stable.
      </p>
      <div className="layout-measure-stage">
        <div ref={targetRef} className="layout-measure-target">
          Target box
        </div>
        {active && (
          <div className="layout-measure-marker" style={{ top: markerTop }}>
            Marker
          </div>
        )}
      </div>
    </div>
  );
}

function LayoutLifecyclePanel() {
  const [dep, setDep] = useState(0);
  const [bump, setBump] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const noDepsCount = useRef(0);
  const { count: renders } = useRenderDebug("LayoutLifecyclePanel", {
    dep,
    bump,
  });

  function pushLog(message: string) {
    debugLog(message);
    setLogs((current) =>
      [...current, `${new Date().toLocaleTimeString()} ${message}`].slice(-20),
    );
  }

  useLayoutEffect(() => {
    pushLog("[layout empty deps] setup");
    return () => {
      debugLog("[layout empty deps] cleanup");
    };
  }, []);

  useLayoutEffect(() => {
    pushLog(`[layout dep=${dep}] setup`);
    return () => {
      debugLog(`[layout dep=${dep}] cleanup`);
    };
  }, [dep]);

  useLayoutEffect(() => {
    noDepsCount.current += 1;
    debugLog(`[layout no deps] setup #${noDepsCount.current}`);
    return () => {
      debugLog(`[layout no deps] cleanup #${noDepsCount.current}`);
    };
  });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="LayoutLifecyclePanel" count={renders} />
      <h3>useLayoutEffect lifecycle</h3>
      <p className="state-demo-note">
        Same dependency rules as <code>useEffect</code>, but runs before the
        browser paints.
      </p>
      <div className="effect-demo-controls">
        <button type="button" onClick={() => setDep((value) => value + 1)}>
          Change dep ({dep})
        </button>
        <button type="button" onClick={() => setBump((value) => value + 1)}>
          Re-render only ({bump})
        </button>
      </div>
      <p className="state-demo-note">no-deps layout runs: {noDepsCount.current}</p>
      <div className="effect-demo-log">
        {logs.length === 0 ? (
          <p className="effect-demo-log-empty">Waiting for layout effect logs...</p>
        ) : (
          <ul>
            {logs.map((entry, index) => (
              <li key={`${entry}-${index}`}>{entry}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function UseLayoutEffectDemo() {
  const [active, setActive] = useState(false);
  const { count: renders } = useRenderDebug("UseLayoutEffectDemo", { active });

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="UseLayoutEffectDemo" count={renders} />
      <h2>useLayoutEffect playground</h2>
      <p className="drill-description">
        <code>useLayoutEffect</code> runs after DOM updates but before paint.
        Use it for DOM measurements and layout fixes. Prefer{" "}
        <code>useEffect</code> for everything else.
      </p>
      <button type="button" onClick={() => setActive((value) => !value)}>
        {active ? "Hide markers" : "Show markers"}
      </button>
      <EffectMeasurePanel active={active} />
      <LayoutMeasurePanel active={active} />
      <LayoutLifecyclePanel />
      <ul className="effect-demo-legend">
        <li>
          <code>useEffect</code> — after paint (may flash wrong layout first)
        </li>
        <li>
          <code>useLayoutEffect</code> — before paint (blocks visual update
          briefly)
        </li>
      </ul>
    </section>
  );
}

export default memo(UseLayoutEffectDemo);
