import * as THREE from "three";

const PAGE_WIDTH = 1.55;
const PAGE_HEIGHT = 2.16;
const PAPER = 0xf6f1e5;
const TEXTURE_WIDTH = 720;
const TEXTURE_HEIGHT = 1004;
const PAGE_RADIUS = 32;

type PageSide = "left" | "right";
type PagePair = { left: THREE.CanvasTexture; right: THREE.CanvasTexture };
type FlipUniforms = { progress: { value: number }; backMap: { value: THREE.Texture | null } };

type BookState = {
  backCover: THREE.Mesh;
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  contactShadow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;
  cover: THREE.Mesh;
  flipDepthMaterial: THREE.MeshDepthMaterial;
  flipMaterial: THREE.MeshStandardMaterial;
  flipPage: THREE.Mesh;
  flipUniforms: FlipUniforms;
  group: THREE.Group;
  leftMaterial: THREE.MeshStandardMaterial;
  leftStack: THREE.Mesh;
  renderer: THREE.WebGLRenderer;
  rightMaterial: THREE.MeshStandardMaterial;
  rightStack: THREE.Mesh;
  scene: THREE.Scene;
};

const spreadCache = new WeakMap<HTMLImageElement[], Map<string, PagePair>>();
let state: BookState | null = null;

const JOURNAL_LABELS = ["沿途", "晴日", "慢游", "拾光", "在路上", "小记"];
const JOURNAL_NOTES = [
  ["风从窗边经过", "今天适合走远一点"],
  ["没有赶路", "只是把光慢慢收好"],
  ["绕过熟悉的街角", "遇见新的天气"],
  ["留一页给黄昏", "也留一点给自己"],
  ["地图之外", "还有很多温柔的方向"],
];
const TAB_COLORS = ["#d96d57", "#6f8f83", "#d7a84f", "#7987b9", "#ab7c94"];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function mulberry32(seed: number) {
  let value = seed >>> 0;
  return () => {
    value |= 0;
    value = (value + 0x6d2b79f5) | 0;
    let next = Math.imul(value ^ (value >>> 15), 1 | value);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  half: PageSide | null = null,
) {
  const targetAspect = half ? (width * 2) / height : width / height;
  const imageAspect = image.width / image.height;
  let sourceWidth = image.width;
  let sourceHeight = image.height;
  let sourceX = 0;
  let sourceY = 0;
  if (imageAspect > targetAspect) {
    sourceWidth = image.height * targetAspect;
    sourceX = (image.width - sourceWidth) / 2;
  } else {
    sourceHeight = image.width / targetAspect;
    sourceY = (image.height - sourceHeight) / 2;
  }
  if (half) {
    sourceWidth /= 2;
    if (half === "right") sourceX += sourceWidth;
  }
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function paintGridPaper(context: CanvasRenderingContext2D, random: () => number, tint = "#f7f3e8") {
  context.fillStyle = tint;
  context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

  const glow = context.createRadialGradient(
    TEXTURE_WIDTH * 0.42,
    TEXTURE_HEIGHT * 0.3,
    20,
    TEXTURE_WIDTH * 0.5,
    TEXTURE_HEIGHT * 0.52,
    TEXTURE_HEIGHT * 0.82,
  );
  glow.addColorStop(0, "rgba(255,255,255,.32)");
  glow.addColorStop(1, "rgba(151,126,87,.055)");
  context.fillStyle = glow;
  context.fillRect(0, 0, TEXTURE_WIDTH, TEXTURE_HEIGHT);

  const grid = 28;
  context.save();
  context.lineWidth = 1;
  for (let x = grid; x < TEXTURE_WIDTH; x += grid) {
    context.strokeStyle = x % (grid * 5) === 0 ? "rgba(84,113,121,.13)" : "rgba(84,113,121,.07)";
    context.beginPath();
    context.moveTo(x + 0.5, 0);
    context.lineTo(x + 0.5, TEXTURE_HEIGHT);
    context.stroke();
  }
  for (let y = grid; y < TEXTURE_HEIGHT; y += grid) {
    context.strokeStyle = y % (grid * 5) === 0 ? "rgba(84,113,121,.13)" : "rgba(84,113,121,.07)";
    context.beginPath();
    context.moveTo(0, y + 0.5);
    context.lineTo(TEXTURE_WIDTH, y + 0.5);
    context.stroke();
  }
  context.restore();

  context.save();
  context.globalCompositeOperation = "multiply";
  for (let index = 0; index < 900; index += 1) {
    const alpha = 0.012 + random() * 0.018;
    context.fillStyle = `rgba(92,74,52,${alpha})`;
    context.fillRect(random() * TEXTURE_WIDTH, random() * TEXTURE_HEIGHT, 0.7 + random(), 0.7 + random());
  }
  context.restore();
}

function paintPageDepth(context: CanvasRenderingContext2D, side: PageSide) {
  const spineX = side === "left" ? TEXTURE_WIDTH : 0;
  const spineWidth = TEXTURE_WIDTH * 0.09;
  const spine = context.createLinearGradient(
    spineX,
    0,
    spineX + (side === "left" ? -spineWidth : spineWidth),
    0,
  );
  spine.addColorStop(0, "rgba(63,52,40,.19)");
  spine.addColorStop(0.32, "rgba(91,75,54,.075)");
  spine.addColorStop(1, "rgba(91,75,54,0)");
  context.fillStyle = spine;
  context.fillRect(side === "left" ? TEXTURE_WIDTH - spineWidth : 0, 0, spineWidth, TEXTURE_HEIGHT);

  const bottom = context.createLinearGradient(0, TEXTURE_HEIGHT, 0, TEXTURE_HEIGHT - 42);
  bottom.addColorStop(0, "rgba(85,65,44,.095)");
  bottom.addColorStop(1, "rgba(85,65,44,0)");
  context.fillStyle = bottom;
  context.fillRect(0, TEXTURE_HEIGHT - 42, TEXTURE_WIDTH, 42);
}

function createPageCanvas(side: PageSide, random: () => number) {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.save();
  roundedRect(context, 0, 0, canvas.width, canvas.height, PAGE_RADIUS);
  context.clip();
  paintGridPaper(context, random);
  paintPageDepth(context, side);
  return { canvas, context };
}

function finishPage(context: CanvasRenderingContext2D) {
  context.restore();
}

function drawTape(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  length: number,
  rotation: number,
  random: () => number,
  color = "#dce5d7",
) {
  const height = Math.max(24, length * 0.24);
  const half = length / 2;
  const edgeSteps = 6;
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.globalAlpha = 0.7;
  context.beginPath();
  context.moveTo(-half + (random() - 0.5) * 3, -height / 2);
  context.lineTo(half + (random() - 0.5) * 3, -height / 2);
  for (let step = 1; step <= edgeSteps; step += 1) {
    context.lineTo(half + (random() - 0.5) * 4, -height / 2 + (height * step) / edgeSteps);
  }
  context.lineTo(-half + (random() - 0.5) * 3, height / 2);
  for (let step = edgeSteps - 1; step >= 0; step -= 1) {
    context.lineTo(-half + (random() - 0.5) * 4, -height / 2 + (height * step) / edgeSteps);
  }
  context.closePath();
  context.shadowColor = "rgba(55,45,33,.18)";
  context.shadowBlur = 9;
  context.shadowOffsetY = 3;
  context.fillStyle = color;
  context.fill();
  context.shadowColor = "transparent";
  context.clip();

  const sheen = context.createLinearGradient(0, -height / 2, 0, height / 2);
  sheen.addColorStop(0, "rgba(255,255,255,.58)");
  sheen.addColorStop(0.5, "rgba(255,255,255,.04)");
  sheen.addColorStop(1, "rgba(255,255,255,.28)");
  context.fillStyle = sheen;
  context.fillRect(-half, -height / 2, length, height);
  context.globalAlpha = 0.11;
  context.strokeStyle = "#6b705e";
  context.lineWidth = 1;
  for (let line = -half; line < half; line += 5) {
    context.beginPath();
    context.moveTo(line, -height / 2);
    context.lineTo(line + (random() - 0.5) * 2, height / 2);
    context.stroke();
  }
  context.restore();
}

function drawPhotoCard(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  centerX: number,
  centerY: number,
  width: number,
  height: number,
  rotation: number,
  random: () => number,
  options: { caption?: string; tape?: "center" | "corners"; borderBottom?: number } = {},
) {
  const border = 16;
  const borderBottom = options.borderBottom ?? (options.caption ? 52 : 18);
  context.save();
  context.translate(centerX, centerY);
  context.rotate(rotation);
  context.shadowColor = "rgba(61,47,31,.18)";
  context.shadowBlur = 24;
  context.shadowOffsetY = 10;
  context.fillStyle = "#fffdf8";
  roundedRect(context, -width / 2 - border, -height / 2 - border, width + border * 2, height + border + borderBottom, 7);
  context.fill();
  context.shadowColor = "transparent";
  context.save();
  roundedRect(context, -width / 2, -height / 2, width, height, 3);
  context.clip();
  drawImageCover(context, image, -width / 2, -height / 2, width, height);
  const photoSheen = context.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
  photoSheen.addColorStop(0, "rgba(255,255,255,.11)");
  photoSheen.addColorStop(0.35, "rgba(255,255,255,0)");
  photoSheen.addColorStop(1, "rgba(38,26,15,.04)");
  context.fillStyle = photoSheen;
  context.fillRect(-width / 2, -height / 2, width, height);
  context.restore();
  context.strokeStyle = "rgba(84,67,48,.12)";
  context.lineWidth = 1;
  roundedRect(context, -width / 2, -height / 2, width, height, 3);
  context.stroke();
  if (options.caption) {
    context.fillStyle = "rgba(58,55,48,.78)";
    context.font = '600 22px "Ma Shan Zheng", "KaiTi", cursive';
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(options.caption, 0, height / 2 + borderBottom * 0.58, width * 0.9);
  }
  if (options.tape === "center") {
    drawTape(context, 0, -height / 2 - border + 2, Math.min(126, width * 0.34), (random() - 0.5) * 0.14, random);
  } else if (options.tape === "corners") {
    drawTape(context, -width * 0.39, -height * 0.42, Math.min(112, width * 0.3), -0.62, random, "#e6d9c5");
    drawTape(context, width * 0.39, -height * 0.42, Math.min(112, width * 0.3), 0.62, random, "#d9e2e6");
  }
  context.restore();
}

function drawHandNote(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  lines: string[],
  random: () => number,
  size = 25,
) {
  context.save();
  context.translate(x, y);
  context.rotate((random() - 0.5) * 0.035);
  context.fillStyle = "rgba(54,57,54,.76)";
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  lines.forEach((line, index) => {
    context.font = `${size + (index === 0 ? 1 : 0)}px "Ma Shan Zheng", "KaiTi", cursive`;
    context.fillText(line, (random() - 0.5) * 4, index * size * 1.48, TEXTURE_WIDTH * 0.72);
  });
  context.restore();
}

function drawStamp(context: CanvasRenderingContext2D, x: number, y: number, label: string, random: () => number) {
  context.save();
  context.translate(x, y);
  context.rotate((random() - 0.5) * 0.28);
  context.globalAlpha = 0.72;
  context.strokeStyle = "#a75e4d";
  context.lineWidth = 2;
  context.beginPath();
  context.arc(0, 0, 38, 0, Math.PI * 2);
  context.stroke();
  context.beginPath();
  context.arc(0, 0, 31, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = "#a75e4d";
  context.font = '600 13px ui-monospace, "SFMono-Regular", monospace';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(label, 0, -5);
  context.font = '10px ui-monospace, "SFMono-Regular", monospace';
  context.fillText("MOMENT", 0, 11);
  context.restore();
}

function drawTicket(context: CanvasRenderingContext2D, x: number, y: number, width: number, random: () => number) {
  const height = width * 0.36;
  context.save();
  context.translate(x, y);
  context.rotate((random() - 0.5) * 0.08);
  context.shadowColor = "rgba(63,49,34,.15)";
  context.shadowBlur = 16;
  context.shadowOffsetY = 6;
  context.fillStyle = "#fbf7ec";
  roundedRect(context, -width / 2, -height / 2, width, height, 10);
  context.fill();
  context.shadowColor = "transparent";
  context.fillStyle = TAB_COLORS[Math.floor(random() * TAB_COLORS.length)];
  roundedRect(context, -width / 2, -height / 2, width, height * 0.29, 10);
  context.fill();
  context.fillRect(-width / 2, -height / 2 + height * 0.15, width, height * 0.14);
  context.fillStyle = "rgba(255,255,255,.92)";
  context.font = '600 13px ui-monospace, "SFMono-Regular", monospace';
  context.textAlign = "left";
  context.fillText("FIELD NOTE · 01", -width / 2 + 15, -height / 2 + height * 0.2);
  context.strokeStyle = "rgba(83,69,50,.35)";
  context.setLineDash([4, 5]);
  context.beginPath();
  context.moveTo(width * 0.23, -height / 2 + 8);
  context.lineTo(width * 0.23, height / 2 - 8);
  context.stroke();
  context.setLineDash([]);
  context.fillStyle = "rgba(72,63,52,.66)";
  context.font = '11px ui-monospace, "SFMono-Regular", monospace';
  context.fillText("KEEP THE SMALL THINGS", -width / 2 + 15, height * 0.1);
  context.fillText(`NO. ${String(Math.floor(random() * 900) + 100)}`, -width / 2 + 15, height * 0.27);
  context.fillStyle = "rgba(62,54,44,.75)";
  let barX = width * 0.28;
  while (barX < width / 2 - 12) {
    const barWidth = 1 + random() * 2.8;
    context.fillRect(barX, -height * 0.14, barWidth, height * 0.29);
    barX += barWidth + 2 + random() * 2;
  }
  context.restore();
}

function drawTab(context: CanvasRenderingContext2D, side: PageSide, spreadIndex: number) {
  const width = 82;
  const height = 34;
  const x = side === "left" ? 18 : TEXTURE_WIDTH - width - 18;
  const y = 54 + (spreadIndex % 5) * 45;
  context.save();
  context.fillStyle = TAB_COLORS[spreadIndex % TAB_COLORS.length];
  context.globalAlpha = 0.92;
  roundedRect(context, x, y, width, height, 17);
  context.fill();
  context.fillStyle = "rgba(255,255,255,.92)";
  context.font = '600 12px ui-monospace, "SFMono-Regular", monospace';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(`NOTE ${String(spreadIndex + 1).padStart(2, "0")}`, x + width / 2, y + height / 2 + 0.5);
  context.restore();
}

function drawFootnote(context: CanvasRenderingContext2D, side: PageSide, spreadIndex: number) {
  const margin = 42;
  const y = TEXTURE_HEIGHT - 38;
  context.save();
  context.strokeStyle = "rgba(70,74,69,.25)";
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(margin, y - 19);
  context.lineTo(TEXTURE_WIDTH - margin, y - 19);
  context.stroke();
  context.fillStyle = "rgba(60,63,58,.55)";
  context.font = '10px ui-monospace, "SFMono-Regular", monospace';
  context.textBaseline = "middle";
  context.textAlign = side === "left" ? "left" : "right";
  context.fillText(
    side === "left" ? "MINI QUICK CUT · TRAVEL NOTES" : JOURNAL_LABELS[spreadIndex % JOURNAL_LABELS.length].toUpperCase(),
    side === "left" ? margin : TEXTURE_WIDTH - margin,
    y,
  );
  context.textAlign = side === "left" ? "right" : "left";
  context.fillText(
    String(spreadIndex * 2 + (side === "left" ? 1 : 2)).padStart(2, "0"),
    side === "left" ? TEXTURE_WIDTH - margin : margin,
    y,
  );
  context.restore();
}

function decoratePage(context: CanvasRenderingContext2D, side: PageSide, spreadIndex: number) {
  drawTab(context, side, spreadIndex);
  drawFootnote(context, side, spreadIndex);
  paintPageDepth(context, side);
}

function composeSpread(images: HTMLImageElement[], spreadIndex: number, seed: number) {
  const random = mulberry32(seed ^ (spreadIndex + 1) * 0x45d9f3b);
  const leftPage = createPageCanvas("left", random);
  const rightPage = createPageCanvas("right", random);
  const imageA = images[(spreadIndex * 2) % images.length] ?? images[0];
  const imageB = images[(spreadIndex * 2 + 1) % images.length] ?? imageA;
  const variant = spreadIndex % 4;
  const caption = JOURNAL_LABELS[(spreadIndex + Math.floor(random() * JOURNAL_LABELS.length)) % JOURNAL_LABELS.length];
  const note = JOURNAL_NOTES[(spreadIndex + Math.floor(random() * JOURNAL_NOTES.length)) % JOURNAL_NOTES.length];

  if (variant === 0) {
    const top = 82;
    const photoHeight = 748;
    leftPage.context.save();
    roundedRect(leftPage.context, 42, top, TEXTURE_WIDTH - 42, photoHeight, 5);
    leftPage.context.clip();
    drawImageCover(leftPage.context, imageA, 42, top, TEXTURE_WIDTH - 42, photoHeight, "left");
    leftPage.context.restore();
    rightPage.context.save();
    roundedRect(rightPage.context, 0, top, TEXTURE_WIDTH - 42, photoHeight, 5);
    rightPage.context.clip();
    drawImageCover(rightPage.context, imageA, 0, top, TEXTURE_WIDTH - 42, photoHeight, "right");
    rightPage.context.restore();
    leftPage.context.strokeStyle = rightPage.context.strokeStyle = "rgba(255,253,247,.9)";
    leftPage.context.lineWidth = rightPage.context.lineWidth = 10;
    leftPage.context.strokeRect(37, top - 5, TEXTURE_WIDTH - 32, photoHeight + 10);
    rightPage.context.strokeRect(-5, top - 5, TEXTURE_WIDTH - 32, photoHeight + 10);
    drawHandNote(leftPage.context, 56, 881, [caption, "a little light, kept here"], random, 24);
    drawStamp(rightPage.context, TEXTURE_WIDTH - 86, 886, `0${(spreadIndex % 9) + 1}.24`, random);
  } else if (variant === 1) {
    drawPhotoCard(leftPage.context, imageA, 355, 475, 490, 610, -0.025 + random() * 0.035, random, {
      caption,
      tape: "corners",
    });
    drawHandNote(rightPage.context, 72, 128, note, random, 27);
    drawPhotoCard(rightPage.context, imageB, 380, 510, 390, 455, 0.035 - random() * 0.065, random, {
      caption: "today's little find",
      tape: "center",
    });
    drawTicket(rightPage.context, 330, 835, 430, random);
    drawStamp(rightPage.context, 592, 186, `0${(spreadIndex % 9) + 1}.24`, random);
  } else if (variant === 2) {
    drawPhotoCard(leftPage.context, imageA, 365, 330, 500, 330, -0.03, random, { tape: "center" });
    drawPhotoCard(leftPage.context, imageB, 345, 700, 420, 310, 0.035, random, { caption, tape: "corners" });
    drawHandNote(rightPage.context, 78, 144, [caption, ...note], random, 28);
    drawPhotoCard(rightPage.context, imageA, 405, 620, 470, 520, -0.018 + random() * 0.04, random, { tape: "center" });
    drawStamp(rightPage.context, 118, 832, `0${(spreadIndex % 9) + 1}.24`, random);
  } else {
    drawHandNote(leftPage.context, 70, 130, note, random, 27);
    drawPhotoCard(leftPage.context, imageA, 350, 555, 500, 565, -0.045 + random() * 0.04, random, {
      caption: "made of small moments",
      tape: "center",
    });
    drawPhotoCard(rightPage.context, imageB, 385, 365, 470, 410, 0.025 - random() * 0.05, random, { tape: "corners" });
    drawPhotoCard(rightPage.context, imageA, 350, 730, 310, 230, -0.04 + random() * 0.08, random, { caption });
    drawTicket(rightPage.context, 480, 858, 330, random);
  }

  decoratePage(leftPage.context, "left", spreadIndex);
  decoratePage(rightPage.context, "right", spreadIndex);
  finishPage(leftPage.context);
  finishPage(rightPage.context);
  return { left: leftPage.canvas, right: rightPage.canvas };
}

function makePageTexture(canvas: HTMLCanvasElement) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  if (state) texture.anisotropy = Math.min(8, state.renderer.capabilities.getMaxAnisotropy());
  return texture;
}

function spreadTextures(images: HTMLImageElement[], spreadIndex: number, seed: number) {
  let cache = spreadCache.get(images);
  if (!cache) {
    cache = new Map();
    spreadCache.set(images, cache);
  }
  const key = `${seed}:${spreadIndex}:${images.length}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const pages = composeSpread(images, spreadIndex, seed);
  const textures = { left: makePageTexture(pages.left), right: makePageTexture(pages.right) };
  cache.set(key, textures);
  return textures;
}

function createPageGeometry(direction: PageSide, segmentsX = 1, segmentsY = 1) {
  const geometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, segmentsX, segmentsY);
  geometry.translate(direction === "right" ? PAGE_WIDTH / 2 : -PAGE_WIDTH / 2, 0, 0);
  return geometry;
}

function roundedShape(width: number, height: number, radius: number) {
  const shape = new THREE.Shape();
  const left = -width / 2;
  const bottom = -height / 2;
  shape.moveTo(left + radius, bottom);
  shape.lineTo(left + width - radius, bottom);
  shape.quadraticCurveTo(left + width, bottom, left + width, bottom + radius);
  shape.lineTo(left + width, bottom + height - radius);
  shape.quadraticCurveTo(left + width, bottom + height, left + width - radius, bottom + height);
  shape.lineTo(left + radius, bottom + height);
  shape.quadraticCurveTo(left, bottom + height, left, bottom + height - radius);
  shape.lineTo(left, bottom + radius);
  shape.quadraticCurveTo(left, bottom, left + radius, bottom);
  return shape;
}

function createRoundedBlock(width: number, height: number, depth: number, color: number) {
  const geometry = new THREE.ExtrudeGeometry(roundedShape(width, height, 0.065), {
    depth,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.012,
    bevelThickness: 0.008,
    curveSegments: 12,
  });
  geometry.center();
  const material = new THREE.MeshStandardMaterial({ color, roughness: 0.96, metalness: 0 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function pageMaterial() {
  return new THREE.MeshStandardMaterial({
    color: PAPER,
    roughness: 0.97,
    metalness: 0,
    side: THREE.DoubleSide,
    alphaTest: 0.04,
  });
}

function bendVertexSource(progressUniform = "uTurn") {
  return `
    float pageU = clamp(position.x / ${PAGE_WIDTH.toFixed(3)}, 0.0, 1.0);
    float turnArc = ${progressUniform} * 3.14159265;
    float turnLift = sin(${progressUniform} * 3.14159265);
    float curl = sin(pageU * 3.14159265);
    float edgeLag = (1.0 - ${progressUniform}) * (1.0 - pageU);
    float localAngle = turnArc * (1.0 - edgeLag * 0.16) - turnLift * curl * 0.085;
  `;
}

function injectFlipVertex(shader: THREE.WebGLProgramParametersWithUniforms, uniforms: FlipUniforms) {
  shader.uniforms.uTurn = uniforms.progress;
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", "#include <common>\nuniform float uTurn;")
    .replace("#include <beginnormal_vertex>", `
      ${bendVertexSource()}
      vec3 objectNormal = normalize(vec3(sin(localAngle), 0.0, cos(localAngle)));
    `)
    .replace("#include <begin_vertex>", `
      vec3 transformed = vec3(position);
      {
        ${bendVertexSource()}
        transformed.x = cos(localAngle) * position.x;
        transformed.z = sin(localAngle) * position.x + turnLift * curl * 0.19;
        transformed.y += turnLift * curl * (0.035 + 0.012 * cos(uv.y * 6.28318));
      }
    `);
}

function createFlipMaterial(uniforms: FlipUniforms) {
  const material = new THREE.MeshStandardMaterial({
    color: PAPER,
    roughness: 0.96,
    metalness: 0,
    side: THREE.DoubleSide,
    alphaTest: 0.04,
  });
  // Transparent DoubleSide materials are rendered in two passes by Three.js;
  // that makes both passes sample the front map. Alpha testing gives us the
  // rounded corners without transparency, so one double-sided pass can use
  // gl_FrontFacing reliably for the leaf's reverse texture.
  material.forceSinglePass = true;
  material.onBeforeCompile = (shader) => {
    injectFlipVertex(shader, uniforms);
    shader.uniforms.uBackMap = uniforms.backMap;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform sampler2D uBackMap;")
      .replace("#include <map_fragment>", `
        #ifdef USE_MAP
          vec4 pageColor = gl_FrontFacing
            ? texture2D(map, vMapUv)
            : texture2D(uBackMap, vec2(1.0 - vMapUv.x, vMapUv.y));
          diffuseColor *= pageColor;
        #endif
      `);
  };
  material.customProgramCacheKey = () => "mini-quick-cut-journal-page-v2";
  return material;
}

function createFlipDepthMaterial(uniforms: FlipUniforms) {
  const material = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    alphaTest: 0.04,
  });
  material.onBeforeCompile = (shader) => injectFlipVertex(shader, uniforms);
  material.customProgramCacheKey = () => "mini-quick-cut-journal-depth-v2";
  return material;
}

function createContactShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 240;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(320, 112, 18, 320, 118, 310);
  gradient.addColorStop(0, "rgba(43,40,48,.18)");
  gradient.addColorStop(0.42, "rgba(43,40,48,.09)");
  gradient.addColorStop(1, "rgba(43,40,48,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

function createState(): BookState {
  const canvas = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: true,
    powerPreference: "high-performance",
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xe6e8e5, 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 100);
  const group = new THREE.Group();
  group.rotation.x = -0.145;
  group.rotation.z = -0.009;
  group.position.y = -0.035;
  scene.add(group);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x8b9297, 1.65));
  const key = new THREE.DirectionalLight(0xfffbf2, 2.45);
  key.position.set(-2.8, 4.1, 5.8);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.camera.left = -3.5;
  key.shadow.camera.right = 3.5;
  key.shadow.camera.top = 3.2;
  key.shadow.camera.bottom = -3.2;
  key.shadow.camera.near = 1;
  key.shadow.camera.far = 13;
  key.shadow.radius = 7;
  key.shadow.bias = -0.00035;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xd9e5ee, 0.45);
  fill.position.set(3, 1.4, 3.2);
  scene.add(fill);

  const leftMaterial = pageMaterial();
  const rightMaterial = pageMaterial();
  const leftPage = new THREE.Mesh(createPageGeometry("left"), leftMaterial);
  const rightPage = new THREE.Mesh(createPageGeometry("right"), rightMaterial);
  leftPage.position.z = 0.038;
  rightPage.position.z = 0.037;
  leftPage.receiveShadow = true;
  rightPage.receiveShadow = true;
  group.add(leftPage, rightPage);

  const leftStack = createRoundedBlock(PAGE_WIDTH * 0.985, PAGE_HEIGHT * 0.988, 0.1, 0xeee6d4);
  const rightStack = createRoundedBlock(PAGE_WIDTH * 0.985, PAGE_HEIGHT * 0.988, 0.1, 0xeee6d4);
  leftStack.position.set(-PAGE_WIDTH / 2, 0, -0.035);
  rightStack.position.set(PAGE_WIDTH / 2, 0, -0.035);
  group.add(leftStack, rightStack);

  const flipUniforms: FlipUniforms = { progress: { value: 0 }, backMap: { value: null } };
  const flipMaterial = createFlipMaterial(flipUniforms);
  const flipDepthMaterial = createFlipDepthMaterial(flipUniforms);
  const flipPage = new THREE.Mesh(createPageGeometry("right", 56, 14), flipMaterial);
  flipPage.customDepthMaterial = flipDepthMaterial;
  flipPage.position.z = 0.068;
  flipPage.castShadow = true;
  // The turning leaf casts onto the book but must not shadow itself as it
  // settles coplanar, otherwise its back darkens on the final frame.
  flipPage.receiveShadow = false;
  flipPage.visible = false;
  group.add(flipPage);

  const backCover = createRoundedBlock(PAGE_WIDTH * 2 + 0.13, PAGE_HEIGHT + 0.11, 0.06, 0x41564f);
  backCover.position.z = -0.17;
  group.add(backCover);

  const cover = createRoundedBlock(PAGE_WIDTH + 0.08, PAGE_HEIGHT + 0.1, 0.055, 0x41564f);
  cover.geometry.translate(PAGE_WIDTH / 2, 0, 0);
  cover.position.z = 0.075;
  group.add(cover);

  const contactShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.8, 1.9),
    new THREE.MeshBasicMaterial({
      map: createContactShadowTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0.72,
    }),
  );
  contactShadow.position.set(0, -1.37, -0.7);
  scene.add(contactShadow);

  return {
    backCover,
    camera,
    canvas,
    contactShadow,
    cover,
    flipDepthMaterial,
    flipMaterial,
    flipPage,
    flipUniforms,
    group,
    leftMaterial,
    leftStack,
    renderer,
    rightMaterial,
    rightStack,
    scene,
  };
}

function updatePageStacks(book: BookState, spreadCount: number, spreadIndex: number, flip: number) {
  const sheetsOnLeft = clamp(spreadIndex + flip, 0, spreadCount);
  const sheetsOnRight = clamp(spreadCount - sheetsOnLeft, 0, spreadCount);
  const minDepth = 0.025;
  const perSheet = Math.min(0.013, 0.12 / Math.max(1, spreadCount));
  const leftDepth = minDepth + perSheet * sheetsOnLeft;
  const rightDepth = minDepth + perSheet * sheetsOnRight;
  book.leftStack.scale.z = leftDepth / 0.1;
  book.rightStack.scale.z = rightDepth / 0.1;
  book.leftStack.position.z = -leftDepth / 2 - 0.012;
  book.rightStack.position.z = -rightDepth / 2 - 0.012;
  book.backCover.position.z = -Math.max(leftDepth, rightDepth) - 0.07;
}

export function renderBook3D(
  images: HTMLImageElement[],
  spreadIndex: number,
  width: number,
  height: number,
  progress: number,
  time: number,
  seed = 0,
) {
  if (!state) state = createState();
  const book = state;
  if (book.canvas.width !== width || book.canvas.height !== height) book.renderer.setSize(width, height, false);
  book.camera.aspect = width / height;
  const verticalDistance = PAGE_HEIGHT / (2 * Math.tan(THREE.MathUtils.degToRad(book.camera.fov / 2)));
  const horizontalDistance = (PAGE_WIDTH * 2) / (2 * Math.tan(THREE.MathUtils.degToRad(book.camera.fov / 2)) * book.camera.aspect);
  book.camera.position.set(0, 0.18, Math.max(verticalDistance, horizontalDistance) * 1.4);
  book.camera.lookAt(0, 0, 0);
  book.camera.updateProjectionMatrix();

  const spreadCount = Math.max(1, Math.ceil(images.length / 2));
  const safeSpread = Math.min(spreadCount - 1, spreadIndex);
  const nextSpread = Math.min(spreadCount - 1, safeSpread + 1);
  const flip = safeSpread < spreadCount - 1 ? THREE.MathUtils.smootherstep(progress, 0.58, 0.97) : 0;
  const current = spreadTextures(images, safeSpread, seed);
  const next = spreadTextures(images, nextSpread, seed);

  // Keep the current left page untouched while the leaf turns. The turning
  // leaf remains visible after it has landed and carries next.left all the way
  // to the clip boundary; the following spread then reveals that exact same
  // texture as its static left page. This removes the final-frame texture swap.
  book.leftMaterial.map = current.left;
  book.rightMaterial.map = flip > 0.015 ? next.right : current.right;
  book.leftMaterial.needsUpdate = true;
  book.rightMaterial.needsUpdate = true;

  book.flipPage.visible = safeSpread < spreadCount - 1 && flip > 0.001;
  book.flipUniforms.progress.value = flip;
  book.flipUniforms.backMap.value = next.left;
  if (book.flipMaterial.map !== current.right) {
    book.flipMaterial.map = current.right;
    book.flipDepthMaterial.map = current.right;
    book.flipMaterial.needsUpdate = true;
    book.flipDepthMaterial.needsUpdate = true;
  }

  updatePageStacks(book, spreadCount, safeSpread, flip);
  // The film begins on an already-open journal. A half-cover opening obscured
  // the first composition and made the object read as two unrelated cards.
  book.cover.visible = false;
  const slowDrift = Math.sin(time * 0.28);
  book.group.rotation.y = slowDrift * 0.016;
  book.group.position.y = -0.035 + Math.sin(time * 0.34) * 0.008;
  book.contactShadow.material.opacity = 0.66 + Math.abs(slowDrift) * 0.04;

  book.renderer.render(book.scene, book.camera);
  return book.canvas;
}
