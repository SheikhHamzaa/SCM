import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PolyTex Supply Chain Management",
  description:
    "Comprehensive supply chain management platform inspired by QuickBooks design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body
          className={`${inter.variable} font-sans antialiased`}
          suppressHydrationWarning={true}
          >
          {children}
          <Toaster 
            position="top-right"
            expand={true}
            richColors={true}
            closeButton={true}
          />
        </body>
      </html>
  );
}
