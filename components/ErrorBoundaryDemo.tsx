"use client";

import { Component, memo, useState, type ErrorInfo, type ReactNode } from "react";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

type BoundaryState = {
  hasError: boolean;
  message: string | null;
};

type BoundaryProps = {
  children: ReactNode;
  onReset: () => void;
};

// Error boundaries must be class components (no hook equivalent yet).
class DemoErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false, message: null };

  static getDerivedStateFromError(error: Error): BoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[DemoErrorBoundary]", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: null });
    this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="state-demo-panel error-boundary-fallback">
          <h3>Something went wrong</h3>
          <p>{this.state.message}</p>
          <button type="button" onClick={this.handleReset}>
            Reset boundary
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function BuggyCounter() {
  const [count, setCount] = useState(0);
  const [armed, setArmed] = useState(false);
  const { count: renders } = useRenderDebug("BuggyCounter", { count, armed });

  if (armed && count >= 3) {
    throw new Error("Counter reached the danger zone (3+)");
  }

  return (
    <div className="state-demo-panel">
      <RenderDebugBadge name="BuggyCounter" count={renders} />
      <h3>Buggy counter</h3>
      <p>
        count: <strong>{count}</strong>
      </p>
      <div className="effect-demo-controls">
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          +1
        </button>
        <button type="button" onClick={() => setArmed(true)}>
          Arm error at 3+
        </button>
      </div>
    </div>
  );
}

function ErrorBoundaryDemo() {
  const [boundaryKey, setBoundaryKey] = useState(0);
  const { count } = useRenderDebug("ErrorBoundaryDemo");

  return (
    <section className="effect-demo state-demo">
      <RenderDebugBadge name="ErrorBoundaryDemo" count={count} />
      <h2>Error boundary</h2>
      <p className="drill-description">
        Render errors in children do not crash the whole app when wrapped in an
        error boundary. The boundary shows fallback UI; siblings keep running.
      </p>
      <DemoErrorBoundary
        key={boundaryKey}
        onReset={() => setBoundaryKey((value) => value + 1)}
      >
        <BuggyCounter />
      </DemoErrorBoundary>
      <p className="state-demo-note">
        This panel stays mounted even when the counter throws.
      </p>
    </section>
  );
}

export default memo(ErrorBoundaryDemo);
