import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { BackButton } from "@/components/BackButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://chancescribe--chancescribe.us-east4.hosted.app"),
  title: "ChanceScribe — Power your thinking with ChanceScribe AI",
  description: "Dictate, research, and create with GPT-5.4. Upload any source, ask anything, and generate AI podcasts from your content.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "ChanceScribe",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "ChanceScribe — Power your thinking with ChanceScribe AI",
    description: "Frictionless Intelligence. Privacy-Native. Dictate, research, and understand deeper with GPT-5.4.",
    url: "https://chancescribe--chancescribe.us-east4.hosted.app",
    siteName: "ChanceScribe",
    images: [
      {
        url: "/og-image.png",
        width: 1024,
        height: 1024,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ChanceScribe — Power your thinking with ChanceScribe AI",
    description: "Frictionless Intelligence. Privacy-Native. Dictate, research, and understand deeper with GPT-5.4.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#050508]">
        <AuthProvider>
          <BackButton />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}


