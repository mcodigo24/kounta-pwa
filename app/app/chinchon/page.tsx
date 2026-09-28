import type { Metadata } from "next";
import { ChinChonScreen } from "@/src/games/chinchon/ChinChonScreen";
import { ClientOnly } from "@/src/shared/ui/ClientOnly";

export const metadata: Metadata = { title: "Chin Chon" };

export default function ChinChonPage() {
  return (
    <ClientOnly>
      <ChinChonScreen />
    </ClientOnly>
  );
}
