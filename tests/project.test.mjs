import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import test from "node:test";

test("product documentation and core application files exist", async () => {
  const files = ["README.md", "PRD.md", "Architecture.md", "app/MiniQuickCutApp.tsx", "app/vlog-core.ts", "app/export-video.ts"];
  await Promise.all(files.map((file) => access(new URL(`../${file}`, import.meta.url))));
});

test("starter preview metadata and UI have been removed", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(page, /SkeletonPreview|codex-preview/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(page, /MiniQuickCutApp/);
});

test("all local music assets are present and non-empty", async () => {
  const tracks = [
    "african-moon.mp3",
    "another-grappa.mp3",
    "bouncy-gypsy-beats.mp3",
    "bubbles.mp3",
    "happy-clappy.mp3",
    "home-at-last.mp3",
    "interstellar-space.mp3",
    "calm-currents.mp3",
    "nova-serenade.mp3",
    "somewhere-nice.mp3",
    "tender-moment.mp3",
  ];
  for (const track of tracks) {
    const info = await stat(new URL(`../public/music/${track}`, import.meta.url));
    assert.ok(info.size > 100_000, `${track} should contain audio data`);
  }
});

test("wander carries incoming motion through the cross-dissolve", async () => {
  const renderer = await readFile(new URL("../app/vlog-core.ts", import.meta.url), "utf8");
  assert.match(renderer, /const transitionLead = transitionDuration \/ clipDuration/);
  assert.match(renderer, /transitionProgress \* transitionLead/);
  assert.match(renderer, /template\.id === "wander" \? clamp\(progress, 0, 1\) : smootherstep\(progress\)/);
});

test("five templates use distinct layouts and the spark music is beat-synced", async () => {
  const renderer = await readFile(new URL("../app/vlog-core.ts", import.meta.url), "utf8");
  assert.match(renderer, /layout: "cinematic"/);
  assert.match(renderer, /layout: "album"/);
  assert.match(renderer, /layout: "beat"/);
  assert.match(renderer, /layout: "book"/);
  assert.match(renderer, /layout: "minimal"/);
  assert.match(renderer, /bpm: 92/);
  assert.match(renderer, /bpm: 92\.29/);
  assert.match(renderer, /beatOffset: 0\.28/);
  assert.match(renderer, /beat % 4 === 0/);
  assert.match(renderer, /function getBeatAlignedClipTiming/);
  assert.match(renderer, /const music = getMusicTrack\(template, seed\)/);
});

test("the cinematic template cycles mixed motion and image sequencing avoids near duplicates", async () => {
  const renderer = await readFile(new URL("../app/vlog-core.ts", import.meta.url), "utf8");
  assert.match(renderer, /motions: \["zoom-in", "pan-left", "zoom-out", "pan-up", "pan-right", "pan-down"\]/);
  assert.match(renderer, /prepareImageSequence/);
  assert.match(renderer, /nearest < 0\.105/);
  assert.match(renderer, /currentScore >= 0\.18/);
  assert.match(renderer, /Math\.floor\(VLOG_DURATION \/ template\.minShotDuration\)/);
});

