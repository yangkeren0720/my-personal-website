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
  title: `${profile.name} · ${profile.headline}`,
  description: profile.tagline,
  openGraph: { title: profile.name, description: profile.tagline, type: "website" },
};

// Runs before paint: a saved choice wins, otherwise bright from 6am to 6pm
// in the visitor's own time zone and dark at night.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");}catch(e){}if(t!=="light"&&t!=="dark"){var h=new Date().getHours();t=h>=6&&h<18?"light":"dark";}document.documentElement.dataset.theme=t;})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
