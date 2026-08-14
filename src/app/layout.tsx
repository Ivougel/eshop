import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { TelegramInit } from "@/components/TelegramInit";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Пополнение",
  description: "Подарочные карты и пополнение цифровых сервисов",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0e0e10",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0e0e10] font-sans text-white">
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <TelegramInit />
        <main className="mx-auto w-full max-w-md px-4 py-5">{children}</main>
      </body>
    </html>
  );
}
