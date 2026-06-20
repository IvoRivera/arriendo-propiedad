import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check-in privado",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return children;
}
