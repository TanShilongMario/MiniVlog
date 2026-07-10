# MiniQuickCut

MiniQuickCut 是一个浏览器本地运行的轻量相册 Vlog 生成器。选择 10–20 张照片、画面比例和模板后，即可预览随机生成的镜头运动，并导出带背景音乐的 MP4。

## 产品特点

- 照片只在当前浏览器会话中处理，不上传服务器
- 支持 16:9、9:16、4:3、3:4 四种比例
- 三套模板：清新漫游、温柔回忆、活力瞬间
- 确定性随机时间线：重新生成会改变运镜，但不改变照片顺序
- Canvas 2D 低成本预览
- WebCodecs + Mediabunny 本地导出 H.264/AAC MP4
- 720p、24fps、约 30 秒，面向普通和低配设备

完整产品定义见 [PRD.md](./PRD.md)，技术设计见 [Architecture.md](./Architecture.md)。

## 本地运行

要求 Node.js 22.13 或更高版本。

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 使用方法

1. 选择或拖入 10–20 张 JPEG、PNG 或 WebP 照片。
2. 删除、替换或拖动照片调整顺序。
3. 选择目标比例和模板。
4. 进入预览；不满意时点击“换一种感觉”。
5. 点击“下载 MP4”，等待本地渲染完成。

## 浏览器支持

推荐最新版 Chrome、Edge 或 Safari。MP4 导出需要浏览器支持 H.264 WebCodecs 编码；应用会在导出时检测能力并给出明确提示。AAC 在缺少浏览器原生编码能力时由 `@mediabunny/aac-encoder` 补齐。

## 素材与许可

内置音乐均由 John Bartmann 创作，并通过 Free Music Archive / Wikimedia Commons 以 CC0 1.0 发布：

- `Interstellar Space` — 清新漫游
- `Tender Moment` — 温柔回忆
- `Happy Clappy` — 活力瞬间

来源页面和许可核验链接记录在 [PRD.md](./PRD.md) 的“素材许可”部分。CC0 不强制署名，但项目仍保留作者和来源信息。

## 已知限制

- 首版不支持 HEIC、视频、文字、自定义音乐和时间线编辑
- 刷新页面会清空当前项目
- 导出期间请保持页面打开
- 不支持 H.264 WebCodecs 编码的浏览器仍可预览，但不能下载 MP4

