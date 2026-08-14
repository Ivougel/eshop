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
    <html lang="ru" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-[#08090c] font-sans text-white" suppressHydrationWarning>
        <Script id="icity-tg-capture" strategy="beforeInteractive">
          {`(function(){try{var h=location.hash.replace(/^#/,"");var q=location.search.replace(/^\\?/,"");var sid=new URLSearchParams(q).get("sid")||decodeURIComponent((location.pathname.match(/^\\/s\\/([^/]+)/)||[])[1]||"");if(sid)sessionStorage.setItem("icity-tg-sid",sid);function pick(s){if(!s)return"";var p=new URLSearchParams(s);var d=p.get("tgWebAppData");if(d)return d;if(p.get("user")&&p.get("hash"))return s;return""}var d=pick(h)||pick(q);if(!d)return;sessionStorage.setItem("icity-tg-init",d);var u=new URLSearchParams(d).get("user");if(u)sessionStorage.setItem("icity-tg-user",u);}catch(e){}})();`}
        </Script>
        <TelegramInit />
        <main className="mx-auto w-full max-w-[420px]">{children}</main>
      </body>
    </html>
  );
}
