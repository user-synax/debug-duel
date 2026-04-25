import { JetBrains_Mono, Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: {
    default: "DebugDuel — Competitive Debugging Platform",
    template: "%s | DebugDuel",
  },
  description: "Race against developers to fix real HTML, CSS, JavaScript, and React bugs. Rank up. Level up.",
  keywords: ["debugging", "coding", "competitive programming", "frontend", "HTML", "CSS", "JavaScript", "React"],
  authors: [{ name: "DebugDuel" }],
  creator: "DebugDuel",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://debugduel.vercel.app",
    title: "DebugDuel — Competitive Debugging Platform",
    description: "Race against developers to fix real HTML, CSS, JavaScript, and React bugs. Rank up. Level up.",
    siteName: "DebugDuel",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DebugDuel - Competitive Debugging Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DebugDuel — Competitive Debugging Platform",
    description: "Race against developers to fix real HTML, CSS, JavaScript, and React bugs. Rank up. Level up.",
    images: ["/og-image.png"],
    creator: "@debugduel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://debugduel.vercel.app",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${geist.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">
        <SessionProvider>{children}</SessionProvider>
        <ServiceWorkerRegister />
        <Toaster />
      </body>
    </html>
  );
}
