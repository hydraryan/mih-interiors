import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Best Interior Designer in Chandigarh | MIH Interiors — 18+ Years",
  description: "MIH Interiors — Chandigarh's most trusted interior design firm since 2007. 1000+ completed projects. 3D visualization on every project. Serving Punjab, HP & Delhi.",
  keywords: ["interior designer chandigarh", "home interior design chandigarh", "best interior designer chandigarh"],
  icons: {
    icon: '/mih_interiors_mark.svg',
    shortcut: '/mih_interiors_mark.svg',
    apple: '/mih_interiors_mark.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
      lang="en"
      suppressHydrationWarning
      className={`${jakarta.variable} ${outfit.variable} h-full antialiased smooth-scroll`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
