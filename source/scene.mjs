/* Original EWS sculpture. Build instructions and licenses are in README.md. */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

(() => {
  const canvas = document.getElementById("sculpture");
  const container = canvas?.parentElement;
  if (!container) return;
  const options = {
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  };
  let context;
  try {
    context = canvas.getContext("webgl2", options);
  } catch {
    return;
  }
  if (!context) return; // The local artwork is already visible underneath.
  let renderer;
  let environment;
  let generator;
  let environmentScene;
  let geometry;
  let material;
  let animation = 0;
  let visible = true;
  let failed = false;
  let lastFrame = 0;
  let time = 0;
  const state = () =>
    window.EWSSceneState || {
      progress: 0,
      pointerX: 0,
      pointerY: 0,
      reduced: true,
    };
  try {
    renderer = new THREE.WebGLRenderer({ canvas, context, ...options });
    renderer.setClearColor(0x080a0f, 0);
    renderer.setPixelRatio(
      Math.min(devicePixelRatio, innerWidth < 700 ? 1.15 : 1.5),
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    camera.position.z = 7.5;
    generator = new THREE.PMREMGenerator(renderer);
    environmentScene = new RoomEnvironment();
    environment = generator.fromScene(environmentScene, 0.035);
    scene.environment = environment.texture;
    scene.environmentIntensity = 1.65;
    environmentScene.dispose();
    generator.dispose();
    geometry = new THREE.TorusKnotGeometry(
      1.25,
      0.4,
      innerWidth < 700 ? 90 : 140,
      18,
      2,
      3,
    );
    material = new THREE.MeshStandardMaterial({
      color: 0x2059b5,
      metalness: 1,
      roughness: 0.17,
      envMapIntensity: 1.2,
    });
    geometry.computeBoundingSphere();
    const radius = geometry.boundingSphere.radius;
    const compactLayout = matchMedia("(max-width: 899px)");
    const sculpture = new THREE.Mesh(geometry, material);
    scene.add(sculpture);
    const blue = new THREE.PointLight(0x265bff, 24, 20);
    blue.position.set(-3, -1, 3);
    scene.add(blue);
    const rim = new THREE.DirectionalLight(0xcbdfff, 3);
    rim.position.set(2, 5, 3);
    scene.add(rim);
    function draw(now) {
      animation = 0;
      if (failed || document.hidden || !visible) return;
      const motion = state();
      if (now - lastFrame > 32 || motion.reduced) {
        time += Math.min((now - lastFrame) / 1000, 0.04);
        lastFrame = now;
        // Mobile has a dedicated art row: rotation stays inside that row.
        const compact = compactLayout.matches;
        const p = motion.reduced || compact ? 0 : motion.progress;
        const pointerX = motion.reduced ? 0 : motion.pointerX;
        const pointerY = motion.reduced ? 0 : motion.pointerY;
        sculpture.rotation.set(
          0.42 + p * 1.15 + pointerY * 0.08,
          (motion.reduced ? 0.3 : time * 0.13) + p * 2.2 + pointerX * 0.14,
          -0.36 + p * 0.75,
        );
        sculpture.position.set(
          compact ? 0 : 0.15 - p * 0.55,
          compact ? 0 : 0.15 - p * 0.3,
          0,
        );
        sculpture.scale.setScalar(1 + p * 0.32);
        try {
          renderer.render(scene, camera);
          container.classList.add("has-3d");
        } catch {
          fail();
          return;
        }
      }
      if (!motion.reduced) animation = requestAnimationFrame(draw);
    }
    function wake() {
      if (!animation && !failed && visible && !document.hidden)
        animation = requestAnimationFrame(draw);
    }
    function resize() {
      if (failed) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      if (compactLayout.matches) {
        // Fit the bounding sphere, so every rotation fits, not just the first frame.
        const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
        const limitingAngle = Math.atan(
          Math.tan(halfFov) * Math.min(1, camera.aspect),
        );
        camera.position.z = (radius / Math.sin(limitingAngle)) * 1.12;
      } else {
        camera.position.z = camera.aspect < 0.85 ? 9 : 7.5;
      }
      camera.updateProjectionMatrix();
      wake();
    }
    function fail() {
      failed = true;
      cancelAnimationFrame(animation);
      container.classList.remove("has-3d");
    }
    canvas.addEventListener("webglcontextlost", (event) => {
      event.preventDefault();
      fail();
    });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        ([entry]) => {
          visible = entry.isIntersecting;
          if (visible) wake();
          else {
            cancelAnimationFrame(animation);
            animation = 0;
          }
        },
        { rootMargin: "80px" },
      ).observe(container);
    }
    if ("ResizeObserver" in window)
      new ResizeObserver(resize).observe(container);
    else addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(animation);
        animation = 0;
      } else wake();
    });
    addEventListener("ews:motionchange", () => {
      lastFrame = 0;
      wake();
    });
    resize();
  } catch {
    failed = true;
    cancelAnimationFrame(animation);
    container.classList.remove("has-3d");
    geometry?.dispose();
    material?.dispose();
    environment?.dispose();
    environmentScene?.dispose();
    generator?.dispose();
    renderer?.dispose();
  }
})();
