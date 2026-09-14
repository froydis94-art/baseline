"use client";

import { Button } from "@/components/ui/Button";

export function SosTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <Button variant="coral" onClick={onOpen} aria-haspopup="dialog">
      <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
      Kjenner du et sug?
    </Button>
  );
}
