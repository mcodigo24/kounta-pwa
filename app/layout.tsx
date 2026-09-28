import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { ServiceWorkerRegister } from "@/src/pwa/ServiceWorkerRegister";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Kounta — Anotador de puntajes", template: "%s · Kounta" },
  description:
    "Anotador de puntajes para tus juegos de cartas y dados favoritos: Truco, Generala, Chin Chon, 10 mil y Comodín. Sin cuentas, sin anuncios, sin conexión.",
  applicationName: "Kounta",
  appleWebApp: { capable: true, title: "Kounta", statusBarStyle: "black-translucent" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#3D3128",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} antialiased`}>
      <body>
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
