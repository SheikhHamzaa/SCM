import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppLayout } from "@/components/app-layout";

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
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
