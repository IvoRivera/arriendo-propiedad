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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

import { ConfigProvider } from "@/components/providers/ConfigProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Bug Guard: Previene que inyecciones Web3 de navegadores móviles crasheen la app */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (typeof window !== 'undefined' && (window.ethereum === undefined || window.ethereum === null)) {
                  window.ethereum = { selectedAdress: undefined };
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${newsreader.variable} font-sans antialiased bg-[#faf7f2] text-[#2c2416]`}>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
