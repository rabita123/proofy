import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Proofy",
  description: "Save proof of your work so you never lose client history",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          input::placeholder {
            color: #6b7280 !important;
            opacity: 1 !important;
            -webkit-text-fill-color: #6b7280 !important;
          }

          input::-webkit-input-placeholder {
            color: #6b7280 !important;
            -webkit-text-fill-color: #6b7280 !important;
          }

          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-text-fill-color: #1f2937 !important;
            -webkit-box-shadow: 0 0 0px 1000px white inset !important;
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}