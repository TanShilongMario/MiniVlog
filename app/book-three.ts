import * as THREE from "three";

// Matthew Yu's reference works because each leaf is portrait; the open spread
// only becomes wide after the two portrait pages are placed side by side.
const PAGE_WIDTH = 1.55;
const PAGE_HEIGHT = 2.16;
const PAPER = 0xf5efdf;

type TextureMode = "cover" | "contain" | "pan-left" | "pan-right";

type BookState = {
  camera: THREE.PerspectiveCamera;
  canvas: HTMLCanvasElement;
  cover: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  flipMaterial: THREE.ShaderMaterial;
  flipPage: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  group: THREE.Group;
  leftMaterial: THREE.MeshBasicMaterial;
  renderer: THREE.WebGLRenderer;
  rightMaterial: THREE.MeshBasicMaterial;
  scene: THREE.Scene;
};

let state: BookState | null = null;
const textureCache = new WeakMap<HTMLImageElement, Map<TextureMode, THREE.CanvasTexture>>();

function drawImageCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  half: "left" | "right" | null = null,
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
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, width, height);
}

function getTexture(image: HTMLImageElement, mode: TextureMode) {
  let modes = textureCache.get(image);
  if (!modes) {
    modes = new Map();
    textureCache.set(image, modes);
  }
  const cached = modes.get(mode);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = 620;
  canvas.height = 864;
  const context = canvas.getContext("2d")!;
  context.fillStyle = "#f5efdf";
  context.fillRect(0, 0, canvas.width, canvas.height);
  const padding = mode === "contain" ? 38 : 0;
  if (mode === "contain") {
    context.fillStyle = "#fffdf7";
    context.fillRect(22, 22, canvas.width - 44, canvas.height - 44);
    const scale = Math.min((canvas.width - padding * 2) / image.width, (canvas.height - padding * 2) / image.height);
    const drawWidth = image.width * scale;
    const drawHeight = image.height * scale;
    context.drawImage(image, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight);
    context.fillStyle = "rgba(49, 88, 189, 0.72)";
    context.fillRect(38, canvas.height - 35, canvas.width * 0.22, 3);
  } else {
    drawImageCover(context, image, canvas.width, canvas.height, mode === "pan-left" ? "left" : mode === "pan-right" ? "right" : null);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  modes.set(mode, texture);
  return texture;
}

function createPageGeometry(direction: "left" | "right") {
  const geometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 32, 10);
  geometry.translate(direction === "right" ? PAGE_WIDTH / 2 : -PAGE_WIDTH / 2, 0, 0);
  return geometry;
}

function createFlipMaterial() {
  return new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      frontMap: { value: null },
      backMap: { value: null },
      progress: { value: 0 },
    },
    vertexShader: `
      uniform float progress;
      varying vec2 vUv;
      void main() {
        vUv = uv;
        float u = clamp(position.x / ${PAGE_WIDTH.toFixed(2)}, 0.0, 1.0);
        float baseAngle = progress * 3.14159265;
        float angle = baseAngle * (0.82 + u * 0.18);
        vec3 p = position;
        p.x = cos(angle) * position.x;
        p.z = sin(angle) * position.x + sin(u * 3.14159265) * sin(baseAngle) * 0.22;
        p.y += sin(u * 3.14159265) * sin(baseAngle) * 0.055 * (1.0 - abs(uv.y - 0.5) * 1.25);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D frontMap;
      uniform sampler2D backMap;
      varying vec2 vUv;
      void main() {
        vec4 color = gl_FrontFacing ? texture2D(frontMap, vUv) : texture2D(backMap, vec2(1.0 - vUv.x, vUv.y));
        // Keep photographs color-faithful. Depth comes from the curved mesh and
        // the book's cast shadow, never from a dark overlay on the image.
        gl_FragColor = vec4(color.rgb, 1.0);
      }
    `,
  });
}

function createShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d")!;
  const gradient = context.createRadialGradient(256, 64, 4, 256, 64, 245);
  gradient.addColorStop(0, "rgba(30, 35, 46, .34)");
  gradient.addColorStop(1, "rgba(30, 35, 46, 0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  return new THREE.CanvasTexture(canvas);
}

