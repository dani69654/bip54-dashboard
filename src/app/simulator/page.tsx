import { Suspense } from "react";
import { SimulatorClient } from "@/components/simulator/SimulatorClient";

export default function SimulatorPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-6 py-14 text-fg-muted">
          Loading simulator…
        </div>
      }
    >
      <SimulatorClient />
    </Suspense>
  );
}
