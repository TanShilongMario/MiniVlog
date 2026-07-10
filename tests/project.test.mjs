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

test("all three CC0 music assets are present and non-empty", async () => {
  const tracks = ["interstellar-space.mp3", "tender-moment.mp3", "happy-clappy.mp3"];
  for (const track of tracks) {
    const info = await stat(new URL(`../public/music/${track}`, import.meta.url));
    assert.ok(info.size > 100_000, `${track} should contain audio data`);
  }
});

