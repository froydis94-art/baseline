import type { Metadata } from "next";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Onboarding — Baseline",
  description:
    "The medication creates the window. Kalibrer vaneløkker, Withings og SOS.",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
