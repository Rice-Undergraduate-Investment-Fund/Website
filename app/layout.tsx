import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "./globals.css";
import { isLiveSite } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://financegroup.rice.edu"),
  title: {
    default: "Rice Finance | Rice Undergraduate Investment Fund",
    template: "%s | Rice Finance",
  },
  description:
    "The Rice Undergraduate Investment Fund (RUIF) is Rice University's student-run investment fund.",
  // Keep draft/preview deployments out of search results (see lib/site.ts).
  robots: isLiveSite ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#00205b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
