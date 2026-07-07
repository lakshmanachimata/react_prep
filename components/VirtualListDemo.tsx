"use client";

import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Virtuoso } from "react-virtuoso";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

const VIRTUAL_LIST_SIZE = 20_000;
const NAIVE_LIST_SIZE = 400;

type ListItem = {
  id: number;
  label: string;
};

const ITEMS: ListItem[] = Array.from({ length: VIRTUAL_LIST_SIZE }, (_, index) => ({
  id: index,
  label: `Row #${index + 1}`,
}));

type MountTracker = {
  registerMount: () => void;
  registerUnmount: () => void;
};

const MountTrackerContext = createContext<MountTracker | null>(null);

function useMountTracker() {
  const tracker = useContext(MountTrackerContext);
  if (!tracker) {
    throw new Error("ListRow must be used inside a mount tracker provider");
  }
  return tracker;
}

// Each row reports mount/unmount so we can count live DOM rows vs total data length.
const ListRow = memo(function ListRow({ item }: { item: ListItem }) {
  const { registerMount, registerUnmount } = useMountTracker();

  useEffect(() => {
    registerMount();
    return registerUnmount;
  }, [registerMount, registerUnmount]);

  return (
    <div className="virtual-list-row">
      <span>{item.label}</span>
    </div>
  );
});

function MountTrackerProvider({
  children,
  onCountChange,
}: {
  children: React.ReactNode;
  onCountChange: (count: number) => void;
}) {
  const countRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  const scheduleReport = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      onCountChange(countRef.current);
    });
  }, [onCountChange]);

  const registerMount = useCallback(() => {
    countRef.current += 1;
    scheduleReport();
  }, [scheduleReport]);

  const registerUnmount = useCallback(() => {
    countRef.current = Math.max(0, countRef.current - 1);
    scheduleReport();
  }, [scheduleReport]);

  const value = useMemo(
    () => ({ registerMount, registerUnmount }),
    [registerMount, registerUnmount],
  );

  return (
    <MountTrackerContext.Provider value={value}>
      {children}
    </MountTrackerContext.Provider>
  );
}

function NaiveListPanel() {
  const [showNaive, setShowNaive] = useState(false);
  const [mountedRows, setMountedRows] = useState(0);
  const naiveItems = useMemo(() => ITEMS.slice(0, NAIVE_LIST_SIZE), []);
  const { count: renders } = useRenderDebug("NaiveListPanel", {
    showNaive,
    mountedRows,
  });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="NaiveListPanel" count={renders} />
      <h3>1. Naive list (no windowing)</h3>
      <p>
        Renders every row in the DOM. Capped at <strong>{NAIVE_LIST_SIZE}</strong>{" "}
        items here — still heavy. Imagine {VIRTUAL_LIST_SIZE.toLocaleString()}.
      </p>
      <label className="effect-demo-toggle">
        <input
          type="checkbox"
          checked={showNaive}
          onChange={(event) => setShowNaive(event.target.checked)}
        />
        Mount naive list ({NAIVE_LIST_SIZE} DOM nodes)
      </label>
      {showNaive && (
        <>
          <p className="state-demo-note">
            Live row components mounted: <strong>{mountedRows}</strong> /{" "}
            {NAIVE_LIST_SIZE}
          </p>
          <MountTrackerProvider onCountChange={setMountedRows}>
            <div className="virtual-list-viewport virtual-list-viewport--naive">
              {naiveItems.map((item) => (
                <ListRow key={item.id} item={item} />
              ))}
            </div>
          </MountTrackerProvider>
        </>
      )}
    </div>
  );
}

function VirtualizedListPanel() {
  const [mountedRows, setMountedRows] = useState(0);
  const { count: renders } = useRenderDebug("VirtualizedListPanel", {
    mountedRows,
  });

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="VirtualizedListPanel" count={renders} />
      <h3>2. react-virtuoso (windowing)</h3>
      <p>
        <code>Virtuoso</code> only mounts rows near the viewport — scroll through{" "}
        <strong>{VIRTUAL_LIST_SIZE.toLocaleString()}</strong> items smoothly.
        Alternative: <code>react-window</code> (<code>FixedSizeList</code>).
      </p>
      <p className="state-demo-note">
        Live row components mounted: <strong>{mountedRows}</strong> /{" "}
        {VIRTUAL_LIST_SIZE.toLocaleString()} (only a small window)
      </p>
      <MountTrackerProvider onCountChange={setMountedRows}>
        {/* Virtuoso sets height: 100% inline — parent must have a fixed height. */}
        <div className="virtual-list-shell">
          <Virtuoso
            data={ITEMS}
            fixedItemHeight={10}
            itemContent={(_index, item) => <ListRow item={item} />}
            style={{ height: "100%" }}
          />
        </div>
      </MountTrackerProvider>
    </div>
  );
}

function VirtualListDemo() {
  const { count } = useRenderDebug("VirtualListDemo");

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="VirtualListDemo" count={count} />
      <h2>List virtualization (react-virtuoso)</h2>
      <p className="drill-description">
        Large lists should not render every item. Windowing recycles a small set
        of DOM nodes as you scroll. Compare live mounted row counts below.
      </p>

      <div className="state-demo-panel">
        <h3>Why virtualize?</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>Memory</strong> — fewer DOM nodes and React fibers
          </li>
          <li>
            <strong>Scroll performance</strong> — constant work regardless of list
            size
          </li>
          <li>
            <strong>Initial paint</strong> — no 10k+ first render
          </li>
        </ul>
      </div>

      <NaiveListPanel />
      <VirtualizedListPanel />
    </section>
  );
}

export default memo(VirtualListDemo);
