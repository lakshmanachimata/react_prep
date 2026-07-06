"use client";

import { memo, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

function PortalModal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const { count: renders } = useRenderDebug("PortalModal", { open });

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="portal-backdrop" onClick={onClose} role="presentation">
      <RenderDebugBadge name="PortalModal" count={renders} />
      <div
        className="portal-modal"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
        <button type="button" className="portal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}

function PortalTooltip({
  anchorRef,
  visible,
  text,
}: {
  anchorRef: RefObject<HTMLButtonElement | null>;
  visible: boolean;
  text: string;
}) {
  const { count: renders } = useRenderDebug("PortalTooltip", { visible, text });
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!visible || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPosition({
      top: rect.bottom + window.scrollY + 6,
      left: rect.left + window.scrollX,
    });
  }, [visible, anchorRef, text]);

  if (!visible || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="portal-tooltip"
      style={{ top: position.top, left: position.left }}
      role="tooltip"
    >
      <RenderDebugBadge name="PortalTooltip" count={renders} />
      {text}
    </div>,
    document.body,
  );
}

function PortalHost() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [portalLog, setPortalLog] = useState<string[]>([]);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const { count: renders } = useRenderDebug("PortalHost", {
    modalOpen,
    tooltipVisible,
  });

  function log(message: string) {
    setPortalLog((current) =>
      [`${new Date().toLocaleTimeString()} ${message}`, ...current].slice(0, 8),
    );
  }

  return (
    <div className="state-demo-panel portal-host">
      <RenderDebugBadge name="PortalHost" count={renders} />
      <h3>Portal host (clipped container)</h3>
      <p className="state-demo-note">
        This box has <code>overflow: hidden</code>. Without a portal, a modal would
        be clipped. <code>createPortal</code> renders into <code>document.body</code>{" "}
        instead.
      </p>

      <div className="effect-demo-controls">
        <button type="button" onClick={() => setModalOpen(true)}>
          Open modal portal
        </button>
        <button
          ref={anchorRef}
          type="button"
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
          onFocus={() => setTooltipVisible(true)}
          onBlur={() => setTooltipVisible(false)}
        >
          Hover for tooltip portal
        </button>
        <button
          type="button"
          onClick={() => log("Host button clicked — event stays in React tree")}
        >
          Log host click
        </button>
      </div>

      <PortalModal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3>Modal via portal</h3>
        <p>
          DOM parent is <code>document.body</code>, but this is still a child of{" "}
          <code>PortalHost</code> in the <strong>React tree</strong>.
        </p>
        <button
          type="button"
          onClick={() => log("Modal button clicked — bubbles in React tree")}
        >
          Click inside modal
        </button>
      </PortalModal>

      <PortalTooltip
        anchorRef={anchorRef}
        visible={tooltipVisible}
        text="Tooltip rendered in document.body"
      />

      <div className="effect-demo-log">
        <p>
          <strong>Event log</strong>
        </p>
        {portalLog.length === 0 ? (
          <p className="effect-demo-log-empty">Click buttons to see events.</p>
        ) : (
          <ul>
            {portalLog.map((entry) => (
              <li key={entry}>{entry}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PortalDemo() {
  const { count: renders } = useRenderDebug("PortalDemo");

  return (
    <section className="effect-demo state-demo portal-demo">
      <RenderDebugBadge name="PortalDemo" count={renders} />
      <h2>React Portal playground</h2>
      <p className="drill-description">
        <code>createPortal(children, domNode)</code> renders UI into a different DOM
        node while keeping the same React component tree (context, events).
      </p>

      <div className="state-demo-panel">
        <h3>Why portals?</h3>
        <ul className="effect-demo-legend">
          <li>
            <strong>Escape clipping</strong> — modals, tooltips, dropdowns above{" "}
            <code>overflow: hidden</code> parents
          </li>
          <li>
            <strong>Layer on top</strong> — fixed overlays at <code>document.body</code>
          </li>
          <li>
            <strong>React tree unchanged</strong> — context and synthetic events still
            flow as if parent rendered the child
          </li>
          <li>
            <strong>DOM ≠ React tree</strong> — portal content lives elsewhere in the
            DOM, but logically nested under the component that called{" "}
            <code>createPortal</code>
          </li>
        </ul>
      </div>

      <div className="portal-clipped-stage">
        <PortalHost />
      </div>
    </section>
  );
}

export default memo(PortalDemo);
