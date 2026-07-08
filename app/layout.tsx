import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${APP_NAME} — AI-Powered Fan Engagement Platform`,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: ["football", "fan engagement", "stadium", "AI", "matchday", "MIDFIELDER"],
  authors: [{ name: "MIDFIELDER Platform" }],
  creator: "MIDFIELDER",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://midfielder.app"
  ),
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: `${APP_NAME} — AI-Powered Fan Engagement Platform`,
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — AI-Powered Fan Engagement Platform`,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
