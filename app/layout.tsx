import "./globals.css";

import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast';
import NextTopLoader from 'nextjs-toploader';
import SmoothScroll from '@/components/providers/smooth-scroll';
import { Geist, Geist_Mono, Fraunces } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "BookUrEvents - Luxury Event Planning & Management",
    template: '%s - BookUrEvents',
  },
  description:
    "BookUrEvents is a premium event management company crafting unforgettable corporate events, luxury weddings, and private celebrations across India. From concept to flawless execution, we design moments that stay with you.",
  keywords: [
    "luxury event management",
    "corporate event planner",
    "wedding planner India",
    "premium event company",
    "BookUrEvents",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
        <NextTopLoader color="#D4AF37" height={2} showSpinner={false} />
        <Toaster position="top-right" reverseOrder={false} />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
