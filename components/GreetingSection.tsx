"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const NameForm = dynamic(() => import("@/components/NameForm"), { ssr: false });
const Welcome = dynamic(() => import("@/components/Welcome"), { ssr: false });

export default function GreetingSection() {
  const [name, setName] = useState("Guest");

  return (
    <>
      <NameForm onSubmit={setName} onNameChange={setName} throttleMs={300} />
      <Welcome name={name} />
    </>
  );
}
