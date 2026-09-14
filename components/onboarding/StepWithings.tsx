"use client";

import { useState } from "react";
import { LeanMassDemo } from "@/components/onboarding/LeanMassDemo";
import { Button } from "@/components/ui/Button";

export function StepWithings({
  connected,
  onConnect,
}: {
  connected: boolean;
  onConnect: () => void;
}) {
  const [pending, setPending] = useState(false);

  function simulate() {
    if (connected || pending) return;
    setPending(true);
    window.setTimeout(() => {
      onConnect();
      setPending(false);
    }, 1100);
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-cyan">
          Body Metrics Over Scale Weight
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
          Beskytt forbrenningen – ikke bare vekten.
        </h1>
        <p className="mt-3 text-base leading-7 text-slate-400">
          Baseline henter Lean Mass og hvilepuls fra Withings via Terra API.
        </p>
      </header>

      <LeanMassDemo />

      <Button
        variant="cyan"
        className="w-full"
        onClick={simulate}
        disabled={pending}
      >
        {connected
          ? "Withings tilkoblet via Terra"
          : pending
            ? "Kobler til Terra…"
            : "Simuler Withings-tilkobling (Terra API)"}
      </Button>
    </div>
  );
}
