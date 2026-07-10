import { registerAacEncoder } from "@mediabunny/aac-encoder";
import {
  AudioBufferSource,
  BufferTarget,
  CanvasSource,
  Mp4OutputFormat,
  Output,
  canEncodeAudio,
  canEncodeVideo,
} from "mediabunny";
import {
  EXPORT_FPS,
  RATIOS,
  VLOG_DURATION,
  type PhotoItem,
  type RatioId,
  type VlogTemplate,
  loadImages,
  renderFrame,
} from "./vlog-core";

type ExportOptions = {
  photos: PhotoItem[];
  ratio: RatioId;
  template: VlogTemplate;
  seed: number;
  onProgress: (progress: number) => void;
};

let aacFallbackRegistered = false;

async function prepareAudio(src: string) {
  const response = await fetch(src);
  if (!response.ok) throw new Error("模板音乐加载失败，请刷新后重试。");

  const context = new AudioContext();
  try {
    const decoded = await context.decodeAudioData(await response.arrayBuffer());
    const frameCount = Math.min(decoded.length, Math.floor(VLOG_DURATION * decoded.sampleRate));
    const trimmed = new AudioBuffer({
      length: frameCount,
      numberOfChannels: decoded.numberOfChannels,
      sampleRate: decoded.sampleRate,
    });
    const fadeFrames = Math.min(frameCount / 2, Math.floor(decoded.sampleRate * 0.8));

    for (let channel = 0; channel < decoded.numberOfChannels; channel += 1) {
      const source = decoded.getChannelData(channel);
      const target = trimmed.getChannelData(channel);
      for (let index = 0; index < frameCount; index += 1) {
        const fadeIn = Math.min(1, index / fadeFrames);
        const fadeOut = Math.min(1, (frameCount - index - 1) / fadeFrames);
        target[index] = source[index] * Math.min(fadeIn, fadeOut) * 0.82;
      }
    }
    return trimmed;
  } finally {
    await context.close();
  }
}

export async function exportVlog({ photos, ratio, template, seed, onProgress }: ExportOptions) {
  const size = RATIOS[ratio];
  if (!(await canEncodeVideo("avc", { width: size.width, height: size.height, bitrate: 3_200_000 }))) {
    throw new Error("当前浏览器无法编码 H.264 MP4。请使用最新版 Chrome、Edge 或 Safari。");
  }

  if (!(await canEncodeAudio("aac")) && !aacFallbackRegistered) {
    registerAacEncoder();
    aacFallbackRegistered = true;
  }

  const images = await loadImages(photos);
  const audioBuffer = await prepareAudio(template.music);
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("无法创建视频画布。");

  const target = new BufferTarget();
  const output = new Output({ format: new Mp4OutputFormat({ fastStart: "in-memory" }), target });
  const videoSource = new CanvasSource(canvas, {
    codec: "avc",
    bitrate: 3_200_000,
    keyFrameInterval: 2,
    latencyMode: "quality",
  });
  const audioSource = new AudioBufferSource({ codec: "aac", bitrate: 128_000 });
  output.addVideoTrack(videoSource, { frameRate: EXPORT_FPS });
  output.addAudioTrack(audioSource);
  output.setMetadataTags({ title: `MiniQuickCut · ${template.title}`, artist: "MiniQuickCut" });

  try {
    await output.start();
    await audioSource.add(audioBuffer);
    audioSource.close();

    const totalFrames = VLOG_DURATION * EXPORT_FPS;
    const frameDuration = 1 / EXPORT_FPS;
    for (let frame = 0; frame < totalFrames; frame += 1) {
      const timestamp = frame * frameDuration;
      renderFrame(context, size.width, size.height, images, template, seed, timestamp);
      await videoSource.add(timestamp, frameDuration, { keyFrame: frame % (EXPORT_FPS * 2) === 0 });
      if (frame % 6 === 0 || frame === totalFrames - 1) onProgress((frame + 1) / totalFrames);
    }
    videoSource.close();
    await output.finalize();
  } catch (error) {
    if (output.state !== "canceled" && output.state !== "finalized") await output.cancel();
    throw error;
  }

  if (!target.buffer) throw new Error("MP4 文件生成失败。");
  return new Blob([target.buffer], { type: "video/mp4" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 2_000);
}

