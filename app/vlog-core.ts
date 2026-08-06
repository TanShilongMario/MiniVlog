import { renderBook3D } from "./book-three";

export const VLOG_DURATION = 30;
export const PREVIEW_LONG_EDGE = 720;
export const EXPORT_FPS = 24;
export const MIN_PHOTOS = 10;
export const MAX_PHOTOS = 30;

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
    minShotDuration: 1.0,
    transition: 0,
    zoomMin: 1.07,
    zoomMax: 1.135,
    panStrength: 0.7,
    motions: ["zoom-in", "pan-side", "pan-up", "zoom-out", "zoom-in"],
    colors: ["#e7f0ff", "#a8baff", "#5159a7"],
    textPreset: {
      title: "",
      subtitle: "快乐发生中",
      subtitle2: "这一刻刚刚好",
      subtitle3: "继续闪光吧",
      closing: "",
    },
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

export type ImageSequenceDebug = {
  selectedIndices: number[];
  omittedIndices: number[];
  phase: number;
  rotateBy: number;
  desiredCount: number;
  maximumCount: number;
  minimumCount: number;
};

export type PreparedImageSequence = {
  images: HTMLImageElement[];
  originalCount: number;
  usedCount: number;
  debug: ImageSequenceDebug;
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

function emptySequenceDebug(count: number): ImageSequenceDebug {
  return {
    selectedIndices: Array.from({ length: count }, (_, index) => index),
    omittedIndices: [],
    phase: 0,
    rotateBy: 0,
    desiredCount: count,
    maximumCount: count,
    minimumCount: count,
  };
}

export function prepareImageSequence(images: HTMLImageElement[], template: VlogTemplate, seed: number): PreparedImageSequence {
  if (images.length <= 1) {
    return { images, originalCount: images.length, usedCount: images.length, debug: emptySequenceDebug(images.length) };
  }

  const features = images.map(getImageFeature);
  const minimumCount = Math.min(10, images.length);
  // Spark's four-flash bursts benefit from keeping as many photos as the user uploaded.
  const maximumCount = template.id === "spark"
    ? images.length
    : Math.max(minimumCount, Math.floor(VLOG_DURATION / template.minShotDuration));
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
  let rotateBy = 0;
  if (phase && selectedIndices.length > 3) {
    // A small rotation changes the opening image between regenerations without
    // destroying the user's broad chronology.
    rotateBy = phase % Math.min(3, selectedIndices.length);
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
  return {
    images: preparedImages,
    originalCount: images.length,
    usedCount: preparedImages.length,
    debug: {
      selectedIndices,
      omittedIndices,
      phase,
      rotateBy,
      desiredCount,
      maximumCount,
      minimumCount,
    },
  };
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

type SparkPlacement = "full" | { x: number; y: number; w: number; h: number };

type SparkRgb = { r: number; g: number; b: number };

type SparkBeatSlot = {
  imageIndex: number;
  placement: SparkPlacement;
  progress: number;
  burst?: boolean;
};

type SparkPlanCache = {
  key: string;
  slots: SparkBeatSlot[];
  background: SparkRgb;
  imageWashes: SparkRgb[];
};

const sparkPlanCache = new WeakMap<HTMLImageElement[], SparkPlanCache>();

function rectPlacement(x: number, y: number, w: number, h: number): SparkPlacement {
  return { x, y, w, h };
}

/** Inset frames keep light breathing room; size and side bias stay seeded-random. */
function randomSparkInset(random: () => number, landscape: boolean): SparkPlacement {
  if (landscape) {
    const top = 0.05 + random() * 0.09;
    const bottom = 0.05 + random() * 0.09;
    let height = 1 - top - bottom;
    if (random() < 0.28) height *= 0.82 + random() * 0.14;
    height = clamp(height, 0.52, 0.9);
    const freey = Math.max(0, 1 - top - bottom - height);
    const y = top + freey * (random() < 0.55 ? 0 : random());
    const width = 0.36 + random() * 0.42;
    const maxX = Math.max(0, 1 - width);
    const align = random();
    const x = align < 0.38
      ? random() * Math.min(0.08, maxX)
      : align < 0.76
        ? maxX - random() * Math.min(0.08, maxX)
        : maxX * (0.22 + random() * 0.56);
    return rectPlacement(clamp(x, 0, maxX), clamp(y, 0.04, 0.32), width, height);
  }

  const left = 0.04 + random() * 0.08;
  const right = 0.04 + random() * 0.08;
  let width = 1 - left - right;
  if (random() < 0.28) width *= 0.84 + random() * 0.14;
  width = clamp(width, 0.62, 0.92);
  const freex = Math.max(0, 1 - left - right - width);
  const x = left + freex * random();
  const height = 0.38 + random() * 0.4;
  const maxY = Math.max(0.05, 1 - height - 0.05);
  const align = random();
  const y = align < 0.4
    ? 0.05 + random() * 0.05
    : align < 0.8
      ? maxY - random() * 0.05
      : 0.1 + random() * Math.max(0.04, maxY - 0.14);
  return rectPlacement(clamp(x, 0.03, 0.24), clamp(y, 0.04, maxY), width, clamp(height, 0.36, 0.78));
}

function pickSparkPlacement(random: () => number, landscape: boolean, fullChance = 0.12): SparkPlacement {
  if (random() < fullChance) return "full";
  return randomSparkInset(random, landscape);
}

function rgbToHsl(red: number, green: number, blue: number): [number, number, number] {
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const light = (max + min) / 2;
  if (max === min) return [0, 0, light];
  const delta = max - min;
  const sat = light > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;
  if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
  else if (max === green) hue = (blue - red) / delta + 2;
  else hue = (red - green) / delta + 4;
  return [hue / 6, sat, light];
}

function hslToRgb(hue: number, sat: number, light: number): SparkRgb {
  if (sat === 0) {
    const gray = Math.round(light * 255);
    return { r: gray, g: gray, b: gray };
  }
  const hue2rgb = (parcel: number, quilt: number, turn: number) => {
    let value = turn;
    if (value < 0) value += 1;
    if (value > 1) value -= 1;
    if (value < 1 / 6) return parcel + (quilt - parcel) * 6 * value;
    if (value < 1 / 2) return quilt;
    if (value < 2 / 3) return parcel + (quilt - parcel) * (2 / 3 - value) * 6;
    return parcel;
  };
  const quilt = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const parcel = 2 * light - quilt;
  return {
    r: Math.round(hue2rgb(parcel, quilt, hue + 1 / 3) * 255),
    g: Math.round(hue2rgb(parcel, quilt, hue) * 255),
    b: Math.round(hue2rgb(parcel, quilt, hue - 1 / 3) * 255),
  };
}

function tuneSparkWash(red: number, green: number, blue: number): SparkRgb {
  const [hue, sat, light] = rgbToHsl(red / 255, green / 255, blue / 255);
  // Push chroma up so the matte field still carries the photo's color identity.
  const nextSat = clamp(sat * 1.45 + 0.1, 0.22, 0.78);
  const nextLight = clamp(light * 0.72 + 0.2, 0.24, 0.46);
  return hslToRgb(hue, nextSat, nextLight);
}

function sampleImageWash(image: HTMLImageElement, random: () => number): SparkRgb {
  const size = 36;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return { r: 42, g: 58, b: 52 };

  drawStaticCover(context, image, 0, 0, size, size);
  const data = context.getImageData(0, 0, size, size).data;
  let red = 0;
  let green = 0;
  let blue = 0;
  const samples = 14;
  for (let index = 0; index < samples; index += 1) {
    const pixel = (Math.floor(random() * size) * size + Math.floor(random() * size)) * 4;
    red += data[pixel];
    green += data[pixel + 1];
    blue += data[pixel + 2];
  }
  return tuneSparkWash(red / samples, green / samples, blue / samples);
}

function sampleSparkBackground(images: HTMLImageElement[], seed: number): SparkRgb {
  const random = mulberry32(seed ^ 0xc0ffee11);
  const image = images[Math.floor(random() * images.length)] ?? images[0];
  if (!image) return { r: 42, g: 58, b: 52 };
  return sampleImageWash(image, random);
}

function sparkRgbCss(color: SparkRgb) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function pulseSparkWash(color: SparkRgb, attack: number): SparkRgb {
  const amount = clamp(attack, 0, 1);
  return {
    r: Math.round(clamp(color.r + (255 - color.r) * amount * 0.42 + amount * 18, 0, 255)),
    g: Math.round(clamp(color.g + (255 - color.g) * amount * 0.42 + amount * 18, 0, 255)),
    b: Math.round(clamp(color.b + (255 - color.b) * amount * 0.38 + amount * 14, 0, 255)),
  };
}

function pickSparkPhoto(
  photoCount: number,
  recent: number[],
  random: () => number,
  minGap = 5,
  exclude: number[] = [],
) {
  const blocked = new Set([...recent.slice(-minGap), ...exclude]);
  const fresh: number[] = [];
  const reusable: number[] = [];
  for (let index = 0; index < photoCount; index += 1) {
    if (exclude.includes(index)) continue;
    if (!recent.includes(index)) fresh.push(index);
    else if (!blocked.has(index)) reusable.push(index);
  }
  const pool = fresh.length ? fresh : reusable.length ? reusable : Array.from({ length: photoCount }, (_, index) => index)
    .filter((index) => !exclude.includes(index));
  if (!pool.length) return Math.floor(random() * photoCount) % photoCount;
  return pool[Math.floor(random() * pool.length)];
}

function buildSparkBeatSlots(photoCount: number, totalBeats: number, seed: number, landscape: boolean): SparkBeatSlot[] {
  const random = mulberry32(seed ^ 0x51a7f00d);
  const recent: number[] = [];
  const slots: SparkBeatSlot[] = [];
  let beat = 0;

  const pushHold = (imageIndex: number, placement: SparkPlacement, holdBeats: number) => {
    for (let step = 0; step < holdBeats; step += 1) {
      slots.push({ imageIndex, placement, progress: (step + 0.5) / holdBeats });
    }
    recent.push(imageIndex);
  };

  // Opening always starts with a four-beat fullscreen burst.
  if (totalBeats >= 4 && photoCount >= 1) {
    const openerImages: number[] = [];
    for (let step = 0; step < 4; step += 1) {
      const imageIndex = pickSparkPhoto(photoCount, recent, random, 5, openerImages);
      openerImages.push(imageIndex);
      slots.push({ imageIndex, placement: "full", progress: 0.5, burst: true });
      recent.push(imageIndex);
    }
    beat += 4;
  }

  while (beat < totalBeats) {
    const remaining = totalBeats - beat;
    const roll = random();

    if (remaining >= 4 && photoCount >= 4 && roll < 0.28) {
      const burstImages: number[] = [];
      for (let step = 0; step < 4; step += 1) {
        const imageIndex = pickSparkPhoto(photoCount, recent, random, 5, burstImages);
        burstImages.push(imageIndex);
        // Bursts stay punchy; a modest full-bleed chance keeps energy without flooding the cut.
        slots.push({ imageIndex, placement: pickSparkPlacement(random, landscape, 0.22), progress: 0.5, burst: true });
        recent.push(imageIndex);
      }
      beat += 4;
      continue;
    }

    // Four-beat relocate: four different photos, varying size and position, always with margin.
    if (remaining >= 4 && photoCount >= 2 && roll < 0.54) {
      const relocateImages: number[] = [];
      for (let step = 0; step < 4; step += 1) {
        const imageIndex = pickSparkPhoto(photoCount, recent, random, 5, relocateImages);
        relocateImages.push(imageIndex);
        slots.push({
          imageIndex,
          placement: randomSparkInset(random, landscape),
          progress: 0.5,
        });
        recent.push(imageIndex);
      }
      beat += 4;
      continue;
    }

    const holdBeats = Math.min(remaining, remaining <= 3 ? remaining : 2 + Math.floor(random() * 3));
    const imageIndex = pickSparkPhoto(photoCount, recent, random, 5);
    pushHold(imageIndex, pickSparkPlacement(random, landscape), holdBeats);
    beat += holdBeats;
  }

  return slots;
}

function getSparkPlan(images: HTMLImageElement[], seed: number, bpm: number, offset: number, width: number, height: number) {
  const beatDuration = 60 / bpm;
  const totalBeats = Math.max(images.length, Math.floor((VLOG_DURATION - offset) / beatDuration) + 1);
  const landscape = width >= height;
  const key = `${seed}:${bpm}:${offset}:${totalBeats}:${landscape ? "l" : "p"}:${images.length}`;
  const cached = sparkPlanCache.get(images);
  if (cached?.key === key) return cached;

  const washRandom = mulberry32(seed ^ 0xa11ce);
  const plan: SparkPlanCache = {
    key,
    slots: buildSparkBeatSlots(images.length, totalBeats, seed, landscape),
    background: sampleSparkBackground(images, seed),
    imageWashes: images.map((image) => sampleImageWash(image, washRandom)),
  };
  sparkPlanCache.set(images, plan);
  return plan;
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
  const bpm = music.bpm ?? 92;
  const offset = music.beatOffset ?? 0.28;
  const beatDuration = 60 / bpm;
  const plan = getSparkPlan(images, seed, bpm, offset, width, height);
  const started = time >= offset;
  const beatPosition = started ? (time - offset) / beatDuration : 0;
  const beat = Math.max(0, Math.min(plan.slots.length - 1, Math.floor(beatPosition)));
  const beatPhase = started ? beatPosition - Math.floor(beatPosition) : 1;
  const slot = plan.slots[beat] ?? plan.slots[0];
  const image = images[slot.imageIndex] ?? images[0];
  const pulse = started ? Math.exp(-beatPhase * 8) * (beat % 4 === 0 ? 0.04 : 0.016) : 0;
  const burstAttack = slot.burst && started ? Math.exp(-beatPhase * 11) : 0;
  const wash = slot.burst
    ? pulseSparkWash(plan.imageWashes[slot.imageIndex] ?? plan.background, burstAttack)
    : plan.background;

  context.fillStyle = sparkRgbCss(wash);
  context.fillRect(0, 0, width, height);
  if (!image) return;

  if (slot.placement === "full") {
    drawCover(context, image, width, height, slot.progress, template, seed, slot.imageIndex, 1, pulse);
    if (burstAttack > 0.02) {
      context.fillStyle = `rgba(${wash.r}, ${wash.g}, ${wash.b}, ${burstAttack * 0.28})`;
      context.fillRect(0, 0, width, height);
    }
    return;
  }

  const insetX = slot.placement.x * width;
  const insetY = slot.placement.y * height;
  const insetWidth = slot.placement.w * width;
  const insetHeight = slot.placement.h * height;
  const pulseScale = 1 + pulse;

  context.save();
  context.translate(width / 2, height / 2);
  context.scale(pulseScale, pulseScale);
  context.translate(-width / 2, -height / 2);
  context.beginPath();
  context.rect(insetX, insetY, insetWidth, insetHeight);
  context.clip();
  drawStaticCover(context, image, insetX, insetY, insetWidth, insetHeight, 1.02);
  context.restore();
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

function getSparkHandFontFamily() {
  // Canvas cannot resolve CSS vars inside font strings — read the concrete family.
  if (typeof document !== "undefined") {
    const maShan = getComputedStyle(document.documentElement).getPropertyValue("--font-ma-shan").trim();
    if (maShan) return `${maShan}, "Ma Shan Zheng", "Segoe Script", "KaiTi", "STKaiti", cursive`;
  }
  return '"Ma Shan Zheng", "Segoe Script", "KaiTi", "STKaiti", cursive';
}

function sparkCornerOrder(seed: number): Array<0 | 1 | 2 | 3> {
  const order: Array<0 | 1 | 2 | 3> = [0, 1, 2, 3];
  const random = mulberry32(seed ^ 0x7e4c091);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [order[index], order[swap]] = [order[swap], order[index]];
  }
  return order;
}

function drawSparkCornerText(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  text: string,
  width: number,
  height: number,
  corner: 0 | 1 | 2 | 3,
  alpha: number,
) {
  if (!text || alpha <= 0) return;

  const shortEdge = Math.min(width, height);
  const pad = shortEdge * 0.055;
  const maxWidth = width * 0.42;
  let fontSize = shortEdge * 0.052;
  const family = getSparkHandFontFamily();
  context.save();
  context.globalAlpha = alpha;
  context.fillStyle = "#ffffff";
  context.font = `${fontSize}px ${family}`;

  while (fontSize > shortEdge * 0.03 && context.measureText(text).width > maxWidth) {
    fontSize *= 0.92;
    context.font = `${fontSize}px ${family}`;
  }

  const left = corner === 0 || corner === 2;
  const top = corner === 0 || corner === 1;
  context.textAlign = left ? "left" : "right";
  context.textBaseline = top ? "top" : "bottom";

  const x = left ? pad : width - pad;
  const y = top ? pad : height - pad;
  const tilt = (left ? -1 : 1) * (top ? 0.035 : -0.03);

  context.translate(x, y);
  context.rotate(tilt);
  context.shadowColor = "rgba(0, 0, 0, 0.28)";
  context.shadowBlur = shortEdge * 0.012;
  context.shadowOffsetY = shortEdge * 0.004;
  context.fillText(text, 0, 0, maxWidth);
  context.restore();
}

function drawSparkTypography(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  content: VlogTextContent,
  time: number,
  seed: number,
) {
  const segment = VLOG_DURATION / 3;
  const cues = [
    { text: content.subtitle.trim().slice(0, 18), start: 0, end: segment },
    { text: (content.subtitle2 ?? "").trim().slice(0, 18), start: segment, end: segment * 2 },
    { text: (content.subtitle3 ?? "").trim().slice(0, 18), start: segment * 2, end: VLOG_DURATION },
  ];
  const corners = sparkCornerOrder(seed);
  cues.forEach((cue, index) => {
    if (!cue.text) return;
    const alpha = phaseEnvelope(time, cue.start, cue.end, 0.45, 0.45);
    if (alpha <= 0) return;
    drawSparkCornerText(context, cue.text, width, height, corners[index] ?? 0, alpha);
  });
}

function drawTemplateTypography(
  context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number,
  template: VlogTemplate,
  content: VlogTextContent,
  time: number,
  seed = 0,
) {
  if (template.id === "spark") {
    drawSparkTypography(context, width, height, content, time, seed);
    return;
  }

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
    context.fillStyle = template.id === "film" ? "#3158bd" : template.id === "memory" || template.id === "still" ? "#514d45" : "#ffffff";
    context.textAlign = "center";
    const family = template.id === "memory" || template.id === "still" || template.id === "film" ? 'Georgia, "Songti SC", serif' : 'system-ui, "PingFang SC", sans-serif';
    const weight = template.id === "still" ? 500 : 700;
    context.font = `${weight} ${shortEdge * 0.041}px ${family}`;
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
    drawTemplateTypography(context, width, height, template, textContent, safeTime, seed);
    return;
  }

  const music = getMusicTrack(template, seed);
  if (template.layout === "book") {
    const spreadCount = Math.max(1, Math.ceil(images.length / 2));
    const timing = getBeatAlignedClipTiming(spreadCount, safeTime, music);
    drawBookFrame(context, images, timing.index, width, height, timing.localProgress, safeTime);
    drawTemplateTypography(context, width, height, template, textContent, safeTime, seed);
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
  drawTemplateTypography(context, width, height, template, textContent, safeTime, seed);
}

export type VlogClipMotion = {
  clipIndex: number;
  sourceIndex: number;
  timeRange: string;
  mode: string;
  summary: string;
  position: string;
  zoom: string;
  enter: string;
  exit: string;
  details: Array<{ key: string; value: string }>;
  tune: string[];
};

export type VlogSparkSlotDebug = {
  beat: number;
  imageIndex: number;
  placement: string;
  burst: boolean;
  motion: VlogClipMotion;
};

export type VlogDebugSnapshot = {
  seed: number;
  templateId: TemplateId;
  templateTitle: string;
  layout: LayoutMode;
  ratio: RatioId;
  exportSize: string;
  previewSize: string;
  musicIndex: number;
  musicTitle: string;
  bpm: number | null;
  beatOffset: number | null;
  motionOffset: number;
  sequence: ImageSequenceDebug;
  transition: number;
  minShotDuration: number;
  clips: VlogClipMotion[];
  templateTune: string[];
  spark?: {
    totalBeats: number;
    beatDuration: string;
    background: string;
    cornerOrder: string;
    slots: VlogSparkSlotDebug[];
  };
  book?: {
    spreadCount: number;
    spreads: Array<{ spreadIndex: number; leftIndex: number; rightIndex: number; variant: number; layoutName: string }>;
  };
};

const MOTION_NAMES: Record<MotionType, string> = {
  "zoom-in": "缓慢放大",
  "zoom-out": "缓慢缩小",
  "pan-left": "从右向左平移",
  "pan-right": "从左向右平移",
  "pan-up": "从下向上平移",
  "pan-down": "从上向下平移",
  "pan-side": "水平随机方向平移",
};

const ALBUM_VARIANTS = [
  { name: "左侧滑入", enter: "从左侧约 12% 宽度滑入", exit: "向右侧约 4.5% 退出", position: "水平位移 · 轻微旋转" },
  { name: "右侧滑入", enter: "从右侧约 12% 宽度滑入", exit: "向左侧约 4.5% 退出", position: "水平位移 · 轻微旋转" },
  { name: "上方滑入", enter: "从上方约 10% 高度滑入", exit: "向下方约 3.5% 退出", position: "垂直位移 · 轻微旋转" },
  { name: "左上斜入", enter: "自左上约 7% 斜向进入", exit: "向下约 2.5% 退出", position: "斜向位移" },
  { name: "右上斜入", enter: "自右上约 7% 斜向进入", exit: "向上约 3% 退出", position: "斜向位移" },
] as const;

const MINIMAL_VARIANTS = [
  { name: "左上留白", position: "照片偏左上 · 标记线靠左", zoom: "呼吸缩放（先扩后收）" },
  { name: "右上留白", position: "照片偏右上 · 标记线靠右", zoom: "呼吸缩放（先收后扩）" },
  { name: "下方留白", position: "照片偏下 · 标记线靠左", zoom: "呼吸缩放（先扩后收）" },
  { name: "上方留白", position: "照片偏上 · 标记线靠右", zoom: "呼吸缩放（先收后扩）" },
] as const;

const BOOK_LAYOUTS = ["跨页大图", "左右上下双图", "左大图 + 右拼贴"] as const;

function makeClipMotion(
  clipIndex: number,
  sourceIndex: number,
  start: number,
  end: number,
  fields: Omit<VlogClipMotion, "clipIndex" | "sourceIndex" | "timeRange">,
): VlogClipMotion {
  return {
    clipIndex,
    sourceIndex,
    timeRange: `${formatTimeLabel(start)} → ${formatTimeLabel(end)}`,
    ...fields,
  };
}

function describeCoverClipMotion(template: VlogTemplate, seed: number, index: number, start: number, end: number, sourceIndex: number): VlogClipMotion {
  const random = mulberry32(seed + index * 104729 + template.id.length * 7919);
  const motionOffset = Math.abs(seed + template.id.length * 7919) % template.motions.length;
  const motion = template.motions[(index + motionOffset) % template.motions.length];
  const minZoom = template.zoomMin + random() * 0.012;
  const maxZoom = template.zoomMax - random() * 0.01;
  const direction = random() > 0.5 ? 1 : -1;
  const drift = direction > 0 ? "右/下" : "左/上";

  let position = MOTION_NAMES[motion];
  let zoom = `${minZoom.toFixed(3)} → ${maxZoom.toFixed(3)}`;
  if (motion === "zoom-in") zoom = `${minZoom.toFixed(3)} → ${maxZoom.toFixed(3)}（放大）`;
  if (motion === "zoom-out") zoom = `${maxZoom.toFixed(3)} → ${minZoom.toFixed(3)}（缩小）`;
  if (motion === "pan-side") position = `${direction > 0 ? "从左向右" : "从右向左"}平移（随机方向）`;
  if (motion === "zoom-in" || motion === "zoom-out") {
    position += ` · 中心固定 + 轻微${drift}漂移`;
  }

  const easing = template.id === "wander" ? "连续漂移（首尾不停顿）" : "ease 缓入缓出";
  const transitionNote = template.layout === "cinematic"
    ? `${template.transition}s 交叉叠化`
    : `${template.transition}s 叠化`;

  return makeClipMotion(index, sourceIndex, start, end, {
    mode: "全屏 cover 运镜",
    summary: `${MOTION_NAMES[motion]} · ${easing}`,
    position,
    zoom,
    enter: index === 0 ? "首帧直接出现" : `与前镜头 ${transitionNote} 进入`,
    exit: index === 0 ? "—" : ` ${transitionNote} 切出`,
    details: [
      { key: "motion", value: motion },
      { key: "motionOffset", value: String(motionOffset) },
      { key: "panDirection", value: direction > 0 ? "+1" : "-1" },
      { key: "panStrength", value: String(template.panStrength) },
      { key: "easing", value: easing },
    ],
    tune: ["template.motions", "template.zoomMin / zoomMax", "template.panStrength", "template.transition", "seed（换 seed 改运镜序列）"],
  });
}

function describeAlbumClipMotion(seed: number, index: number, start: number, end: number, sourceIndex: number, transition: number): VlogClipMotion {
  const random = mulberry32(seed + index * 65537 + 29);
  const variant = Math.floor(random() * 5);
  const profile = ALBUM_VARIANTS[variant] ?? ALBUM_VARIANTS[0];
  const sizeVariant = 0.94 + random() * 0.1;
  const baseRotation = (random() * 2 - 1) * 0.052;

  return makeClipMotion(index, sourceIndex, start, end, {
    mode: `相纸画册 · 变体 ${variant}`,
    summary: `${profile.name} · 漂浮相纸`,
    position: profile.position,
    zoom: `相纸尺寸 ${(sizeVariant * 100).toFixed(1)}% · 背景模糊 cover`,
    enter: profile.enter,
    exit: profile.exit,
    details: [
      { key: "variant", value: String(variant) },
      { key: "rotation", value: `${(baseRotation * (180 / Math.PI)).toFixed(1)}°` },
      { key: "floatY", value: "镜头内轻微上下漂浮" },
      { key: "transition", value: `${transition}s 画册叠化` },
    ],
    tune: ["drawAlbumFrame 变体 0–4 位移系数", "template.transition", "seed"],
  });
}

function describeMinimalClipMotion(seed: number, index: number, start: number, end: number, sourceIndex: number, transition: number): VlogClipMotion {
  const variant = Math.abs(seed + index * 17) % 4;
  const profile = MINIMAL_VARIANTS[variant] ?? MINIMAL_VARIANTS[0];

  return makeClipMotion(index, sourceIndex, start, end, {
    mode: `极简留白 · 变体 ${variant}`,
    summary: profile.name,
    position: profile.position,
    zoom: profile.zoom,
    enter: "淡入 · 轻微位移动画",
    exit: `${transition}s 慢叠化切出`,
    details: [
      { key: "variant", value: String(variant) },
      { key: "containScale", value: "完整照片 contain + 1.2% 呼吸" },
      { key: "marker", value: variant % 2 === 0 ? "左侧竖线标记" : "右侧竖线标记" },
    ],
    tune: ["drawMinimalFrame 变体 0–3 偏移表", "template.transition", "seed"],
  });
}

function describeBookClipMotion(
  spreadIndex: number,
  leftIndex: number,
  rightIndex: number,
  variant: number,
  start: number,
  end: number,
  transition: number,
): VlogClipMotion {
  const layoutName = BOOK_LAYOUTS[variant] ?? BOOK_LAYOUTS[0];
  return makeClipMotion(spreadIndex, leftIndex, start, end, {
    mode: `3D 翻页 · ${layoutName}`,
    summary: `跨页 #${spreadIndex + 1} · 左 #${leftIndex + 1} / 右 #${rightIndex + 1}`,
    position: layoutName,
    zoom: variant === 0 ? "左页 cover 1.015" : "contain 完整显示",
    enter: "拍点对齐翻页进入",
    exit: `${transition}s 翻页切出`,
    details: [
      { key: "variant", value: String(variant) },
      { key: "rightPhoto", value: `#${rightIndex + 1}` },
      { key: "flip", value: "Three.js 书本翻页" },
    ],
    tune: ["book-three.ts composeSpread", "music.bpm / beatOffset", "seed"],
  });
}

function describeSparkSlotMotion(
  slot: SparkBeatSlot,
  beat: number,
  beatDuration: number,
  offset: number,
  template: VlogTemplate,
  seed: number,
  sourceIndex: number,
): VlogClipMotion {
  const start = offset + beat * beatDuration;
  const end = start + beatDuration;
  const placementLabel = formatSparkPlacement(slot.placement);
  const burst = Boolean(slot.burst);

  if (slot.placement === "full") {
    const cover = describeCoverClipMotion(template, seed, slot.imageIndex, start, end, sourceIndex);
    return {
      ...cover,
      clipIndex: beat,
      timeRange: `${formatTimeLabel(start)} → ${formatTimeLabel(end)}`,
      mode: burst ? "四闪 burst · 全屏" : "全屏 · 拍点硬切",
      summary: `${burst ? "四连闪 " : ""}${cover.summary}`,
      enter: burst ? "闪白叠入 + 硬切" : "拍点硬切",
      exit: "下一拍硬切",
      details: [
        ...cover.details,
        { key: "placement", value: "full" },
        { key: "burst", value: burst ? "yes" : "no" },
        { key: "pulse", value: beat % 4 === 0 ? "四拍重音闪白" : "轻脉冲" },
      ],
      tune: ["buildSparkBeatSlots 概率", "template.zoomMin / zoomMax", "music.bpm", "seed"],
    };
  }

  const placement = slot.placement;
  return makeClipMotion(beat, sourceIndex, start, end, {
    mode: burst ? "四闪 burst · 插图" : "插图 · 拍点硬切",
    summary: `${burst ? "四连闪 " : ""}固定区域 ${(placement.w * 100).toFixed(0)}×${(placement.h * 100).toFixed(0)}%`,
    position: `区域 (${(placement.x * 100).toFixed(0)}%, ${(placement.y * 100).toFixed(0)}%) · 静止 contain`,
    zoom: "contain 1.02 · 无运镜",
    enter: burst ? "闪白叠入" : "拍点切入",
    exit: "下一拍切出",
    details: [
      { key: "placement", value: placementLabel },
      { key: "burst", value: burst ? "yes" : "no" },
      { key: "progress", value: slot.progress.toFixed(2) },
    ],
    tune: ["randomSparkInset 边距/尺寸", "pickSparkPlacement fullChance", "seed"],
  });
}

function templateTuneHints(template: VlogTemplate): string[] {
  const common = [`${template.id} · minShotDuration ${template.minShotDuration}s`, `transition ${template.transition}s`, "seed", "music[]"];
  if (template.layout === "cinematic") return [...common, "motions[]", "zoomMin / zoomMax", "panStrength"];
  if (template.layout === "album") return [...common, "drawAlbumFrame 五变体"];
  if (template.layout === "minimal") return [...common, "drawMinimalFrame 四变体"];
  if (template.layout === "beat") return [...common, "buildSparkBeatSlots", "BPM / beatOffset"];
  if (template.layout === "book") return [...common, "book-three.ts", "BPM 翻页对齐"];
  return common;
}

function formatSparkPlacement(placement: SparkPlacement) {
  if (placement === "full") return "全屏";
  return `${(placement.w * 100).toFixed(0)}×${(placement.h * 100).toFixed(0)}% @(${(placement.x * 100).toFixed(0)},${(placement.y * 100).toFixed(0)})`;
}

function formatRgb(color: SparkRgb) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function formatTimeLabel(seconds: number) {
  return `${seconds.toFixed(2)}s`;
}

function cornerLabel(corner: 0 | 1 | 2 | 3) {
  return ["左上", "右上", "左下", "右下"][corner] ?? String(corner);
}

export function buildVlogDebugSnapshot(
  images: HTMLImageElement[],
  template: VlogTemplate,
  seed: number,
  ratio: RatioId,
): VlogDebugSnapshot {
  const prepared = prepareImageSequence(images, template, seed);
  const musicIndex = Math.abs(seed) % template.music.length;
  const music = template.music[musicIndex] ?? template.music[0];
  const motionOffset = Math.abs(seed + template.id.length * 7919) % template.motions.length;
  const exportSize = RATIOS[ratio];
  const preview = previewDimensions(ratio);
  const selectedIndices = prepared.debug.selectedIndices;
  const photoCount = prepared.usedCount;
  const templateTune = templateTuneHints(template);
  const base = {
    seed,
    templateId: template.id,
    templateTitle: template.title,
    layout: template.layout,
    ratio,
    exportSize: `${exportSize.width}×${exportSize.height}`,
    previewSize: `${preview.width}×${preview.height}`,
    musicIndex,
    musicTitle: music.title,
    bpm: music.bpm ?? null,
    beatOffset: music.beatOffset ?? null,
    motionOffset,
    sequence: prepared.debug,
    transition: template.transition,
    minShotDuration: template.minShotDuration,
    templateTune,
  };

  if (template.layout === "beat") {
    const bpm = music.bpm ?? 92;
    const offset = music.beatOffset ?? 0.28;
    const beatDuration = 60 / bpm;
    const totalBeats = Math.max(photoCount, Math.floor((VLOG_DURATION - offset) / beatDuration) + 1);
    const plan = getSparkPlan(prepared.images, seed, bpm, offset, preview.width, preview.height);
    const slots = plan.slots.map((slot, beat) => {
      const sourceIndex = selectedIndices[slot.imageIndex] ?? slot.imageIndex;
      const motion = describeSparkSlotMotion(slot, beat, beatDuration, offset, template, seed, sourceIndex);
      return {
        beat,
        imageIndex: slot.imageIndex,
        placement: formatSparkPlacement(slot.placement),
        burst: Boolean(slot.burst),
        motion,
      };
    });

    return {
      ...base,
      clips: slots.map((slot) => slot.motion),
      spark: {
        totalBeats,
        beatDuration: `${beatDuration.toFixed(3)}s`,
        background: formatRgb(plan.background),
        cornerOrder: sparkCornerOrder(seed).map(cornerLabel).join(" → "),
        slots,
      },
    };
  }

  if (template.layout === "book") {
    const spreadCount = Math.max(1, Math.ceil(photoCount / 2));
    const clipDuration = VLOG_DURATION / spreadCount;
    const spreads = Array.from({ length: spreadCount }, (_, spreadIndex) => {
      const leftIndex = selectedIndices[(spreadIndex * 2) % photoCount] ?? 0;
      const rightIndex = selectedIndices[(spreadIndex * 2 + 1) % photoCount] ?? 0;
      const variant = spreadIndex % 3;
      return { spreadIndex, leftIndex, rightIndex, variant, layoutName: BOOK_LAYOUTS[variant] ?? BOOK_LAYOUTS[0] };
    });
    const clips = spreads.map(({ spreadIndex, leftIndex, rightIndex, variant }) =>
      describeBookClipMotion(spreadIndex, leftIndex, rightIndex, variant, spreadIndex * clipDuration, (spreadIndex + 1) * clipDuration, template.transition),
    );

    return { ...base, clips, book: { spreadCount, spreads } };
  }

  const clipDuration = VLOG_DURATION / Math.max(1, photoCount);
  const clips = Array.from({ length: photoCount }, (_, index) => {
    const sourceIndex = selectedIndices[index] ?? index;
    const start = index * clipDuration;
    const end = start + clipDuration;
    if (template.layout === "album") return describeAlbumClipMotion(seed, index, start, end, sourceIndex, template.transition);
    if (template.layout === "minimal") return describeMinimalClipMotion(seed, index, start, end, sourceIndex, template.transition);
    return describeCoverClipMotion(template, seed, index, start, end, sourceIndex);
  });

  return { ...base, clips };
}
