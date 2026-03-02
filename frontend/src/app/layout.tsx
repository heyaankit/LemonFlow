import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LemonFlow - ML Experiment Tracking System",
  description: "A lightweight Machine Learning Experiment Tracking System for managing projects, experiments, runs, metrics, and artifacts.",
  keywords: ["ML", "Machine Learning", "Experiment Tracking", "MLFlow", "FastAPI", "Next.js", "TypeScript"],
  authors: [{ name: "LemonFlow Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "LemonFlow - ML Experiment Tracking",
    description: "Track your ML experiments, runs, metrics and artifacts",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LemonFlow - ML Experiment Tracking",
    description: "Track your ML experiments, runs, metrics and artifacts",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
