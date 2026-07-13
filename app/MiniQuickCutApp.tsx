"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  Download,
  GripVertical,
  ImagePlus,
  LoaderCircle,
  Music2,
  Type,
  Pause,
  Play,
  RefreshCw,
  Replace,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { type ChangeEvent, type DragEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  RATIOS,
  TEMPLATES,
  VLOG_DURATION,
  getTemplate,
  getMusicTrack,
  loadImages,
  prepareImageSequence,
  previewDimensions,
  renderFrame,
  type PhotoItem,
  type RatioId,
  type TemplateId,
  type VlogTextContent,
} from "./vlog-core";

type Step = "photos" | "style" | "preview";
const STEPS: { id: Step; index: string; label: string }[] = [
  { id: "photos", index: "01", label: "选择照片" },
  { id: "style", index: "02", label: "挑选风格" },
  { id: "preview", index: "03", label: "预览成片" },
];

function makeId() {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isAcceptedImage(file: File) {
  return ["image/jpeg", "image/png", "image/webp"].includes(file.type) || /\.(jpe?g|png|webp)$/i.test(file.name);
}

export function MiniQuickCutApp() {
  const [step, setStep] = useState<Step>("photos");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [ratio, setRatio] = useState<RatioId>("16:9");
  const [templateId, setTemplateId] = useState<TemplateId>("wander");
  const [seed, setSeed] = useState(() => Date.now());
  const [textContent, setTextContent] = useState<VlogTextContent>(() => getTemplate("wander").textPreset);
  const [notice, setNotice] = useState("");
  const addInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replaceTargetRef = useRef<string | null>(null);
  const draggedIdRef = useRef<string | null>(null);
  const livePhotosRef = useRef<PhotoItem[]>([]);
  const template = getTemplate(templateId);

  useEffect(() => {
    livePhotosRef.current = photos;
  }, [photos]);

  useEffect(
    () => () => {
      livePhotosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url));
    },
    [],
  );

  function addFiles(files: File[]) {
    const accepted = files.filter(isAcceptedImage);
    const available = Math.max(0, 20 - photos.length);
    const selected = accepted.slice(0, available);
    if (!selected.length) {
      setNotice(available === 0 ? "已经选满 20 张照片。" : "请选择 JPEG、PNG 或 WebP 照片。");
      return;
    }
    const next = selected.map((file) => ({ id: makeId(), file, name: file.name, url: URL.createObjectURL(file) }));
    setPhotos((current) => [...current, ...next]);
    const ignored = files.length - selected.length;
    setNotice(ignored > 0 ? `已加入 ${selected.length} 张，另有 ${ignored} 张因格式或数量限制未加入。` : "");
  }

  function handleAddInput(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []));
    event.target.value = "";
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return current.filter((photo) => photo.id !== id);
    });
  }

  function openReplace(id: string) {
    replaceTargetRef.current = id;
    replaceInputRef.current?.click();
  }

  function replacePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    const targetId = replaceTargetRef.current;
    event.target.value = "";
    if (!file || !targetId || !isAcceptedImage(file)) {
      if (file) setNotice("替换照片需要 JPEG、PNG 或 WebP 格式。");
      return;
    }
    setPhotos((current) =>
      current.map((photo) => {
        if (photo.id !== targetId) return photo;
        URL.revokeObjectURL(photo.url);
        return { id: photo.id, file, name: file.name, url: URL.createObjectURL(file) };
      }),
    );
  }

  function reorderOver(targetId: string) {
    const sourceId = draggedIdRef.current;
    if (!sourceId || sourceId === targetId) return;
    setPhotos((current) => {
      const sourceIndex = current.findIndex((photo) => photo.id === sourceId);
      const targetIndex = current.findIndex((photo) => photo.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const next = [...current];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  }

  function movePhoto(id: string, direction: -1 | 1) {
    setPhotos((current) => {
      const index = current.findIndex((photo) => photo.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function goTo(next: Step) {
    if (next !== "photos" && photos.length < 10) {
      setNotice("至少选择 10 张照片，才能开始成片。");
      setStep("photos");
      return;
    }
    setNotice("");
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => goTo("photos")} aria-label="返回照片页">
          <span className="brand-mark"><Sparkles size={15} strokeWidth={2.4} /></span>
          <span>MiniQuickCut</span>
        </button>
        <nav className="stepper" aria-label="制作步骤">
          {STEPS.map((item) => {
            const activeIndex = STEPS.findIndex((candidate) => candidate.id === step);
            const itemIndex = STEPS.findIndex((candidate) => candidate.id === item.id);
            return (
              <button
                className={`step-chip${item.id === step ? " is-active" : ""}${itemIndex < activeIndex ? " is-done" : ""}`}
                key={item.id}
                type="button"
                onClick={() => itemIndex <= activeIndex && goTo(item.id)}
                disabled={itemIndex > activeIndex}
              >
                <span>{itemIndex < activeIndex ? <Check size={12} strokeWidth={3} /> : item.index}</span>
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="privacy-pill"><ShieldCheck size={14} /> 照片仅在本机处理</div>
      </header>

      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice("")} aria-label="关闭提示"><X size={15} /></button>
        </div>
      )}

      {step === "photos" && (
        <PhotoStep
          photos={photos}
          addInputRef={addInputRef}
          replaceInputRef={replaceInputRef}
          draggedIdRef={draggedIdRef}
          onAddInput={handleAddInput}
          onDropFiles={addFiles}
          onOpenReplace={openReplace}
          onMove={movePhoto}
          onRemove={removePhoto}
          onReorderOver={reorderOver}
          onReplaceInput={replacePhoto}
          onContinue={() => goTo("style")}
        />
      )}

      {step === "style" && (
        <StyleStep
          photos={photos}
          ratio={ratio}
          templateId={templateId}
          onBack={() => goTo("photos")}
          onRatio={setRatio}
          onTemplate={(id) => {
            setTemplateId(id);
            setTextContent({ ...getTemplate(id).textPreset });
          }}
          onGenerate={() => {
            setSeed(Date.now());
            goTo("preview");
          }}
        />
      )}

      {step === "preview" && (
        <PreviewStep
          photos={photos}
          ratio={ratio}
          seed={seed}
          template={template}
          textContent={textContent}
          onTextContent={setTextContent}
          onBack={() => goTo("style")}
          onEditPhotos={() => goTo("photos")}
          onRegenerate={() => setSeed(Date.now() + Math.floor(Math.random() * 100_000))}
        />
      )}
    </main>
  );
}

type PhotoStepProps = {
  photos: PhotoItem[];
  addInputRef: React.RefObject<HTMLInputElement | null>;
  replaceInputRef: React.RefObject<HTMLInputElement | null>;
  draggedIdRef: React.MutableRefObject<string | null>;
  onAddInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onDropFiles: (files: File[]) => void;
  onOpenReplace: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onRemove: (id: string) => void;
  onReorderOver: (id: string) => void;
  onReplaceInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onContinue: () => void;
};

function PhotoStep(props: PhotoStepProps) {
  const [draggingFiles, setDraggingFiles] = useState(false);
  const remaining = Math.max(0, 10 - props.photos.length);

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setDraggingFiles(false);
    if (event.dataTransfer.files.length) props.onDropFiles(Array.from(event.dataTransfer.files));
  }

  return (
    <section className="page-stage photos-stage" onDragOver={(event) => { event.preventDefault(); setDraggingFiles(true); }} onDragLeave={() => setDraggingFiles(false)} onDrop={handleDrop}>
      <div className="page-heading">
        <div>
          <p className="eyebrow">STEP 01 · YOUR MOMENTS</p>
          <h1>先把喜欢的瞬间放进来。</h1>
          <p>选择 10–20 张照片。我们会保留顺序，用轻微运镜把它们连成一段自然的 Vlog。</p>
        </div>
        <div className="count-orbit" aria-label={`已选择 ${props.photos.length} 张`}>
          <strong>{String(props.photos.length).padStart(2, "0")}</strong>
          <span>/ 20</span>
        </div>
      </div>

      <div className={`photo-workspace${draggingFiles ? " is-file-drag" : ""}`}>
        {props.photos.length === 0 ? (
          <button className="empty-dropzone" type="button" onClick={() => props.addInputRef.current?.click()}>
            <span className="upload-orb"><Upload size={24} /></span>
            <strong>选择照片，或拖到这里</strong>
            <span>JPEG · PNG · WebP · 最多 20 张</span>
          </button>
        ) : (
          <div className="photo-grid" aria-label="已选照片">
            {props.photos.map((photo, index) => (
              <article
                className="photo-card"
                draggable
                key={photo.id}
                onDragStart={() => { props.draggedIdRef.current = photo.id; }}
                onDragEnd={() => { props.draggedIdRef.current = null; }}
                onDragOver={(event) => { event.preventDefault(); event.stopPropagation(); props.onReorderOver(photo.id); }}
              >
                {/* User-selected local media is intentionally rendered directly. */}
                <img src={photo.url} alt={`第 ${index + 1} 张：${photo.name}`} />
                <span className="photo-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="drag-handle" aria-hidden="true"><GripVertical size={15} /></span>
                <div className="photo-actions">
                  <button type="button" disabled={index === 0} onClick={() => props.onMove(photo.id, -1)} aria-label={`将 ${photo.name} 向前移动`}><ArrowLeft size={14} /></button>
                  <button type="button" disabled={index === props.photos.length - 1} onClick={() => props.onMove(photo.id, 1)} aria-label={`将 ${photo.name} 向后移动`}><ArrowRight size={14} /></button>
                  <button type="button" onClick={() => props.onOpenReplace(photo.id)} aria-label={`替换 ${photo.name}`}><Replace size={15} /></button>
                  <button type="button" onClick={() => props.onRemove(photo.id)} aria-label={`删除 ${photo.name}`}><Trash2 size={15} /></button>
                </div>
              </article>
            ))}
            {props.photos.length < 20 && (
              <button className="add-photo-card" type="button" onClick={() => props.addInputRef.current?.click()}>
                <ImagePlus size={22} />
                <span>继续添加</span>
              </button>
            )}
          </div>
        )}
      </div>

      <input ref={props.addInputRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={props.onAddInput} />
      <input ref={props.replaceInputRef} className="visually-hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={props.onReplaceInput} />

      <footer className="stage-footer">
        <div className="quiet-note"><ShieldCheck size={16} /> 原图不会离开你的浏览器</div>
        <button className="primary-button" type="button" disabled={props.photos.length < 10} onClick={props.onContinue}>
          {remaining > 0 ? `还需 ${remaining} 张` : "选择画幅与风格"}
          <ArrowRight size={17} />
        </button>
      </footer>
    </section>
  );
}

type StyleStepProps = {
  photos: PhotoItem[];
  ratio: RatioId;
  templateId: TemplateId;
  onBack: () => void;
  onRatio: (ratio: RatioId) => void;
  onTemplate: (template: TemplateId) => void;
  onGenerate: () => void;
};

function StyleStep({ photos, ratio, templateId, onBack, onRatio, onTemplate, onGenerate }: StyleStepProps) {
  return (
    <section className="page-stage style-stage">
      <div className="page-heading compact-heading">
        <div>
          <p className="eyebrow">STEP 02 · SET THE MOOD</p>
          <h1>选一个画幅，再选一种感觉。</h1>
          <p>每套风格都绑定了合适的音乐、节奏和一组克制的随机运镜。</p>
        </div>
      </div>

      <div className="style-layout">
        <aside className="ratio-panel">
          <div className="panel-label">画面比例</div>
          <div className="ratio-list">
            {(Object.entries(RATIOS) as [RatioId, (typeof RATIOS)[RatioId]][]).map(([id, item]) => (
              <button className={`ratio-option${ratio === id ? " is-selected" : ""}`} type="button" key={id} onClick={() => onRatio(id)}>
                <span className={`ratio-shape ratio-${id.replace(":", "-")}`} />
                <span><strong>{item.label}</strong><small>{item.note}</small></span>
                {ratio === id && <Check className="ratio-check" size={15} />}
              </button>
            ))}
          </div>
          <div className="ratio-output">
            <span>导出规格</span>
            <strong>{RATIOS[ratio].width} × {RATIOS[ratio].height}</strong>
            <small>720p · 24 FPS · MP4</small>
          </div>
        </aside>

        <div className="template-grid">
          {TEMPLATES.map((template, templateIndex) => (
            <button
              className={`template-card${templateId === template.id ? " is-selected" : ""}`}
              aria-pressed={templateId === template.id}
              key={template.id}
              type="button"
              onClick={() => onTemplate(template.id)}
            >
              <div className={`template-visual template-${template.id}`} style={{ "--tone-1": template.colors[0], "--tone-2": template.colors[1], "--tone-3": template.colors[2] } as React.CSSProperties}>
                {photos.slice(templateIndex, templateIndex + 3).map((photo, index) => (
                  <img key={photo.id} src={photo.url} alt="" style={{ "--stack-index": index } as React.CSSProperties} />
                ))}
                <span>{template.eyebrow}</span>
              </div>
              <div className="template-copy">
                <span className="template-number">0{templateIndex + 1}</span>
                <div><strong>{template.title}</strong><p>{template.description}</p></div>
              </div>
              <div className="music-line">
                <Music2 size={14} />
                <span>{template.music.length} 首匹配音乐</span>
                <small>{template.music.some((track) => track.bpm) ? `${Math.min(...template.music.map((track) => track.bpm ?? 999))}–${Math.max(...template.music.map((track) => track.bpm ?? 0))} BPM` : "CC0"}</small>
              </div>
              <span className="template-select-mark">{templateId === template.id ? <><Check size={13} /><span>已选择</span></> : null}</span>
            </button>
          ))}
        </div>
      </div>

      <footer className="stage-footer">
        <button className="ghost-button" type="button" onClick={onBack}><ArrowLeft size={17} /> 返回照片</button>
        <button className="primary-button" type="button" onClick={onGenerate}><Sparkles size={17} /> 一键生成</button>
      </footer>
    </section>
  );
}

type PreviewStepProps = {
  photos: PhotoItem[];
  ratio: RatioId;
  seed: number;
  template: ReturnType<typeof getTemplate>;
  textContent: VlogTextContent;
  onTextContent: (content: VlogTextContent) => void;
  onBack: () => void;
  onEditPhotos: () => void;
  onRegenerate: () => void;
};

function PreviewStep({ photos, ratio, seed, template, textContent, onTextContent, onBack, onEditPhotos, onRegenerate }: PreviewStepProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sourceImagesRef = useRef<HTMLImageElement[]>([]);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const rafRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [ready, setReady] = useState(false);
  const [usedPhotoCount, setUsedPhotoCount] = useState(photos.length);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportError, setExportError] = useState("");
  const dimensions = useMemo(() => previewDimensions(ratio), [ratio]);
  const musicTrack = useMemo(() => getMusicTrack(template, seed), [template, seed]);

  function draw(timestamp: number) {
    const canvas = canvasRef.current;
    if (!canvas || !imagesRef.current.length) return;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) return;
    renderFrame(context, canvas.width, canvas.height, imagesRef.current, template, seed, timestamp, textContent);
  }

  useEffect(() => {
    let canceled = false;
    setReady(false);
    loadImages(photos).then((images) => {
      if (canceled) return;
      sourceImagesRef.current = images;
      const prepared = prepareImageSequence(images, template, seed);
      imagesRef.current = prepared.images;
      setUsedPhotoCount(prepared.usedCount);
      setReady(true);
      draw(0);
    }).catch(() => setExportError("部分照片读取失败，请返回替换后重试。"));
    return () => { canceled = true; };
    // The photo URLs are stable for the lifetime of this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  useEffect(() => {
    if (sourceImagesRef.current.length) {
      const prepared = prepareImageSequence(sourceImagesRef.current, template, seed);
      imagesRef.current = prepared.images;
      setUsedPhotoCount(prepared.usedCount);
    }
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlaying(false);
    setTime(0);
    draw(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, template.id, ratio, dimensions.width, dimensions.height]);

  useEffect(() => {
    draw(time);
    // Redraw the current frame while typing without restarting playback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textContent]);

  useEffect(() => {
    if (!playing) return;
    const tick = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.currentTime >= VLOG_DURATION) {
        audio.pause();
        audio.currentTime = 0;
        setTime(0);
        setPlaying(false);
        draw(0);
        return;
      }
      setTime(audio.currentTime);
      draw(audio.currentTime);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, seed, template.id]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio || !ready) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      if (audio.currentTime >= VLOG_DURATION - 0.05) audio.currentTime = 0;
      await audio.play();
      setPlaying(true);
    }
  }

  function seek(nextTime: number) {
    const audio = audioRef.current;
    if (audio) audio.currentTime = nextTime;
    setTime(nextTime);
    draw(nextTime);
  }

  async function handleExport() {
    setExporting(true);
    setExportError("");
    setExportProgress(0);
    if (audioRef.current) audioRef.current.pause();
    setPlaying(false);
    try {
      const { downloadBlob, exportVlog } = await import("./export-video");
      const blob = await exportVlog({ photos, ratio, template, seed, textContent, onProgress: setExportProgress });
      const date = new Date().toISOString().slice(0, 10);
      downloadBlob(blob, `MiniQuickCut-${template.id}-${date}.mp4`);
    } catch (error) {
      setExportError(error instanceof Error ? error.message : "导出失败，请稍后重试。");
    } finally {
      setExporting(false);
    }
  }

  return (
    <section className="page-stage preview-stage">
      <div className="preview-layout">
        <div className="player-column">
          <div className="player-heading">
            <div><p className="eyebrow">STEP 03 · YOUR VLOG</p><h1>这一版，感觉怎么样？</h1></div>
            <button className="ghost-button compact" type="button" onClick={onRegenerate} disabled={exporting}><RefreshCw size={15} /> 换一种感觉</button>
          </div>
          <div className={`canvas-shell ratio-${ratio.replace(":", "-")}`}>
            {!ready && <div className="canvas-loading"><LoaderCircle className="spin" size={24} /> 正在准备照片</div>}
            <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} aria-label="相册 Vlog 预览" />
            {!playing && (
              <button className="big-play" type="button" onClick={togglePlayback} aria-label="播放">
                <Play size={22} fill="currentColor" />
              </button>
            )}
          </div>
          <audio ref={audioRef} src={musicTrack.src} preload="auto" />
          <div className="transport">
            <button type="button" onClick={togglePlayback} aria-label={playing ? "暂停" : "播放"}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
            <span>{formatTime(time)}</span>
            <input type="range" min={0} max={VLOG_DURATION} step={0.01} value={time} onChange={(event) => seek(Number(event.target.value))} aria-label="预览进度" />
            <span>{formatTime(VLOG_DURATION)}</span>
          </div>
        </div>

        <aside className="result-panel">
          <div>
            <p className="panel-label">本次成片</p>
            <h2>{template.title}</h2>
            <p>{template.description}</p>
          </div>
          <dl className="result-facts" aria-label="成片规格">
            <div><dt>照片</dt><dd>{usedPhotoCount} / {photos.length} 张</dd></div>
            <div><dt>画幅</dt><dd>{ratio}</dd></div>
            <div><dt>时长</dt><dd>00:30</dd></div>
            <div><dt>规格</dt><dd>720p · 24fps</dd></div>
          </dl>
          <div className="music-card">
            <span className="music-icon"><Music2 size={18} /></span>
            <span><small>背景音乐 · CC0{musicTrack.bpm ? ` · ${musicTrack.bpm} BPM` : ""}</small><strong>{musicTrack.title}</strong></span>
            <span className="equalizer"><i /><i /><i /></span>
          </div>
          <div className="title-card">
            <span className="title-icon"><Type size={17} /></span>
            <div className="title-fields">
              <small>调整片中文字</small>
              {([
                ["title", "封面标题", 24],
                ["subtitle", template.id === "wander" ? "中段短句 1" : "中段短句", 42],
                ...(template.id === "wander" ? [
                  ["subtitle2", "中段短句 2", 42],
                  ["subtitle3", "中段短句 3", 42],
                ] as const : []),
                ["closing", "结尾落款", 42],
              ] as ReadonlyArray<readonly [keyof VlogTextContent, string, number]>).map(([field, label, limit]) => (
                <label className="title-field" key={field}>
                  <span>{label}</span>
                  <input
                    type="text"
                    value={textContent[field] ?? ""}
                    maxLength={limit}
                    placeholder={template.textPreset[field] ?? ""}
                    onChange={(event) => onTextContent({ ...textContent, [field]: event.target.value })}
                    aria-label={label}
                  />
                </label>
              ))}
            </div>
          </div>
          {exporting && (
            <div className="export-progress" role="status">
              <div><span>正在本地生成 MP4</span><strong>{Math.round(exportProgress * 100)}%</strong></div>
              <progress value={exportProgress} max={1} />
              <small>请保持页面打开，照片不会上传。</small>
            </div>
          )}
          {exportError && <div className="export-error" role="alert">{exportError}</div>}
          <button className="download-button" type="button" disabled={exporting || !ready} onClick={handleExport}>
            {exporting ? <LoaderCircle className="spin" size={18} /> : <Download size={18} />}
            {exporting ? "正在生成" : "下载 MP4"}
          </button>
          <p className="download-note"><ShieldCheck size={14} /> 全程在浏览器本地完成</p>
          <div className="panel-links">
            <button type="button" onClick={onBack}><ArrowLeft size={14} /> 更换风格</button>
            <button type="button" onClick={onEditPhotos}>调整照片</button>
          </div>
        </aside>
      </div>
    </section>
  );
}

function formatTime(value: number) {
  const seconds = Math.max(0, Math.floor(value));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}
