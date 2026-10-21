import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { person } from "@/lib/data";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const title = `${person.first} ${person.last} — ${person.role}`;

export const metadata: Metadata = {
  title,
  description: person.tagline,
  openGraph: { title, description: person.tagline, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#080706",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${jetbrains.variable} ${instrument.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
