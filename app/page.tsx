"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dashboard } from "@/components/Dashboard";
import { loadProfile } from "@/lib/onboarding";
import { getFallbackDashboard } from "@/lib/terra";

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onboarded = window.localStorage.getItem("baseline_onboarded");
    if (!onboarded) {
      if (loadProfile()?.completed) {
        window.localStorage.setItem("baseline_onboarded", "true");
        setReady(true);
        return;
      }
      router.replace("/onboarding");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="min-h-screen bg-obsidian" />;
  }

  return <Dashboard dashboard={getFallbackDashboard()} />;
}
