import type { Metadata } from "next";
import { MiniQuickCutApp } from "./MiniQuickCutApp";

export const metadata: Metadata = {
  title: "MiniQuickCut · 照片一键成片",
  description: "选择 10–30 张照片，在浏览器本地生成一条轻巧、自然、带音乐的相册 Vlog。",
};

export default function Home() {
  return <MiniQuickCutApp />;
}

