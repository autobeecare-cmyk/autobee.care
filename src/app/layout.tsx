import type { Metadata } from "next";
import { Outfit, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "600", "700", "800"],
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Autobee | Smart Vehicle Care at Your Fingertips in Trivandrum",
  description: "The smarter way to manage your vehicle care in Trivandrum, Kerala. Book exact time slots for premium washes, get transparent pricing, and enjoy our on-time guarantee. Join the waitlist for early access!",
  keywords: ["vehicle care Trivandrum", "car wash Kerala", "doorstep car wash", "Autobee", "car service app", "Trivandrum car care"],
  authors: [{ name: "Autobee Team" }],
  metadataBase: new URL("https://autobee.care"),
  openGraph: {
    title: "Autobee | Smart Vehicle Care in Trivandrum",
    description: "Book exact time slots for premium washes and manage your vehicle care all in one app. Launching soon in Trivandrum.",
    url: "/",
    siteName: "Autobee",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Autobee | Smart Vehicle Care in Trivandrum",
    description: "The smarter way to manage your vehicle care. Book exact time slots and skip the wait.",
  },
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
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
      className={`${outfit.variable} ${instrument.variable} dark antialiased scroll-smooth`}
    >
      <body className="font-instrument bg-black text-white min-h-screen overflow-x-hidden">
        {children}
        <Toaster position="top-center" richColors theme="dark" />
      </body>
    </html>
  );
}
