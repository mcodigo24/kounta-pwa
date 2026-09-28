import type { Metadata } from "next";
import { GeneralaScreen } from "@/src/games/generala/GeneralaScreen";
import { ClientOnly } from "@/src/shared/ui/ClientOnly";

export const metadata: Metadata = { title: "Generala" };

export default function GeneralaPage() {
  return (
    <ClientOnly>
      <GeneralaScreen />
    </ClientOnly>
  );
}
