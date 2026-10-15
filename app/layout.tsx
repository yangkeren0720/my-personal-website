import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { profile } from "@/content/site";
import "./globals.css";
import "./sections.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${profile.name} · ${profile.roles[0]}`,
  description: profile.tagline,
  openGraph: { title: profile.name, description: profile.tagline, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
