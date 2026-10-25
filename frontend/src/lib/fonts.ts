import { Fraunces, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

/** Display/identity face — hero headlines, section titles. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

/**
 * Body/UI face. General Sans (Fontshare) is self-hosted locally rather than
 * pulled from Google Fonts — it isn't on Google Fonts, and the brief is
 * explicit about avoiding Inter / the generic template look.
 */
export const generalSans = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    {
      path: "../fonts/GeneralSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/GeneralSans-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/GeneralSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/GeneralSans-Semibold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
});

/** Mono face — tech-stack tags, metadata. */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});
