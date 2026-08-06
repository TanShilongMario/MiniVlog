"use client";

import { ChevronDown, Copy, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import type { VlogClipMotion, VlogDebugSnapshot } from "./vlog-core";

type DebugPanelProps = {
  snapshot: VlogDebugSnapshot | null;
  ready: boolean;
  seed: number;
  onSeedChange: (seed: number) => void;
  onRegenerate: () => void;
};

function DebugRow({ label, value }: { label: string; value: string | number | null | undefined }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="debug-row">
      <span>{label}</span>
      <code>{value}</code>
    </div>
  );
}

function DebugSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="debug-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function ClipCard({ clip, label }: { clip: VlogClipMotion; label: string }) {
  const [open, setOpen] = useState(false);

  return (
    <article className={`debug-clip-card${open ? " is-open" : ""}`}>
      <button className="debug-clip-head" type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open}>
        <div className="debug-clip-title">
          <strong>{label}</strong>
          <span>{clip.timeRange}</span>
        </div>
        <p>{clip.summary}</p>
        <ChevronDown size={15} />
      </button>

      <div className="debug-clip-grid">
        <div><span>原图</span><code>#{clip.sourceIndex + 1}</code></div>
        <div><span>模式</span><code>{clip.mode}</code></div>
        <div className="debug-clip-span"><span>位置变化</span><code>{clip.position}</code></div>
        <div><span>缩放</span><code>{clip.zoom}</code></div>
        <div><span>入场</span><code>{clip.enter}</code></div>
        <div><span>退场</span><code>{clip.exit}</code></div>
      </div>

      {open && (
        <div className="debug-clip-extra">
          <div className="debug-tag-list">
            {clip.details.map((item) => (
              <span className="debug-tag" key={`${clip.clipIndex}-${item.key}`}>{item.key}: {item.value}</span>
            ))}
          </div>
          <div className="debug-tune">
            <span>调参入口</span>
            <code>{clip.tune.join(" · ")}</code>
          </div>
        </div>
      )}
    </article>
  );
}

export function DebugPanel({ snapshot, ready, seed, onSeedChange, onRegenerate }: DebugPanelProps) {
  const [draftSeed, setDraftSeed] = useState(String(seed));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setDraftSeed(String(seed));
  }, [seed]);

  async function copySeed() {
    if (!snapshot) return;
    await navigator.clipboard.writeText(String(snapshot.seed));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function applySeed() {
    const next = Number(draftSeed.trim());
    if (!Number.isFinite(next)) return;
    onSeedChange(Math.floor(next));
  }

  const clipLabel = snapshot?.layout === "beat" ? "拍点" : "镜头";

  return (
    <aside className="debug-panel" aria-label="参数控制台">
      <div className="debug-panel-head">
        <strong>参数控制台</strong>
        <span>{ready && snapshot ? `${snapshot.clips.length} 段` : "加载中"}</span>
      </div>

      <div className="debug-seed-bar">
        <label className="debug-seed-field">
          <span>seed</span>
          <input
            type="text"
            inputMode="numeric"
            value={draftSeed}
            onChange={(event) => setDraftSeed(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && applySeed()}
          />
        </label>
        <button className="debug-icon-button" type="button" onClick={applySeed} aria-label="应用 seed">应用</button>
        <button className="debug-icon-button" type="button" onClick={onRegenerate} aria-label="随机 seed"><RefreshCw size={13} /></button>
        <button className="debug-icon-button" type="button" onClick={copySeed} disabled={!snapshot} aria-label="复制 seed">{copied ? "OK" : <Copy size={13} />}</button>
      </div>

      <div className="debug-panel-body">
        {!ready || !snapshot ? (
          <p className="debug-empty">照片加载完成后显示随机参数。</p>
        ) : (
          <>
            <DebugSection title="全局">
              <DebugRow label="seed" value={snapshot.seed} />
              <DebugRow label="模板" value={`${snapshot.templateTitle} (${snapshot.templateId})`} />
              <DebugRow label="布局" value={snapshot.layout} />
              <DebugRow label="画幅" value={`${snapshot.ratio} · ${snapshot.exportSize}`} />
              <DebugRow label="音乐" value={`#${snapshot.musicIndex + 1} ${snapshot.musicTitle}`} />
              <DebugRow label="BPM" value={snapshot.bpm ?? "—"} />
              <DebugRow label="首拍偏移" value={snapshot.beatOffset != null ? `${snapshot.beatOffset}s` : "—"} />
              <DebugRow label="运镜起始" value={snapshot.motionOffset} />
              <DebugRow label="转场" value={`${snapshot.transition}s`} />
            </DebugSection>

            <DebugSection title="选片">
              <DebugRow label="使用 / 上传" value={`${snapshot.sequence.selectedIndices.length} / ${snapshot.sequence.selectedIndices.length + snapshot.sequence.omittedIndices.length}`} />
              <DebugRow label="phase" value={snapshot.sequence.phase} />
              <DebugRow label="rotateBy" value={snapshot.sequence.rotateBy} />
              <DebugRow label="选中序号" value={snapshot.sequence.selectedIndices.map((index) => index + 1).join(", ")} />
              {snapshot.sequence.omittedIndices.length > 0 && (
                <DebugRow label="剔除近重复" value={snapshot.sequence.omittedIndices.map((index) => index + 1).join(", ")} />
              )}
            </DebugSection>

            {snapshot.spark && (
              <DebugSection title="活力瞬间">
                <DebugRow label="总拍数" value={snapshot.spark.totalBeats} />
                <DebugRow label="拍长" value={snapshot.spark.beatDuration} />
                <DebugRow label="背景色" value={snapshot.spark.background} />
                <DebugRow label="字幕角落" value={snapshot.spark.cornerOrder} />
              </DebugSection>
            )}

            <DebugSection title="模板调参入口">
              <div className="debug-tune-list">
                {snapshot.templateTune.map((item) => (
                  <code className="debug-tune-chip" key={item}>{item}</code>
                ))}
              </div>
            </DebugSection>

            <DebugSection title={`${clipLabel} · ${snapshot.clips.length} 段`}>
              <div className="debug-clip-list">
                {snapshot.clips.map((clip) => (
                  <ClipCard clip={clip} key={`clip-${clip.clipIndex}-${clip.sourceIndex}`} label={`${clipLabel} ${clip.clipIndex + 1}`} />
                ))}
              </div>
            </DebugSection>
          </>
        )}
      </div>
    </aside>
  );
}
