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

const title = `${profile.name} · ${profile.headline}`;

// The share card (public/og.jpg) is what LinkedIn, email and chat show for a pasted link.
export const metadata: Metadata = {
  metadataBase: new URL("https://evayangscm.com"),
  title,
  description: profile.tagline,
  openGraph: {
    title,
    description: profile.tagline,
    type: "website",
    url: "/",
    siteName: profile.name,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: `${profile.name}, ${profile.headline}` }],
  },
  twitter: { card: "summary_large_image", title, description: profile.tagline, images: ["/og.jpg"] },
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
