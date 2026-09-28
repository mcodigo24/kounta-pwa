import type { Metadata } from "next";
import { TrucoScreen } from "@/src/games/truco/TrucoScreen";
import { ClientOnly } from "@/src/shared/ui/ClientOnly";

export const metadata: Metadata = { title: "Truco" };

export default function TrucoPage() {
  return (
    <ClientOnly>
      <TrucoScreen />
    </ClientOnly>
  );
}
