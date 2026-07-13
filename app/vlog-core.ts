import { renderBook3D } from "./book-three";

export const VLOG_DURATION = 30;
export const PREVIEW_LONG_EDGE = 720;
export const EXPORT_FPS = 24;

export type RatioId = "16:9" | "9:16" | "4:3" | "3:4";
export type TemplateId = "wander" | "memory" | "spark" | "film" | "still";
export type MotionType = "zoom-in" | "zoom-out" | "pan-up" | "pan-down" | "pan-left" | "pan-right" | "pan-side";
export type LayoutMode = "cinematic" | "album" | "beat" | "book" | "minimal";

export type MusicTrack = {
  title: string;
  src: string;
  bpm?: number;
  beatOffset?: number;
};

export type VlogTextContent = {
  title: string;
  subtitle: string;
  subtitle2?: string;
  subtitle3?: string;
  closing: string;
};

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
  music: MusicTrack[];
  layout: LayoutMode;
  minShotDuration: number;
  transition: number;
  zoomMin: number;
  zoomMax: number;
  panStrength: number;
  motions: MotionType[];
  colors: [string, string, string];
  textPreset: VlogTextContent;
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
    music: [
      { title: "Bubbles", src: "/music/bubbles.mp3", bpm: 65.05, beatOffset: 0.03 },
      { title: "Somewhere Nice", src: "/music/somewhere-nice.mp3", bpm: 66.26, beatOffset: 0.88 },
    ],
    layout: "cinematic",
    minShotDuration: 2.25,
    transition: 1.45,
    zoomMin: 1.06,
    zoomMax: 1.095,
    panStrength: 0.28,
    motions: ["zoom-in", "pan-left", "zoom-out", "pan-up", "pan-right", "pan-down"],
    colors: ["#dfffe9", "#8df1c5", "#3b6d5d"],
    textPreset: {
      title: "向风而行",
      subtitle: "把沿途的光，收进这一程",
      subtitle2: "风吹过的地方，都有新的故事",
      subtitle3: "慢慢走，也会遇见晴朗",
      closing: "下一站，继续出发",
    },
  },
  {
    id: "memory",
    title: "温柔回忆",
    eyebrow: "MEMORY",
    description: "舒缓、温暖，留出更多时间感受每一个画面。",
    music: [
      { title: "Tender Moment", src: "/music/tender-moment.mp3", bpm: 69.84, beatOffset: 0.72 },
      { title: "Home At Last", src: "/music/home-at-last.mp3", bpm: 68, beatOffset: 0.04 },
    ],
    layout: "album",
    minShotDuration: 2.3,
    transition: 0.9,
    zoomMin: 1.06,
    zoomMax: 1.105,
    panStrength: 0.42,
    motions: ["zoom-out", "pan-side", "zoom-out", "pan-up"],
    colors: ["#fff0db", "#e6b99d", "#855e57"],
    textPreset: { title: "那年今日", subtitle: "有些瞬间，时间从未带走", closing: "谨以此片，珍藏我们的故事" },
  },
  {
    id: "spark",
    title: "活力瞬间",
    eyebrow: "SPARK",
    description: "轻快、有节奏，适合聚会和充满能量的日常。",
    music: [
      { title: "Happy Clappy", src: "/music/happy-clappy.mp3", bpm: 92, beatOffset: 0.28 },
      { title: "Bouncy Gypsy Beats", src: "/music/bouncy-gypsy-beats.mp3", bpm: 92.29, beatOffset: 0.28 },
    ],
    layout: "beat",
    minShotDuration: 1.3,
    transition: 0,
    zoomMin: 1.07,
    zoomMax: 1.135,
    panStrength: 0.7,
    motions: ["zoom-in", "pan-side", "pan-up", "zoom-out", "zoom-in"],
    colors: ["#e7f0ff", "#a8baff", "#5159a7"],
    textPreset: { title: "快乐发生中", subtitle: "GOOD TIMES · GOOD VIBES", closing: "精彩，未完待续！" },
  },
  {
    id: "film",
    title: "翻页手记",
    eyebrow: "TRAVEL BOOK",
    description: "一本悬浮的旅行画册，跟随音乐翻页，交替呈现跨页与双页照片。",
    music: [
      { title: "African Moon", src: "/music/african-moon.mp3", bpm: 80.75, beatOffset: 0.71 },
      { title: "Another Grappa, Monsieur?", src: "/music/another-grappa.mp3", bpm: 112.35, beatOffset: 0 },
    ],
    layout: "book",
    minShotDuration: 1.9,
    transition: 0,
    zoomMin: 1.025,
    zoomMax: 1.07,
    panStrength: 0.45,
    motions: ["pan-left", "pan-right", "zoom-in", "zoom-out"],
    colors: ["#f4edda", "#305bc8", "#d8dce5"],
    textPreset: { title: "翻开旅程", subtitle: "TRAVEL BOOK · 沿途所见", closing: "写于下一页之前" },
  },
  {
    id: "still",
    title: "静谧留白",
    eyebrow: "STILL",
    description: "克制的留白与完整构图，适合安静、细腻的日常。",
    music: [
      { title: "Nova Serenade", src: "/music/nova-serenade.mp3", bpm: 89.1, beatOffset: 0.02 },
      { title: "Somewhere Nice", src: "/music/somewhere-nice.mp3", bpm: 66.26, beatOffset: 0.88 },
    ],
    layout: "minimal",
    minShotDuration: 2.5,
    transition: 1.05,
    zoomMin: 1.015,
    zoomMax: 1.045,
    panStrength: 0.22,
    motions: ["zoom-out", "pan-up", "zoom-in", "pan-right"],
    colors: ["#f5f2e8", "#c8c1b3", "#67665e"],
    textPreset: { title: "寻常日子", subtitle: "平静生活里，也有细碎的光", closing: "慢一点，记住这一刻" },
  },
];

