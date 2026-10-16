import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";

const DESC =
  "Dual-degree engineer building at the seam of model and machine — world models, RL, agentic AI, RTL, verification, edge AI and the silicon that runs them.";

export const metadata: Metadata = {
  title: {
    default: "Tanush Pavan V — Intelligent systems, end to end",
    template: "%s",
  },
  description: DESC,
  metadataBase: new URL("https://tanushpavan.vercel.app"),
  applicationName: "Tanush Pavan V",
  authors: [{ name: "Tanush Pavan V", url: "https://github.com/HUNT-001" }],
  keywords: [
    "Tanush Pavan", "RTL verification", "agentic AI", "edge AI", "RISC-V",
    "SystemVerilog", "BNN accelerator", "world models", "EDA", "FPGA", "Versal",
  ],
  openGraph: {
    title: "Tanush Pavan V — Intelligent systems, end to end",
    description: "World models to the silicon that runs them.",
    url: "https://tanushpavan.vercel.app",
    siteName: "Tanush Pavan V",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tanush Pavan V — Intelligent systems, end to end",
    description: "World models to the silicon that runs them.",
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#05070d",
};

// Fonts are loaded via <link> (not next/font) so the build never depends on a
// network fetch. The actual family names are wired through CSS vars in globals.css.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothScroll />
        <ScrollProgress />
        <Nav />
        {children}
      </body>
    </html>
  );
}
