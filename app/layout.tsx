import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/source-serif-4";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://financegroup.rice.edu"),
  title: {
    default: "Rice Finance | Rice Undergraduate Investment Fund",
    template: "%s | Rice Finance",
  },
  description:
    "The Rice Undergraduate Investment Fund (RUIF) is Rice University's student-run investment fund.",
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
