import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { sparkHandFont } from "./spark-font";
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
  title: "MiniQuickCut · 照片一键成片",
  description: "无需剪辑，在浏览器本地把 10–30 张照片变成一条带音乐的轻量相册 Vlog。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable} ${sparkHandFont.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <span className={sparkHandFont.className} aria-hidden="true" style={{ height: 0, overflow: "hidden", position: "absolute", width: 0 }}>
          预
        </span>
        {children}
      </body>
    </html>
  );
}
