"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import RenderDebugBadge from "@/components/RenderDebugBadge";
import { useRenderDebug } from "@/hooks/useRenderDebug";

const FruitSection = dynamic(() => import("@/components/FruitSection"), { ssr: false });
const PropRoot = dynamic(() => import("@/components/prop-drilling/PropRoot"), {
  ssr: false,
});
const UseEffectDemo = dynamic(() => import("@/components/UseEffectDemo"), {
  ssr: false,
});
const UseStateDemo = dynamic(() => import("@/components/UseStateDemo"), {
  ssr: false,
});
const HookDemosSection = dynamic(() => import("@/components/HookDemosSection"), {
  ssr: false,
});

const NameForm = dynamic(() => import("@/components/NameForm"), { ssr: false });
const Welcome = dynamic(() => import("@/components/Welcome"), { ssr: false });

export default function GreetingSection() {
  const [name, setName] = useState("Guest");
  const [showEffectDemo, setShowEffectDemo] = useState(false);
  const [showStateDemo, setShowStateDemo] = useState(false);
  const { count } = useRenderDebug("GreetingSection", {
    name,
    showEffectDemo,
    showStateDemo,
  });

  return (
    <>
      {/* <RenderDebugBadge name="GreetingSection" count={count} />
      <NameForm onSubmit={setName} onNameChange={setName} throttleMs={300} />
      <Welcome name={name} /> */}
      {/* <FruitSection />  */}
      {/* <PropRoot /> */}
      <label className="effect-demo-toggle">
        <input
          type="checkbox"
          checked={showStateDemo}
          onChange={(event) => setShowStateDemo(event.target.checked)}
        />
        Show useState demo
      </label>
      {showStateDemo && <UseStateDemo />}
      <label className="effect-demo-toggle">
        <input
          type="checkbox"
          checked={showEffectDemo}
          onChange={(event) => setShowEffectDemo(event.target.checked)}
        />
        Show useEffect demo (uncheck to test unmount cleanup)
      </label>
      {showEffectDemo && <UseEffectDemo />}
      <HookDemosSection />
    </>
  );
}
