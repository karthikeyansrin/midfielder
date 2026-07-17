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

import { FanStateProvider } from "@/store/FanStateProvider";

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Defeat Next.js build-time static replacement by accessing process.env dynamically
  const env = process.env;
  const runtimeEnv = {
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  return (
    <html lang="en" className={`${inter.variable} dark h-full`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__RUNTIME_ENV__ = ${JSON.stringify(runtimeEnv)};`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg">Skip to main content</a>
        <FanStateProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </FanStateProvider>
      </body>
    </html>
  );
}