test("travel book turns beat-aligned pages and template typography is shared by preview and export", async () => {
  const renderer = await readFile(new URL("../app/vlog-core.ts", import.meta.url), "utf8");
  const bookRenderer = await readFile(new URL("../app/book-three.ts", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/MiniQuickCutApp.tsx", import.meta.url), "utf8");
  const exporter = await readFile(new URL("../app/export-video.ts", import.meta.url), "utf8");
  assert.match(renderer, /title: "翻页手记"/);
  assert.match(renderer, /renderBook3D\(images, spreadIndex, width, height, progress, time\)/);
  assert.match(renderer, /const spreadCount = Math\.max\(1, Math\.ceil\(images\.length \/ 2\)\)/);
  assert.match(bookRenderer, /import \* as THREE from "three"/);
  assert.match(bookRenderer, /new THREE\.PerspectiveCamera/);
  assert.match(bookRenderer, /const PAGE_WIDTH = 1\.55/);
  assert.match(bookRenderer, /const PAGE_HEIGHT = 2\.16/);
  assert.match(bookRenderer, /new THREE\.PlaneGeometry\(PAGE_WIDTH, PAGE_HEIGHT, 32, 10\)/);
  assert.match(bookRenderer, /new THREE\.MeshBasicMaterial\(\{ color: PAPER/);
  assert.doesNotMatch(bookRenderer, /color\.rgb \* vShade/);
  assert.match(bookRenderer, /float angle = baseAngle \* \(0\.82 \+ u \* 0\.18\)/);
  assert.match(bookRenderer, /gl_FrontFacing \? texture2D\(frontMap/);
  assert.match(bookRenderer, /preserveDrawingBuffer: true/);
  assert.match(renderer, /function drawTemplateTypography/);
  assert.match(renderer, /textPreset: \{ title: "那年今日"/);
  assert.match(renderer, /textPreset: \{ title: "快乐发生中"/);
  assert.match(page, /封面标题/);
  assert.match(page, /中段短句/);
  assert.match(page, /结尾落款/);
  assert.match(page, /renderFrame\(context, canvas\.width, canvas\.height, imagesRef\.current, template, seed, timestamp, textContent\)/);
  assert.match(exporter, /renderFrame\(context, size\.width, size\.height, images, template, seed, timestamp, textContent\)/);
});

test("frontend motion uses responsive tokens, compositor properties, and accessible controls", async () => {
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  const page = await readFile(new URL("../app/MiniQuickCutApp.tsx", import.meta.url), "utf8");
  assert.match(css, /--ease-out: cubic-bezier\(0\.23, 1, 0\.32, 1\)/);
  assert.match(css, /button:active:not\(:disabled\) \{ transform: scale\(\.97\)/);
  assert.match(css, /@media \(hover: hover\) and \(pointer: fine\)/);
  assert.match(css, /@media \(prefers-reduced-transparency: reduce\)/);
  assert.match(css, /@media \(prefers-contrast: more\)/);
  assert.match(css, /@keyframes equalize \{ to \{ transform: scaleY\(1\)/);
  assert.doesNotMatch(css, /@keyframes equalize[\s\S]{0,80}height:/);
  assert.match(page, /将 \$\{photo\.name\} 向前移动/);
  assert.match(page, /aria-pressed=\{templateId === template\.id\}/);
  assert.match(css, /\.big-play:active:not\(:disabled\) \{ transform: translate\(-50%,-50%\) scale\(\.94\); \}/);
});

test("wander uses a long eased cross-dissolve between photos", async () => {
  const renderer = await readFile(new URL("../app/vlog-core.ts", import.meta.url), "utf8");
  assert.match(renderer, /id: "wander"[\s\S]*?transition: 1\.45/);
  assert.match(renderer, /id: "wander"[\s\S]*?zoomMin: 1\.06,[\s\S]*?zoomMax: 1\.095,[\s\S]*?panStrength: 0\.28/);
  assert.match(renderer, /const mix = smootherstep/);
  assert.match(renderer, /incoming camera has already accumulated/);
  assert.match(renderer, /drawCover\(context, images\[index \+ 1\], width, height, incomingProgress, template, seed, index \+ 1, mix\)/);
  assert.match(renderer, /title: "Bubbles"[\s\S]*?bpm: 65\.05, beatOffset: 0\.03/);
  assert.match(renderer, /subtitle2: "风吹过的地方/);
  assert.match(renderer, /subtitle3: "慢慢走/);
});

test("the center play affordance disappears while the preview is playing", async () => {
  const page = await readFile(new URL("../app/MiniQuickCutApp.tsx", import.meta.url), "utf8");
  assert.match(page, /\{!playing && \([\s\S]*?className="big-play"/);
  assert.doesNotMatch(page, /className="big-play"[\s\S]{0,180}playing \? <Pause/);
});
