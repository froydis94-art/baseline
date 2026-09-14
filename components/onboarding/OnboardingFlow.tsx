"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { StepDefense } from "@/components/onboarding/StepDefense";
import { StepPaywall } from "@/components/onboarding/StepPaywall";
import { StepTriggers } from "@/components/onboarding/StepTriggers";
import { StepWindow } from "@/components/onboarding/StepWindow";
import { StepWithings } from "@/components/onboarding/StepWithings";
import { Button } from "@/components/ui/Button";
import {
  EMPTY_PROFILE,
  loadProfile,
  saveProfile,
  type OnboardingProfile,
} from "@/lib/onboarding";
import { cn } from "@/lib/utils";

const LAST_STEP = 4;

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [profile, setProfile] = useState<OnboardingProfile>(EMPTY_PROFILE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadProfile();
    if (stored) setProfile(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveProfile(profile);
  }, [profile, ready]);

  function update(partial: Partial<OnboardingProfile>) {
    setProfile((current) => ({ ...current, ...partial }));
  }

  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
  }

  const canContinue =
    (step === 0 && profile.windowPhase !== null) ||
    (step === 1 && profile.selectedTriggers.length > 0) ||
    (step === 2 && profile.withingsConnected) ||
    (step === 3 && profile.sosCalibrated);

  function startTrial() {
    const completed: OnboardingProfile = {
      ...profile,
      completed: true,
      trialStartedAt: new Date().toISOString(),
    };
    saveProfile(completed);
    setProfile(completed);
    router.push("/");
  }

  if (!ready) {
    return <div className="min-h-screen bg-obsidian" />;
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 py-8 sm:py-12">
      <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-slate-500">
        Baseline · onboarding
      </p>
      <div className="mt-5 flex gap-1.5" aria-label={`Steg ${step + 1} av 5`}>
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              index <= step ? "bg-sage" : "bg-line",
            )}
          />
        ))}
      </div>

      <div className="relative mt-8 flex-1">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -28 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {step === 0 ? (
              <StepWindow
                value={profile.windowPhase}
                onChange={(windowPhase) => update({ windowPhase })}
              />
            ) : null}
            {step === 1 ? (
              <StepTriggers
                value={profile.selectedTriggers}
                onChange={(selectedTriggers) => update({ selectedTriggers })}
              />
            ) : null}
            {step === 2 ? (
              <StepWithings
                connected={profile.withingsConnected}
                onConnect={() => update({ withingsConnected: true })}
              />
            ) : null}
            {step === 3 ? (
              <StepDefense
                calibrated={profile.sosCalibrated}
                onCalibrate={() => update({ sosCalibrated: true })}
              />
            ) : null}
            {step === 4 ? <StepPaywall onStartTrial={startTrial} /> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {step < LAST_STEP ? (
        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => go(step - 1)}
            disabled={step === 0}
          >
            Tilbake
          </Button>
          <Button onClick={() => go(step + 1)} disabled={!canContinue}>
            Fortsett
          </Button>
        </div>
      ) : (
        <div className="mt-8">
          <Button variant="ghost" onClick={() => go(step - 1)}>
            Tilbake
          </Button>
        </div>
      )}
    </div>
  );
}
