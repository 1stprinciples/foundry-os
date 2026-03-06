import type { Metadata } from "next";
import {
  Bodoni_Moda,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import "./globals.css";

const display = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const body = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://foundry.local"),
  title: {
    default: "Foundry OS",
    template: "%s | Foundry OS",
  },
  description:
    "Foundry OS is an autonomous venture studio that researches, launches, operates, and grows internet businesses through coordinated AI agents.",
  openGraph: {
    title: "Foundry OS",
    description:
      "Autonomous operators for venture creation, product shipping, growth, and daily execution.",
    url: "https://foundry.local",
    siteName: "Foundry OS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Foundry OS",
    description:
      "Autonomous operators for venture creation, product shipping, growth, and daily execution.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