function createState(): BookState {
  const canvas = document.createElement("canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0xdfe3ea, 1);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 16 / 9, 0.1, 100);
  const group = new THREE.Group();
  group.rotation.x = -0.12;
  group.rotation.z = -0.012;
  group.position.y = -0.06;
  scene.add(group);

  scene.add(new THREE.HemisphereLight(0xffffff, 0x778099, 2.15));
  const key = new THREE.DirectionalLight(0xffffff, 2.6);
  key.position.set(-3, 4, 6);
  scene.add(key);

  const leftMaterial = new THREE.MeshBasicMaterial({ color: PAPER, side: THREE.DoubleSide });
  const rightMaterial = leftMaterial.clone();
  const leftPage = new THREE.Mesh(createPageGeometry("left"), leftMaterial);
  const rightPage = new THREE.Mesh(createPageGeometry("right"), rightMaterial);
  leftPage.position.z = 0.025;
  rightPage.position.z = 0.024;
  group.add(leftPage, rightPage);

  for (let layer = 0; layer < 6; layer += 1) {
    const thickness = new THREE.Mesh(
      new THREE.BoxGeometry(PAGE_WIDTH * 2 + 0.08, PAGE_HEIGHT + 0.05, 0.018),
      new THREE.MeshStandardMaterial({ color: layer % 2 ? 0xe9dfc9 : 0xf4ead5, roughness: 1 }),
    );
    thickness.position.set(0, -layer * 0.004, -0.035 - layer * 0.018);
    group.add(thickness);
  }

  const flipMaterial = createFlipMaterial();
  const flipPage = new THREE.Mesh(createPageGeometry("right"), flipMaterial);
  flipPage.position.z = 0.07;
  flipPage.visible = false;
  group.add(flipPage);

  const coverMaterial = new THREE.MeshStandardMaterial({ color: 0x3158bd, roughness: 0.72, metalness: 0, side: THREE.DoubleSide });
  const cover = new THREE.Mesh(createPageGeometry("right"), coverMaterial);
  cover.position.z = 0.09;
  group.add(cover);

  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(4.4, 1.35),
    new THREE.MeshBasicMaterial({ map: createShadowTexture(), transparent: true, depthWrite: false }),
  );
  shadow.position.set(0, -1.48, -0.55);
  scene.add(shadow);

  return { camera, canvas, cover, flipMaterial, flipPage, group, leftMaterial, renderer, rightMaterial, scene };
}

function spreadTextures(images: HTMLImageElement[], spreadIndex: number) {
  const leftImage = images[(spreadIndex * 2) % images.length];
  const rightImage = images[(spreadIndex * 2 + 1) % images.length] ?? leftImage;
  const variant = spreadIndex % 3;
  if (variant === 0) {
    return { left: getTexture(leftImage, "pan-left"), right: getTexture(leftImage, "pan-right") };
  }
  if (variant === 1) {
    return { left: getTexture(leftImage, "contain"), right: getTexture(rightImage, "contain") };
  }
  return { left: getTexture(leftImage, "cover"), right: getTexture(rightImage, "contain") };
}

export function renderBook3D(
  images: HTMLImageElement[],
  spreadIndex: number,
  width: number,
  height: number,
  progress: number,
  time: number,
) {
  if (!state) state = createState();
  const { camera, canvas, cover, flipMaterial, flipPage, group, leftMaterial, renderer, rightMaterial, scene } = state;
  if (canvas.width !== width || canvas.height !== height) renderer.setSize(width, height, false);
  camera.aspect = width / height;
  const verticalDistance = PAGE_HEIGHT / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
  const horizontalDistance = (PAGE_WIDTH * 2) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
  camera.position.set(0, 0.2, Math.max(verticalDistance, horizontalDistance) * 1.38);
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();

  const spreadCount = Math.max(1, Math.ceil(images.length / 2));
  const nextSpread = Math.min(spreadCount - 1, spreadIndex + 1);
  const flip = spreadIndex < spreadCount - 1 ? THREE.MathUtils.smootherstep(progress, 0.68, 1) : 0;
  const current = spreadTextures(images, spreadIndex);
  const next = spreadTextures(images, nextSpread);
  // Do not swap the stationary left page underneath the turning mesh. The two
  // coplanar copies used to darken/flicker like a filter halfway through a turn.
  leftMaterial.map = current.left;
  rightMaterial.map = flip > 0 ? next.right : current.right;
  leftMaterial.needsUpdate = true;
  rightMaterial.needsUpdate = true;

  flipPage.visible = flip > 0.001 && flip < 0.999;
  flipMaterial.uniforms.progress.value = flip;
  flipMaterial.uniforms.frontMap.value = current.right;
  flipMaterial.uniforms.backMap.value = next.left;

  const opening = THREE.MathUtils.smootherstep(time, 0, 1.15);
  cover.visible = opening < 0.999;
  cover.rotation.y = Math.PI * opening;
  group.rotation.y = Math.sin(time * 0.32) * 0.025;
  group.position.y = -0.06 + Math.sin(time * 0.42) * 0.015;

  renderer.render(scene, camera);
  return canvas;
}
