import type { Metadata } from "next";
import { DiezMilScreen } from "@/src/games/diezmil/DiezMilScreen";
import { ClientOnly } from "@/src/shared/ui/ClientOnly";

export const metadata: Metadata = { title: "10 mil" };

export default function DiezMilPage() {
  return (
    <ClientOnly>
      <DiezMilScreen />
    </ClientOnly>
  );
}
