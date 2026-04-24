import type { Metadata, Viewport } from "next";
import { Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Departamento Premium Frente al Mar | La Serena, Cuatro Esquinas",
  description:
    "Exclusivo departamento en La Serena (Cuatro Esquinas). 2 Dormitorios, terraza frontal al Pacífico, diseño premium. Reserva tu estadía.",
};

import { ConfigProvider } from "@/components/providers/ConfigProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${newsreader.variable} font-sans antialiased bg-[#faf7f2] text-[#2c2416]`}>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
