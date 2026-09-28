import type { Metadata } from "next";
import { BottomNav } from "@/src/shared/ui/BottomNav";

export const metadata: Metadata = { title: "Kounta" };

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      <BottomNav />
    </div>
  );
}