export function getTemplate(id: TemplateId) {
  return TEMPLATES.find((template) => template.id === id) ?? TEMPLATES[0];
}

export function getMusicTrack(template: VlogTemplate, seed: number) {
  return template.music[Math.abs(seed) % template.music.length] ?? template.music[0];
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

type ImageFeature = {
  color: [number, number, number];
  hash: Uint8Array;
};

export type PreparedImageSequence = {
  images: HTMLImageElement[];
  originalCount: number;
  usedCount: number;
};

function getImageFeature(image: HTMLImageElement): ImageFeature {
  const canvas = document.createElement("canvas");
  canvas.width = 9;
  canvas.height = 8;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return { color: [0.5, 0.5, 0.5], hash: new Uint8Array(64) };

  drawStaticCover(context, image, 0, 0, canvas.width, canvas.height);
  const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const grayscale = new Float32Array(canvas.width * canvas.height);
  const color: [number, number, number] = [0, 0, 0];

  for (let pixel = 0; pixel < grayscale.length; pixel += 1) {
    const offset = pixel * 4;
    const red = data[offset] / 255;
    const green = data[offset + 1] / 255;
    const blue = data[offset + 2] / 255;
    grayscale[pixel] = red * 0.299 + green * 0.587 + blue * 0.114;
    color[0] += red / grayscale.length;
    color[1] += green / grayscale.length;
    color[2] += blue / grayscale.length;
  }

  const hash = new Uint8Array(64);
  let bit = 0;
  for (let y = 0; y < 8; y += 1) {
    for (let x = 0; x < 8; x += 1) {
      hash[bit] = grayscale[y * 9 + x] > grayscale[y * 9 + x + 1] ? 1 : 0;
      bit += 1;
    }
  }
  return { color, hash };
}

function featureDistance(a: ImageFeature, b: ImageFeature) {
  let hamming = 0;
  for (let index = 0; index < a.hash.length; index += 1) hamming += a.hash[index] === b.hash[index] ? 0 : 1;
  const colorDistance = (Math.abs(a.color[0] - b.color[0]) + Math.abs(a.color[1] - b.color[1]) + Math.abs(a.color[2] - b.color[2])) / 3;
  return (hamming / a.hash.length) * 0.78 + colorDistance * 0.22;
}

export function prepareImageSequence(images: HTMLImageElement[], template: VlogTemplate, seed: number): PreparedImageSequence {
  if (images.length <= 1) return { images, originalCount: images.length, usedCount: images.length };

  const features = images.map(getImageFeature);
  const minimumCount = Math.min(10, images.length);
  const maximumCount = Math.max(minimumCount, Math.floor(VLOG_DURATION / template.minShotDuration));
  const desiredCount = Math.min(images.length, maximumCount);
  const distinctIndices: number[] = [];
  const omittedIndices: number[] = [];

  for (let index = 0; index < images.length; index += 1) {
    const nearest = distinctIndices.length
      ? Math.min(...distinctIndices.map((chosen) => featureDistance(features[index], features[chosen])))
      : 1;
    if (nearest < 0.105 && images.length - omittedIndices.length > minimumCount) omittedIndices.push(index);
    else distinctIndices.push(index);
  }

  while (distinctIndices.length < minimumCount && omittedIndices.length) distinctIndices.push(omittedIndices.shift()!);

  let selectedIndices = [...distinctIndices];
  if (selectedIndices.length > desiredCount) {
    const selected = [selectedIndices[0]];
    const candidates = selectedIndices.slice(1);
    while (selected.length < desiredCount && candidates.length) {
      let bestPosition = 0;
      let bestScore = -1;
      candidates.forEach((candidate, position) => {
        const diversity = Math.min(...selected.map((chosen) => featureDistance(features[candidate], features[chosen])));
        const coverage = Math.min(candidate, images.length - 1 - candidate) / Math.max(1, images.length - 1);
        const score = diversity + coverage * 0.035;
        if (score > bestScore) {
          bestScore = score;
          bestPosition = position;
        }
      });
      selected.push(candidates.splice(bestPosition, 1)[0]);
    }
    selectedIndices = selected.sort((a, b) => a - b);
  }

  const phase = Math.abs(seed) % Math.max(1, selectedIndices.length);
  if (phase && selectedIndices.length > 3) {
    // A small rotation changes the opening image between regenerations without
    // destroying the user's broad chronology.
    const rotateBy = phase % Math.min(3, selectedIndices.length);
    selectedIndices = [...selectedIndices.slice(rotateBy), ...selectedIndices.slice(0, rotateBy)];
  }

  for (let position = 1; position < selectedIndices.length - 1; position += 1) {
    const previous = selectedIndices[position - 1];
    const current = selectedIndices[position];
    const previousPrevious = selectedIndices[Math.max(0, position - 2)];
    const currentScore = Math.min(
      featureDistance(features[previous], features[current]),
      featureDistance(features[previousPrevious], features[current]),
    );
    if (currentScore >= 0.18) continue;

    let bestPosition = position;
    let bestScore = currentScore;
    for (let candidatePosition = position + 1; candidatePosition < selectedIndices.length; candidatePosition += 1) {
      const candidate = selectedIndices[candidatePosition];
      const score = featureDistance(features[previous], features[candidate]) + featureDistance(features[previousPrevious], features[candidate]) * 0.38;
      if (score > bestScore) {
        bestScore = score;
        bestPosition = candidatePosition;
      }
    }
    if (bestPosition !== position) [selectedIndices[position], selectedIndices[bestPosition]] = [selectedIndices[bestPosition], selectedIndices[position]];
  }

  const preparedImages = selectedIndices.map((index) => images[index]);
  return { images: preparedImages, originalCount: images.length, usedCount: preparedImages.length };
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

function smootherstep(value: number) {
  const x = clamp(value, 0, 1);
  return x * x * x * (x * (x * 6 - 15) + 10);
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
  zoomBoost = 0,
) {
  const random = mulberry32(seed + index * 104729 + template.id.length * 7919);
  // Cycle through the complete motion palette before repeating it. The seed only
  // changes the starting point, so a template never accidentally becomes all zoom-ins.
  const motionOffset = Math.abs(seed + template.id.length * 7919) % template.motions.length;
  const motion = template.motions[(index + motionOffset) % template.motions.length];
  const minZoom = template.zoomMin + random() * 0.012;
  const maxZoom = template.zoomMax - random() * 0.01;
  // Wander is a continuous camera drift: keeping a non-zero velocity at both
  // ends prevents every photo from visibly braking and restarting. Other
  // templates retain their self-contained ease-in-out shots.
  const eased = template.id === "wander" ? clamp(progress, 0, 1) : smootherstep(progress);
  const zoom = (motion === "zoom-out" ? maxZoom + (minZoom - maxZoom) * eased : minZoom + (maxZoom - minZoom) * eased) + zoomBoost;
  const baseScale = Math.max(width / image.width, height / image.height);
  const scale = baseScale * zoom;
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  const availableX = Math.max(0, (drawWidth - width) / 2);
  const availableY = Math.max(0, (drawHeight - height) / 2);
  const direction = random() > 0.5 ? 1 : -1;
  let offsetX = 0;
  let offsetY = 0;

  if (motion === "pan-left") {
    offsetX = availableX * template.panStrength * (1 - eased * 2);
  } else if (motion === "pan-right") {
    offsetX = availableX * template.panStrength * (eased * 2 - 1);
  } else if (motion === "pan-side") {
    offsetX = direction * availableX * template.panStrength * (eased * 2 - 1);
  } else if (motion === "pan-up") {
    offsetY = availableY * template.panStrength * (1 - eased * 2);
  } else if (motion === "pan-down") {
    offsetY = availableY * template.panStrength * (eased * 2 - 1);
  } else {
    offsetX = direction * availableX * 0.13 * (eased * 2 - 1);
    offsetY = availableY * 0.12 * (0.5 - eased);
  }

  context.save();
  context.globalAlpha = alpha;
  context.drawImage(image, (width - drawWidth) / 2 + offsetX, (height - drawHeight) / 2 + offsetY, drawWidth, drawHeight);
  context.restore();
}

function drawStaticCover(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  image: CanvasImageSource & { width: number; height: number },
  x: number,
  y: number,
  width: number,
  height: number,
  zoom = 1,
) {
  const scale = Math.max(width / image.width, height / image.height) * zoom;
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawAlbumFrame(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  progress: number,
  seed: number,
  index: number,
  alpha: number,
) {
  const random = mulberry32(seed + index * 65537 + 29);
  const variant = Math.floor(random() * 5);
  const direction = variant % 2 === 0 ? 1 : -1;
  const eased = smootherstep(progress);

  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = "#cfc7b9";
  context.fillRect(0, 0, width, height);
  context.save();
  context.filter = `blur(${Math.max(14, Math.round(Math.max(width, height) * 0.026))}px) saturate(0.68) brightness(0.76)`;
  drawStaticCover(context, image, -width * 0.05, -height * 0.05, width * 1.1, height * 1.1, 1.08);
  context.restore();
  context.fillStyle = "rgba(91, 70, 54, 0.2)";
  context.fillRect(0, 0, width, height);

  const sizeVariant = 0.94 + random() * 0.1;
  const maxPhotoWidth = width * (width > height ? 0.69 : 0.76) * sizeVariant;
  const maxPhotoHeight = height * (width > height ? 0.67 : 0.6) * sizeVariant;
  const photoScale = Math.min(maxPhotoWidth / image.width, maxPhotoHeight / image.height);
  const photoWidth = image.width * photoScale;
  const photoHeight = image.height * photoScale;
  const padding = Math.max(12, Math.min(width, height) * 0.025);
  const caption = Math.max(18, Math.min(width, height) * 0.055);
  const cardWidth = photoWidth + padding * 2;
  const cardHeight = photoHeight + padding * 2 + caption;
  const baseRotation = (random() * 2 - 1) * 0.052;
  const enterStrength = 1 - smootherstep(clamp(progress / 0.34, 0, 1));
  const exitStrength = smootherstep(clamp((progress - 0.72) / 0.28, 0, 1));
  let slideX = 0;
  let slideY = 0;
  if (variant === 0) slideX = -width * 0.12 * enterStrength + width * 0.045 * exitStrength;
  if (variant === 1) slideX = width * 0.12 * enterStrength - width * 0.045 * exitStrength;
  if (variant === 2) slideY = height * 0.1 * enterStrength - height * 0.035 * exitStrength;
  if (variant === 3) {
    slideX = -width * 0.07 * enterStrength;
    slideY = height * 0.055 * enterStrength - height * 0.025 * exitStrength;
  }
  if (variant === 4) {
    slideX = width * 0.07 * enterStrength;
    slideY = -height * 0.045 * enterStrength + height * 0.03 * exitStrength;
  }
  const floatY = (0.5 - eased) * height * (0.008 + random() * 0.012);
  const rotation = baseRotation + direction * enterStrength * 0.075 - direction * exitStrength * 0.018;
  const cardScale = 0.965 + smootherstep(clamp(progress / 0.38, 0, 1)) * 0.035 - exitStrength * 0.012;

  context.translate(width / 2 + slideX, height / 2 + floatY + slideY);
  context.rotate(rotation);
  context.scale(cardScale, cardScale);
  context.shadowColor = "rgba(35, 27, 20, 0.32)";
  context.shadowBlur = Math.max(18, Math.min(width, height) * 0.05);
  context.shadowOffsetY = Math.max(8, Math.min(width, height) * 0.018);
  context.fillStyle = "#f8f4e9";
  context.fillRect(-cardWidth / 2, -cardHeight / 2, cardWidth, cardHeight);
  context.shadowColor = "transparent";
  context.drawImage(image, -photoWidth / 2, -cardHeight / 2 + padding, photoWidth, photoHeight);
  context.fillStyle = "rgba(80, 69, 57, 0.32)";
  context.fillRect(-cardWidth * 0.18, cardHeight / 2 - caption * 0.58, cardWidth * 0.36, Math.max(1, height * 0.002));
  context.restore();
}

export type BeatTiming = {
  beat: number;
  beatPhase: number;
  clipEndBeat: number;
  clipStartBeat: number;
  index: number;
  progress: number;
  started: boolean;
  strongBeat: boolean;
};

export function getBeatTiming(photoCount: number, time: number, bpm = 92, offset = 0.28): BeatTiming {
  const beatDuration = 60 / bpm;
  const totalBeats = Math.max(photoCount, Math.floor((VLOG_DURATION - offset) / beatDuration) + 1);
  const started = time >= offset;
  const beatPosition = started ? (time - offset) / beatDuration : 0;
  const beat = Math.max(0, Math.min(totalBeats - 1, Math.floor(beatPosition)));
  const index = Math.min(photoCount - 1, Math.floor((beat * photoCount) / totalBeats));
  const clipStartBeat = Math.ceil((index * totalBeats) / photoCount);
  const clipEndBeat = Math.ceil(((index + 1) * totalBeats) / photoCount);
  const progress = clamp((beatPosition - clipStartBeat) / Math.max(1, clipEndBeat - clipStartBeat), 0, 1);
  const beatPhase = started ? beatPosition - Math.floor(beatPosition) : 1;

  return {
    beat,
    beatPhase,
    clipEndBeat,
    clipStartBeat,
    index,
    progress,
    started,
    strongBeat: started && beat % 4 === 0,
  };
}

type ClipTiming = {
  clipDuration: number;
  index: number;
  localProgress: number;
  localTime: number;
};

function getBeatAlignedClipTiming(photoCount: number, time: number, music: MusicTrack): ClipTiming {
  const bpm = music.bpm ?? 90;
  const offset = music.beatOffset ?? 0;
  const beatDuration = 60 / bpm;
  const usableDuration = Math.max(beatDuration * photoCount, VLOG_DURATION - offset);
  const totalBeats = Math.max(photoCount, Math.floor(usableDuration / beatDuration));
  const beatPosition = clamp((time - offset) / beatDuration, 0, totalBeats - 0.0001);
  const index = Math.min(photoCount - 1, Math.floor((beatPosition * photoCount) / totalBeats));
  const startBeat = Math.ceil((index * totalBeats) / photoCount);
  const endBeat = Math.ceil(((index + 1) * totalBeats) / photoCount);
  const beatsInClip = Math.max(1, endBeat - startBeat);
  const localBeats = clamp(beatPosition - startBeat, 0, beatsInClip);
  return {
    clipDuration: beatsInClip * beatDuration,
    index,
    localProgress: localBeats / beatsInClip,
    localTime: localBeats * beatDuration,
  };
}

function drawBeatFrame(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  images: HTMLImageElement[],
  width: number,
  height: number,
  template: VlogTemplate,
  seed: number,
  time: number,
) {
  const music = getMusicTrack(template, seed);
  const timing = getBeatTiming(images.length, time, music.bpm, music.beatOffset);
  const image = images[timing.index];
  const pulse = timing.started ? Math.exp(-timing.beatPhase * 8) * (timing.strongBeat ? 0.045 : 0.018) : 0;
  const variant = timing.index % 3;

  if (variant === 0) {
    drawCover(context, image, width, height, timing.progress, template, seed, timing.index, 1, pulse);
  } else {
    const palettes = variant === 1
      ? ["#d7ff58", "#20231c", "#f4f3ed"]
      : ["#8fa5ff", "#171927", "#f7e861"];
    context.fillStyle = palettes[1];
    context.fillRect(0, 0, width, height);

    const insetX = variant === 1 ? width * 0.07 : width * 0.18;
    const insetY = variant === 1 ? height * 0.13 : height * 0.055;
    const insetWidth = variant === 1 ? width * 0.86 : width * 0.72;
    const insetHeight = variant === 1 ? height * 0.72 : height * 0.89;
    const pulseScale = 1 + pulse;

    context.save();
    context.translate(width / 2, height / 2);
    context.scale(pulseScale, pulseScale);
    context.translate(-width / 2, -height / 2);
    context.shadowColor = "rgba(0, 0, 0, 0.32)";
    context.shadowBlur = Math.max(16, Math.min(width, height) * 0.035);
    context.fillStyle = palettes[2];
    context.fillRect(insetX - width * 0.012, insetY - width * 0.012, insetWidth + width * 0.024, insetHeight + width * 0.024);
    context.shadowColor = "transparent";
    context.save();
    context.beginPath();
    context.rect(insetX, insetY, insetWidth, insetHeight);
    context.clip();
    drawStaticCover(context, image, insetX, insetY, insetWidth, insetHeight, 1.02);
    context.restore();
    context.restore();

    context.fillStyle = palettes[0];
    if (variant === 1) {
      context.fillRect(width * 0.07, height * 0.89, width * (0.2 + (timing.beat % 4) * 0.08), Math.max(5, height * 0.014));
    } else {
      context.fillRect(width * 0.055, height * 0.13, Math.max(5, width * 0.015), height * 0.42);
      context.fillRect(width * 0.055, height * 0.13, width * 0.095, Math.max(5, height * 0.014));
    }
  }

  if (timing.started) {
    const flash = Math.exp(-timing.beatPhase * 16) * (timing.strongBeat ? 0.18 : 0.055);
    context.fillStyle = `rgba(255, 255, 255, ${flash})`;
    context.fillRect(0, 0, width, height);
  }
}

function drawContainedPhoto(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.min(width / image.width, height / image.height);
  const drawWidth = image.width * scale;
  const drawHeight = image.height * scale;
  context.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function drawBookSpread(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  images: HTMLImageElement[],
  spreadIndex: number,
  x: number,
  y: number,
  width: number,
  height: number,
  alpha = 1,
) {
  const pageWidth = width / 2;
  const left = images[(spreadIndex * 2) % images.length];
  const right = images[(spreadIndex * 2 + 1) % images.length] ?? left;
  const variant = spreadIndex % 3;
  const margin = Math.max(8, Math.min(width, height) * 0.038);

  context.save();
  context.globalAlpha *= alpha;
  context.fillStyle = "#f6f0df";
  context.fillRect(x, y, width, height);

  if (variant === 0) {
    context.save();
    context.beginPath();
    context.rect(x + margin, y + margin, width - margin * 2, height - margin * 2);
    context.clip();
    drawStaticCover(context, left, x + margin, y + margin, width - margin * 2, height - margin * 2, 1.015);
    context.restore();
    context.fillStyle = "rgba(255, 250, 235, 0.18)";
    context.fillRect(x + pageWidth - width * 0.012, y + margin, width * 0.024, height - margin * 2);
  } else if (variant === 1) {
    const photoMargin = margin * 1.15;
    const photoHeight = height * 0.66;
    context.fillStyle = "#fffdf6";
    context.fillRect(x + photoMargin, y + photoMargin, pageWidth - photoMargin * 1.55, photoHeight);
    context.fillRect(x + pageWidth + photoMargin * 0.55, y + height - photoHeight - photoMargin, pageWidth - photoMargin * 1.55, photoHeight);
    drawContainedPhoto(context, left, x + photoMargin * 1.25, y + photoMargin * 1.25, pageWidth - photoMargin * 2.05, photoHeight - photoMargin * 0.5);
    drawContainedPhoto(context, right, x + pageWidth + photoMargin * 0.8, y + height - photoHeight - photoMargin * 0.75, pageWidth - photoMargin * 2.05, photoHeight - photoMargin * 0.5);
    context.fillStyle = "#3158bd";
    context.fillRect(x + photoMargin, y + height * 0.79, pageWidth * 0.23, Math.max(2, height * 0.006));
    context.fillStyle = "rgba(63, 58, 48, 0.4)";
    context.font = `600 ${Math.max(7, height * 0.025)}px ui-monospace, monospace`;
    context.fillText(`PAGE ${String(spreadIndex * 2 + 1).padStart(2, "0")}`, x + photoMargin, y + height * 0.86);
  } else {
    context.save();
    context.beginPath();
    context.rect(x + margin, y + margin, pageWidth - margin * 1.35, height - margin * 2);
    context.clip();
    drawStaticCover(context, left, x + margin, y + margin, pageWidth - margin * 1.35, height - margin * 2, 1.03);
    context.restore();
    const rightX = x + pageWidth + margin * 0.65;
    const rightWidth = pageWidth - margin * 1.65;
    context.fillStyle = "#fffdf6";
    context.fillRect(rightX, y + margin * 1.2, rightWidth, height * 0.53);
    drawContainedPhoto(context, right, rightX + margin * 0.35, y + margin * 1.55, rightWidth - margin * 0.7, height * 0.47);
    context.strokeStyle = "rgba(49, 88, 189, 0.5)";
    context.lineWidth = Math.max(1, height * 0.003);
    for (let line = 0; line < 4; line += 1) {
      const lineY = y + height * (0.7 + line * 0.052);
      context.beginPath();
      context.moveTo(rightX, lineY);
      context.lineTo(rightX + rightWidth * (0.82 - line * 0.08), lineY);
      context.stroke();
    }
    context.strokeStyle = "#bf4e3d";
    context.strokeRect(x + width - margin * 2.15, y + height - margin * 2.3, margin * 1.15, margin * 1.15);
  }

  const spine = x + pageWidth;
  const spineShade = context.createLinearGradient(spine - width * 0.035, 0, spine + width * 0.035, 0);
  spineShade.addColorStop(0, "rgba(62, 51, 38, 0)");
  spineShade.addColorStop(0.48, "rgba(62, 51, 38, 0.2)");
  spineShade.addColorStop(0.52, "rgba(255, 255, 255, 0.24)");
  spineShade.addColorStop(1, "rgba(62, 51, 38, 0)");
  context.fillStyle = spineShade;
  context.fillRect(spine - width * 0.035, y, width * 0.07, height);
  context.restore();
}

function drawTurningBookPage(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  front: HTMLImageElement,
  back: HTMLImageElement,
  spine: number,
  y: number,
  pageWidth: number,
  pageHeight: number,
  progress: number,
) {
  if (progress <= 0 || progress >= 1) return;
  const angle = Math.PI * progress;
  const visibleWidth = Math.max(pageWidth * 0.025, Math.abs(Math.cos(angle)) * pageWidth);
  const onRight = progress < 0.5;
  const freeEdge = onRight ? spine + visibleWidth : spine - visibleWidth;
  const left = Math.min(spine, freeEdge);
  const bulge = Math.sin(angle) * pageHeight * 0.055;
  const image = onRight ? front : back;

  context.save();
  context.shadowColor = `rgba(34, 29, 23, ${0.18 + Math.sin(angle) * 0.28})`;
  context.shadowBlur = Math.max(12, pageHeight * 0.06);
  context.shadowOffsetX = onRight ? -pageWidth * 0.025 : pageWidth * 0.025;
  context.beginPath();
  context.moveTo(spine, y);
  context.quadraticCurveTo((spine + freeEdge) / 2, y - bulge, freeEdge, y + bulge * 0.2);
  context.lineTo(freeEdge, y + pageHeight - bulge * 0.2);
  context.quadraticCurveTo((spine + freeEdge) / 2, y + pageHeight + bulge, spine, y + pageHeight);
  context.closePath();
  context.fillStyle = "#f6f0df";
  context.fill();
  context.shadowColor = "transparent";
  context.clip();
  drawStaticCover(context, image, left, y, visibleWidth, pageHeight, 1.03);
  context.fillStyle = `rgba(246, 240, 223, ${0.08 + Math.sin(angle) * 0.22})`;
  context.fillRect(left, y, visibleWidth, pageHeight);
  const curlShade = context.createLinearGradient(spine, 0, freeEdge, 0);
  curlShade.addColorStop(0, "rgba(44, 37, 29, 0.24)");
  curlShade.addColorStop(0.7, "rgba(255, 255, 255, 0.1)");
  curlShade.addColorStop(1, "rgba(44, 37, 29, 0.2)");
  context.fillStyle = curlShade;
  context.fillRect(left, y, visibleWidth, pageHeight);
  context.restore();
}

function drawBookFrame(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  images: HTMLImageElement[],
  spreadIndex: number,
  width: number,
  height: number,
  progress: number,
  time: number,
) {
  const bookCanvas = renderBook3D(images, spreadIndex, width, height, progress, time);
  context.drawImage(bookCanvas, 0, 0, width, height);
}

function phaseEnvelope(time: number, start: number, end: number, enterDuration = 0.75, leaveDuration = 0.65) {
  return clamp(smootherstep((time - start) / enterDuration) * (1 - smootherstep((time - (end - leaveDuration)) / leaveDuration)), 0, 1);
}

function drawTrackedText(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  tracking: number,
) {
  const characters = Array.from(text);
  const widths = characters.map((character) => context.measureText(character).width);
  const totalWidth = widths.reduce((sum, value) => sum + value, 0) + tracking * Math.max(0, characters.length - 1);
  let cursor = centerX - totalWidth / 2;
  characters.forEach((character, index) => {
    context.fillText(character, cursor, y);
    cursor += widths[index] + tracking;
  });
  return totalWidth;
}

function drawTemplateTypography(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  template: VlogTemplate,
  content: VlogTextContent,
  time: number,
) {
  const title = content.title.trim().slice(0, 24);
  const subtitle = content.subtitle.trim().slice(0, 42);
  const subtitle2 = content.subtitle2?.trim().slice(0, 42) ?? "";
  const subtitle3 = content.subtitle3?.trim().slice(0, 42) ?? "";
  const closing = content.closing.trim().slice(0, 42);
  const coverAlpha = title ? phaseEnvelope(time, 0.15, template.id === "film" ? 3.0 : 5.2, 0.9, 0.8) : 0;
  const middleCues = template.id === "wander"
    ? [
        { text: subtitle, start: 7.0, end: 9.8, position: 0 },
        { text: subtitle2, start: 14.0, end: 16.8, position: 1 },
        { text: subtitle3, start: 21.0, end: 23.8, position: 2 },
      ]
    : [{ text: subtitle, start: 12.2, end: 16.4, position: 0 }];
  const activeMiddle = middleCues
    .map((cue) => ({ ...cue, alpha: cue.text ? phaseEnvelope(time, cue.start, cue.end, 0.55, 0.55) : 0 }))
    .find((cue) => cue.alpha > 0);
  const middleAlpha = activeMiddle?.alpha ?? 0;
  const middleText = activeMiddle?.text ?? "";
  const closingAlpha = closing ? phaseEnvelope(time, 26.0, 30, 0.8, 0.45) : 0;
  if (coverAlpha + middleAlpha + closingAlpha <= 0) return;

  const shortEdge = Math.min(width, height);
  context.save();
  context.textBaseline = "middle";

  if (coverAlpha > 0) {
    const enter = smootherstep((time - 0.15) / 1.05);
    if (template.id === "wander") {
      context.globalAlpha = coverAlpha * 0.5;
      const shade = context.createLinearGradient(0, height * 0.45, 0, height);
      shade.addColorStop(0, "rgba(10, 24, 20, 0)");
      shade.addColorStop(1, "rgba(10, 24, 20, 0.82)");
      context.fillStyle = shade;
      context.fillRect(0, height * 0.38, width, height * 0.62);
      context.globalAlpha = coverAlpha;
      context.fillStyle = "#ffffff";
      context.font = `650 ${shortEdge * 0.078}px system-ui, -apple-system, "PingFang SC", sans-serif`;
      context.textAlign = "center";
      context.fillText(title, width / 2, height * 0.72 + (1 - enter) * height * 0.035);
      context.font = `600 ${shortEdge * 0.017}px ui-monospace, monospace`;
      context.fillStyle = "#c8ff4d";
      context.fillText("WANDER · 01", width / 2, height * 0.82);
    } else if (template.id === "memory") {
      context.globalAlpha = coverAlpha * 0.9;
      const cardWidth = Math.min(width * 0.76, shortEdge * 1.2);
      const cardHeight = shortEdge * 0.25;
      const cardX = width * 0.08 + (1 - enter) * -width * 0.08;
      const cardY = height * 0.62;
      context.translate(cardX, cardY);
      context.rotate(-0.025 + (1 - enter) * -0.045);
      context.fillStyle = "rgba(252, 246, 232, 0.94)";
      context.fillRect(0, 0, cardWidth, cardHeight);
      context.fillStyle = "#5e493e";
      context.textAlign = "left";
      context.font = `600 ${shortEdge * 0.072}px Georgia, "Songti SC", serif`;
      context.fillText(title, cardWidth * 0.08, cardHeight * 0.48);
      context.font = `italic 500 ${shortEdge * 0.018}px Georgia, serif`;
      context.fillStyle = "#a37862";
      context.fillText("MEMORIES, KEPT WITH CARE", cardWidth * 0.08, cardHeight * 0.76);
      context.setTransform(1, 0, 0, 1, 0, 0);
    } else if (template.id === "spark") {
      const punch = 0.86 + enter * 0.14;
      context.translate(width / 2, height / 2);
      context.scale(punch, punch);
      context.translate(-width / 2, -height / 2);
      context.globalAlpha = coverAlpha * 0.9;
      context.fillStyle = "#171927";
      context.fillRect(width * 0.07, height * 0.34, width * 0.86 * enter, shortEdge * 0.22);
      context.globalAlpha = coverAlpha;
      context.fillStyle = "#f7e861";
      context.textAlign = "center";
      context.font = `900 ${shortEdge * 0.09}px system-ui, "PingFang SC", sans-serif`;
      context.fillText(title, width / 2, height * 0.45);
      context.fillStyle = "#d7ff58";
      context.fillRect(width * 0.16, height * 0.59, width * 0.68 * enter, Math.max(5, shortEdge * 0.014));
    } else if (template.id === "film") {
      context.globalAlpha = coverAlpha;
      context.fillStyle = "#3158bd";
      context.textAlign = "center";
      context.font = `650 ${shortEdge * 0.052}px Georgia, "Songti SC", serif`;
      context.fillText(title, width * 0.5, height * 0.09 - (1 - enter) * height * 0.02);
      context.font = `700 ${shortEdge * 0.016}px ui-monospace, monospace`;
      context.fillText("TRAVEL BOOK / PAGE 001", width * 0.5, height * 0.14);
      context.strokeStyle = "#bf4e3d";
      context.lineWidth = Math.max(1, shortEdge * 0.004);
      context.strokeRect(width * 0.78, height * 0.065, shortEdge * 0.055, shortEdge * 0.055);
    } else {
      context.globalAlpha = coverAlpha;
      context.fillStyle = "rgba(247, 244, 235, 0.9)";
      const panelWidth = width * 0.7 * enter;
      context.fillRect((width - panelWidth) / 2, height * 0.34, panelWidth, shortEdge * 0.25);
      context.fillStyle = "#4d4b45";
      context.font = `500 ${shortEdge * 0.069}px Georgia, "Songti SC", serif`;
      context.textAlign = "left";
      drawTrackedText(context, title, width / 2, height * 0.44, shortEdge * 0.022 * (1 - enter) + shortEdge * 0.006);
      context.fillStyle = "#a39c8e";
      context.fillRect(width * 0.42, height * 0.53, width * 0.16 * enter, Math.max(2, shortEdge * 0.003));
    }
  }

  if (middleAlpha > 0) {
    const enter = smootherstep((time - (activeMiddle?.start ?? 12.2)) / 0.55);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = middleAlpha;
    if (template.id === "wander") {
      const cueY = activeMiddle?.position === 1 ? 0.2 : 0.76;
      const direction = activeMiddle?.position === 2 ? -1 : 1;
      context.font = `650 ${shortEdge * 0.029}px system-ui, -apple-system, "PingFang SC", sans-serif`;
      const boxWidth = Math.min(width * 0.76, context.measureText(middleText).width + shortEdge * 0.16);
      const boxX = (width - boxWidth) / 2 + direction * (1 - enter) * width * 0.035;
      context.fillStyle = "rgba(15, 39, 31, 0.64)";
      context.fillRect(boxX, height * cueY, boxWidth, shortEdge * 0.085);
      context.fillStyle = "#c8ff4d";
      context.fillRect(boxX, height * cueY, Math.max(4, shortEdge * 0.008), shortEdge * 0.085);
      context.fillStyle = "#ffffff";
      context.textAlign = "center";
      context.fillText(middleText, width / 2 + direction * (1 - enter) * width * 0.035, height * cueY + shortEdge * 0.043);
    } else if (template.id === "spark") {
      context.fillStyle = "#d7ff58";
      context.fillRect(width * (0.08 - (1 - enter) * 0.12), height * 0.76, width * 0.84, shortEdge * 0.105);
      context.fillStyle = "#171927";
      context.font = `850 ${shortEdge * 0.031}px system-ui, sans-serif`;
      context.textAlign = "center";
      context.fillText(middleText, width / 2, height * 0.812);
    } else if (template.id === "film") {
      context.font = `650 ${shortEdge * 0.026}px Georgia, "Songti SC", serif`;
      context.fillStyle = "rgba(246, 240, 223, 0.96)";
      const boxWidth = Math.min(width * 0.72, context.measureText(middleText).width + shortEdge * 0.14);
      context.fillRect((width - boxWidth) / 2, height * 0.9, boxWidth, shortEdge * 0.075);
      context.fillStyle = "#3158bd";
      context.textAlign = "center";
      context.fillText(middleText, width / 2, height * 0.938);
    } else {
      const serif = template.id === "memory" || template.id === "still";
      context.font = `${serif ? 500 : 650} ${shortEdge * (serif ? 0.031 : 0.027)}px ${serif ? 'Georgia, "Songti SC", serif' : 'system-ui, "PingFang SC", sans-serif'}`;
      context.fillStyle = "rgba(20, 20, 18, 0.62)";
      const boxWidth = Math.min(width * 0.84, context.measureText(middleText).width + shortEdge * 0.18);
      context.fillRect((width - boxWidth) / 2, height * 0.74 + (1 - enter) * height * 0.04, boxWidth, shortEdge * 0.1);
      context.fillStyle = "#fffdf7";
      context.textAlign = "center";
      context.fillText(middleText, width / 2, height * 0.79 + (1 - enter) * height * 0.04);
    }
  }

  if (closingAlpha > 0) {
    const enter = smootherstep((time - 26) / 1.0);
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.globalAlpha = closingAlpha * 0.82;
    context.fillStyle = template.id === "still" || template.id === "memory" ? "#f4f0e7" : "#11120f";
    context.fillRect(0, 0, width, height);
    context.globalAlpha = closingAlpha;
    context.fillStyle = template.id === "spark" ? "#d7ff58" : template.id === "film" ? "#3158bd" : template.id === "memory" || template.id === "still" ? "#514d45" : "#ffffff";
    context.textAlign = "center";
    const family = template.id === "memory" || template.id === "still" || template.id === "film" ? 'Georgia, "Songti SC", serif' : 'system-ui, "PingFang SC", sans-serif';
    const weight = template.id === "spark" ? 900 : template.id === "still" ? 500 : 700;
    context.font = `${weight} ${shortEdge * (template.id === "spark" ? 0.061 : 0.041)}px ${family}`;
    context.fillText(closing, width / 2, height * 0.5 + (1 - enter) * height * 0.045);
    context.globalAlpha = closingAlpha * 0.65;
    context.font = `600 ${shortEdge * 0.014}px ui-monospace, monospace`;
    context.fillText(template.eyebrow, width / 2, height * 0.61);
  }
  context.restore();
}

function drawMinimalFrame(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  progress: number,
  index: number,
  seed: number,
  alpha: number,
) {
  const eased = smootherstep(progress);
  const variant = Math.abs(seed + index * 17) % 4;
  const maxWidth = width * (width > height ? 0.69 + variant * 0.018 : 0.75 + variant * 0.014);
  const maxHeight = height * (width > height ? 0.69 - variant * 0.012 : 0.61 + variant * 0.012);
  const breatheDirection = variant % 2 === 0 ? -1 : 1;
  const containScale = Math.min(maxWidth / image.width, maxHeight / image.height) * (1.012 + breatheDirection * (eased - 0.5) * 0.018);
  const photoWidth = image.width * containScale;
  const photoHeight = image.height * containScale;
  const xBias = [-0.045, 0.042, -0.012, 0.018][variant];
  const yBias = [0.012, -0.018, 0.032, -0.028][variant];
  const x = (width - photoWidth) / 2 + width * xBias + (0.5 - eased) * width * (variant < 2 ? 0.012 : -0.01);
  const y = (height - photoHeight) / 2 + height * yBias + (0.5 - eased) * height * (variant % 2 === 0 ? 0.016 : -0.014);

  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = "#f1eee4";
  context.fillRect(0, 0, width, height);
  context.shadowColor = "rgba(40, 38, 32, 0.2)";
  context.shadowBlur = Math.max(14, Math.min(width, height) * 0.035);
  context.shadowOffsetY = Math.max(6, height * 0.012);
  context.fillStyle = "#fffdf7";
  const border = Math.max(7, Math.min(width, height) * 0.012);
  context.fillRect(x - border, y - border, photoWidth + border * 2, photoHeight + border * 2);
  context.shadowColor = "transparent";
  context.drawImage(image, x, y, photoWidth, photoHeight);
  context.fillStyle = "#6c6a62";
  context.globalAlpha *= 0.6;
  const markerX = variant % 2 === 0 ? width * 0.085 : width * 0.915;
  context.fillRect(markerX, height * 0.22, Math.max(2, width * 0.003), height * 0.56);
  context.fillStyle = "#b5ad9d";
  context.beginPath();
  context.arc(markerX + Math.max(1, width * 0.0015), height * (0.22 + eased * 0.56), Math.max(3, width * 0.006), 0, Math.PI * 2);
  context.fill();
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
  textContent: VlogTextContent = template.textPreset,
) {
  context.fillStyle = "#10110f";
  context.fillRect(0, 0, width, height);
  if (!images.length) return;

  const safeTime = clamp(time, 0, VLOG_DURATION - 0.0001);
  if (template.layout === "beat") {
    drawBeatFrame(context, images, width, height, template, seed, safeTime);
    drawTemplateTypography(context, width, height, template, textContent, safeTime);
    return;
  }

  const music = getMusicTrack(template, seed);
  if (template.layout === "book") {
    const spreadCount = Math.max(1, Math.ceil(images.length / 2));
    const timing = getBeatAlignedClipTiming(spreadCount, safeTime, music);
    drawBookFrame(context, images, timing.index, width, height, timing.localProgress, safeTime);
    drawTemplateTypography(context, width, height, template, textContent, safeTime);
    return;
  }

  const timing = getBeatAlignedClipTiming(images.length, safeTime, music);
  const { clipDuration, index, localTime, localProgress } = timing;
  const transitionDuration = Math.min(template.transition, clipDuration * 0.38);
  const transitionStart = clipDuration - transitionDuration;
  const transitionLead = transitionDuration / clipDuration;
  const motionProgress = template.id === "wander" && index > 0
    ? transitionLead + localProgress * (1 - transitionLead)
    : localProgress;

  const drawCurrent = template.layout === "album"
    ? (alpha: number) => drawAlbumFrame(context, images[index], width, height, localProgress, seed, index, alpha)
    : template.layout === "minimal"
        ? (alpha: number) => drawMinimalFrame(context, images[index], width, height, localProgress, index, seed, alpha)
        : (alpha: number) => drawCover(context, images[index], width, height, motionProgress, template, seed, index, alpha);
  drawCurrent(1);

  if (index < images.length - 1 && localTime > transitionStart) {
    const transitionProgress = clamp((localTime - transitionStart) / transitionDuration, 0, 1);
    const mix = smootherstep(transitionProgress);
    // Keep the incoming image at the exact first-frame transform while it fades in.
    // Its motion starts only after the clip boundary, avoiding a visible progress reset.
    if (template.layout === "album") {
      drawAlbumFrame(context, images[index + 1], width, height, 0, seed, index + 1, mix);
    } else if (template.layout === "minimal") {
      drawMinimalFrame(context, images[index + 1], width, height, 0, index + 1, seed, mix);
    } else {
      // Alpha eases softly, while the incoming camera has already accumulated
      // motion by the cut. At the boundary it continues from transitionLead
      // instead of restarting from a stationary frame.
      const incomingProgress = template.id === "wander" ? transitionProgress * transitionLead : 0;
      drawCover(context, images[index + 1], width, height, incomingProgress, template, seed, index + 1, mix);
    }
  }
  drawTemplateTypography(context, width, height, template, textContent, safeTime);
}
