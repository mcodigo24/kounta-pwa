import type { Metadata } from "next";
import { ComodinScreen } from "@/src/games/comodin/ComodinScreen";
import { ClientOnly } from "@/src/shared/ui/ClientOnly";

export const metadata: Metadata = { title: "Comodín" };

export default function ComodinPage() {
  return (
    <ClientOnly>
      <ComodinScreen />
    </ClientOnly>
  );
}
