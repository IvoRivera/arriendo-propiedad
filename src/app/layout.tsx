import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Departamento Premium Frente al Mar | La Serena, Cuatro Esquinas",
  description:
    "Exclusivo departamento en La Serena (Cuatro Esquinas). 2 Dormitorios, terraza frontal al Pacífico, diseño premium. Reserva tu estadía.",
  keywords: "departamento La Serena, arriendo frente al mar, Cuatro Esquinas, Edificio Playa Serena",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${inter.variable} ${newsreader.variable} antialiased bg-[#faf7f2] text-[#2c2416]`}
      >
        {children}
      </body>
    </html>
  );
}
