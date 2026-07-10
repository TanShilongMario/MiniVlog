export const VLOG_DURATION = 30;
export const PREVIEW_LONG_EDGE = 720;
export const EXPORT_FPS = 24;

export type RatioId = "16:9" | "9:16" | "4:3" | "3:4";
export type TemplateId = "wander" | "memory" | "spark";
export type MotionType = "zoom-in" | "zoom-out" | "pan-up" | "pan-side";

export type PhotoItem = {
  id: string;
  file: File;
  name: string;
  url: string;
};

export type VlogTemplate = {
  id: TemplateId;
  title: string;
  eyebrow: string;
  description: string;
  music: string;
  musicTitle: string;
  transition: number;
  zoomMin: number;
  zoomMax: number;
  panStrength: number;
  motions: MotionType[];
  colors: [string, string, string];
};

export const RATIOS: Record<RatioId, { label: string; note: string; width: number; height: number }> = {
  "16:9": { label: "16:9", note: "横屏 · 屏幕", width: 1280, height: 720 },
  "9:16": { label: "9:16", note: "竖屏 · 短视频", width: 720, height: 1280 },
  "4:3": { label: "4:3", note: "横屏 · 复古", width: 960, height: 720 },
  "3:4": { label: "3:4", note: "竖屏 · 图文", width: 720, height: 960 },
};

export const TEMPLATES: VlogTemplate[] = [
  {
    id: "wander",
    title: "清新漫游",
    eyebrow: "WANDER",
    description: "明亮、自然，像慢慢翻开一段旅行日记。",
    music: "/music/interstellar-space.mp3",
    musicTitle: "Interstellar Space",
    transition: 0.65,
    zoomMin: 1.055,
    zoomMax: 1.12,
    panStrength: 0.58,
    motions: ["zoom-in", "pan-up", "pan-side", "zoom-in"],
    colors: ["#dfffe9", "#8df1c5", "#3b6d5d"],
  },
  {
    id: "memory",
    title: "温柔回忆",
    eyebrow: "MEMORY",
    description: "舒缓、温暖，留出更多时间感受每一个画面。",
    music: "/music/tender-moment.mp3",
    musicTitle: "Tender Moment",
    transition: 0.9,
    zoomMin: 1.06,
    zoomMax: 1.105,
    panStrength: 0.42,
    motions: ["zoom-out", "pan-side", "zoom-out", "pan-up"],
    colors: ["#fff0db", "#e6b99d", "#855e57"],
  },
  {
    id: "spark",
    title: "活力瞬间",
    eyebrow: "SPARK",
    description: "轻快、有节奏，适合聚会和充满能量的日常。",
    music: "/music/happy-clappy.mp3",
    musicTitle: "Happy Clappy",
    transition: 0.35,
    zoomMin: 1.07,
    zoomMax: 1.135,
    panStrength: 0.7,
    motions: ["zoom-in", "pan-side", "pan-up", "zoom-out", "zoom-in"],
    colors: ["#e7f0ff", "#a8baff", "#5159a7"],
  },
];

export function getTemplate(id: TemplateId) {
  return TEMPLATES.find((template) => template.id === id) ?? TEMPLATES[0];
}

export function previewDimensions(ratio: RatioId) {
  const { width, height } = RATIOS[ratio];
  if (width >= height) {
    return { width: PREVIEW_LONG_EDGE, height: Math.round((PREVIEW_LONG_EDGE * height) / width) };
  }
  return { width: Math.round((PREVIEW_LONG_EDGE * width) / height), height: PREVIEW_LONG_EDGE };
}

export async function loadImages(photos: PhotoItem[]) {
  return Promise.all(
    photos.map(
      (photo) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const image = new Image();
          image.decoding = "async";
          image.onload = () => resolve(image);
          image.onerror = () => reject(new Error(`无法读取 ${photo.name}`));
          image.src = photo.url;
        }),
    ),
  );
}

function mulberry32(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  const x = clamp(value, 0, 1);
  return x * x * (3 - 2 * x);
}

function drawCover(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  image: CanvasImageSource & { width: number; height: number },
  width: number,
  height: number,
  progress: number,
  template: VlogTemplate,
  seed: number,
  index: number,
  alpha: number,
) {
  const random = mulberry32(seed + index * 104729 + template.id.length * 7919);
  const motion = template.motions[Math.floor(random() * template.motions.length)];
  const minZoom = template.zoomMin + random() * 0.012;
  const maxZoom = template.zoomMax - random() * 0.01;
  const eased = smoothstep(progress);
  const zoom = motion === "zoom-out" ? maxZoom + (minZoom - maxZoom) * eased : minZoom + (maxZoom - minZoom) * eased;
  const baseScale = Math.max(width / image.width, height / image.height);
  const scale = baseScale * zoom;
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const availableX = Math.max(0, (drawWidth - width) / 2);
  const availableY = Math.max(0, (drawHeight - height) / 2);
  const direction = random() > 0.5 ? 1 : -1;
  let offsetX = 0;
  let offsetY = 0;

  if (motion === "pan-side") {
    offsetX = direction * availableX * template.panStrength * (eased * 2 - 1);
  } else if (motion === "pan-up") {
    offsetY = availableY * template.panStrength * (0.65 - eased * 1.3);
  } else {
    offsetX = direction * availableX * 0.13 * (eased * 2 - 1);
    offsetY = availableY * 0.12 * (0.5 - eased);
  }

  context.save();
  context.globalAlpha = alpha;
  context.drawImage(image, (width - drawWidth) / 2 + offsetX, (height - drawHeight) / 2 + offsetY, drawWidth, drawHeight);
  context.restore();
}

export function renderFrame(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  images: HTMLImageElement[],
  template: VlogTemplate,
  seed: number,
  time: number,
) {
  context.fillStyle = "#10110f";
  context.fillRect(0, 0, width, height);
  if (!images.length) return;

  const safeTime = clamp(time, 0, VLOG_DURATION - 0.0001);
  const clipDuration = VLOG_DURATION / images.length;
  const index = Math.min(images.length - 1, Math.floor(safeTime / clipDuration));
  const localTime = safeTime - index * clipDuration;
  const localProgress = localTime / clipDuration;
  const transitionDuration = Math.min(template.transition, clipDuration * 0.38);
  const transitionStart = clipDuration - transitionDuration;

  drawCover(context, images[index], width, height, localProgress, template, seed, index, 1);

  if (index < images.length - 1 && localTime > transitionStart) {
    const mix = smoothstep((localTime - transitionStart) / transitionDuration);
    const nextProgress = ((localTime - transitionStart) / clipDuration) * 0.45;
    drawCover(context, images[index + 1], width, height, nextProgress, template, seed, index + 1, mix);
  }
}

