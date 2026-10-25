import type { Metadata } from "next";
import "./globals.css";
import { fraunces, generalSans, jetbrainsMono } from "@/lib/fonts";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: {
    default: "mmi404 — Developer Portfolio",
    template: "%s | mmi404",
  },
  description:
    "Full-stack web & mobile engineering portfolio — projects, case studies, and contact.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${generalSans.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-surface text-primary antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
