import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import { TelegramInit } from "@/components/TelegramInit";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
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
  themeColor: "#08090c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#08090c] font-sans text-white">
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
        <TelegramInit />
        <main className="mx-auto w-full max-w-[420px]">{children}</main>
      </body>
    </html>
  );
}
