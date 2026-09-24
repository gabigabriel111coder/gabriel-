/* ==========================================================================
   Gabriel Tech · scena 3D interattiva (Three.js)
   - la "G" del logo in 3D segue il mouse, si trascina col dito e gira scorrendo
   - forme lucide fluttuano dietro la pagina, si scansano dal mouse
     e accelerano quando scorri
   Viene caricata da main.js solo se il dispositivo supporta WebGL.
   ========================================================================== */
import * as THREE from "three";
import { RoomEnvironment } from "./vendor/RoomEnvironment.js";
import { RoundedBoxGeometry } from "./vendor/RoundedBoxGeometry.js";

const { clamp, lerp, degToRad } = THREE.MathUtils;

export function start() {
  const small = matchMedia("(max-width: 860px)").matches;
  const canvas = document.createElement("canvas");
  canvas.className = "webgl";
  canvas.setAttribute("aria-hidden", "true");
  (document.querySelector(".backdrop") || document.body.firstChild).after(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  let dpr = Math.min(devicePixelRatio, small ? 1.5 : 1.75);
  renderer.setPixelRatio(dpr);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  const sun = new THREE.DirectionalLight(0xffffff, 1.4);
  sun.position.set(3, 5, 6);
  scene.add(sun);

  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 12;
  const visH = (z) => 2 * (camera.position.z - z) * Math.tan(degToRad(camera.fov / 2));

  /* ---------- Materiali del brand ---------- */
  const glossy = (color, extra = {}) => new THREE.MeshPhysicalMaterial({
    color, roughness: 0.2, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.1, ...extra
  });
  const MAT = {
    blue: glossy(0x0a84ff),
    violet: glossy(0x7c5cff),
    teal: glossy(0x2fd2b8),
    pink: glossy(0xff5fa2),
    pearl: glossy(0xffffff, { roughness: 0.22, iridescence: 1, iridescenceIOR: 1.35 })
  };

  /* ---------- Il logo: G + puntatore ---------- */
  const gradA = new THREE.Color(0x0a84ff), gradB = new THREE.Color(0x5e5ce6), gradC = new THREE.Color(0x9b5cff);
  const tmp = new THREE.Color();
  function paintGradient(geo) { // stesso sfumato del logo: blu in alto a sinistra, viola in basso a destra
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const t = clamp((pos.getX(i) - pos.getY(i)) / 2.6 + 0.5, 0, 1);
      if (t < 0.55) tmp.lerpColors(gradA, gradB, t / 0.55);
      else tmp.lerpColors(gradB, gradC, (t - 0.55) / 0.45);
      colors.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }

  const cursorShape = new THREE.Shape(
    [[0, 0], [0, -29], [7.6, -21.8], [12.6, -33], [18, -30.6], [13, -19.6], [23.8, -19.6]]
      .map(([x, y]) => new THREE.Vector2(x / 27, y / 27))
  );
  const cursorGeo = new THREE.ExtrudeGeometry(cursorShape, {
    depth: 0.14, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.045, bevelSegments: 5, curveSegments: 1
  });
  cursorGeo.translate(0, 0, -0.07);

  const logo = new THREE.Group();
  const R = 1, T = 0.2, GAP = degToRad(48);
  const ringGeo = new THREE.TorusGeometry(R, T, 36, 200, Math.PI * 2 - GAP);
  ringGeo.rotateZ(GAP);
  const barGeo = new THREE.CapsuleGeometry(T, 0.88, 12, 36);
  barGeo.rotateZ(Math.PI / 2);
  barGeo.translate(0.56, 0, 0);
  const endGeo = new THREE.SphereGeometry(T, 36, 18);
  endGeo.translate(Math.cos(GAP) * R, Math.sin(GAP) * R, 0);
  const logoMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.14, metalness: 0.1, clearcoat: 1, clearcoatRoughness: 0.06 });
  for (const geo of [ringGeo, barGeo, endGeo]) {
    paintGradient(geo);
    logo.add(new THREE.Mesh(geo, logoMat));
  }
  const cursor = new THREE.Mesh(cursorGeo, MAT.pearl);
  cursor.position.set(0.26, -0.15, 0.32);
  cursor.scale.setScalar(0.9);
  logo.add(cursor);
  scene.add(logo);

  /* ---------- Forme che fluttuano ---------- */
  const GEO = {
    box: new RoundedBoxGeometry(1, 1, 1, 5, 0.24),
    torus: new THREE.TorusGeometry(0.55, 0.2, 28, 72),
    sphere: new THREE.SphereGeometry(0.5, 48, 24),
    capsule: new THREE.CapsuleGeometry(0.26, 0.7, 10, 28),
    cursor: cursorGeo
  };
  const LOOKS = [
    ["torus", "violet", 1], ["sphere", "teal", 0.8], ["box", "blue", 0.9], ["capsule", "pink", 1],
    ["cursor", "pearl", 1.3], ["torus", "blue", 0.8], ["box", "violet", 0.75], ["sphere", "pearl", 0.7],
    ["capsule", "teal", 0.9], ["box", "pink", 0.7], ["torus", "teal", 0.9], ["cursor", "violet", 1.1]
  ];
  const floaters = LOOKS.slice(0, small ? 7 : LOOKS.length).map(([g, m, s], i) => {
    const mesh = new THREE.Mesh(GEO[g], MAT[m]);
    mesh.scale.setScalar(s * (small ? 0.6 : 0.9));
    mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
    scene.add(mesh);
    return {
      mesh,
      side: i % 2 ? 1 : -1,
      z: -1 - (i % 3) * 1.6,
      xFrac: (small ? 1.02 : 0.9) + ((i * 37) % 13) / 100, // ai bordi: il testo resta libero
      yScr: 0,
      spin: new THREE.Vector3(0.2 + Math.random() * 0.3, 0.25 + Math.random() * 0.35, 0.1 * Math.random()),
      phase: Math.random() * Math.PI * 2,
      push: new THREE.Vector2()
    };
  });

  // distribuisce le forme lungo tutta la pagina (in "schermate")
  const PARALLAX = 0.55;
  function layout() {
    const screens = Math.max(1, (document.documentElement.scrollHeight - innerHeight) / innerHeight);
    const span = screens * PARALLAX + 0.6;
    floaters.forEach((f, i) => {
      f.yScr = i === 0 ? (small ? 0.47 : 0.36) : i === 1 ? -0.4 : 0.2 - (i / (floaters.length - 1)) * span;
    });
  }

  /* ---------- Input: mouse, dito, scorrimento ---------- */
  const pointer = new THREE.Vector2(0, 0);   // posizione in coordinate -1..1
  const eased = new THREE.Vector2(0, 0);
  const ZERO = new THREE.Vector2(0, 0), pushTarget = new THREE.Vector2();
  let pointerActive = false;
  addEventListener("pointermove", (e) => {
    pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    pointerActive = true;
  }, { passive: true });
  document.documentElement.addEventListener("pointerleave", () => { pointerActive = false; });

  // trascinare la G (anche col dito: lo scorrimento verticale resta libero)
  const anchor = document.querySelector("[data-3d-anchor]");
  let drag = null, spinY = 0, spinVel = 0;
  anchor?.addEventListener("pointerdown", (e) => { drag = { x: e.clientX }; anchor.setPointerCapture(e.pointerId); });
  anchor?.addEventListener("pointermove", (e) => {
    if (!drag) return;
    spinVel = (e.clientX - drag.x) * 0.012;
    spinY += spinVel;
    drag.x = e.clientX;
  });
  const endDrag = () => { drag = null; };
  anchor?.addEventListener("pointerup", endDrag);
  anchor?.addEventListener("pointercancel", endDrag);

  let lastScroll = scrollY, scrollBoost = 0;

  /* ---------- Dimensioni ---------- */
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    layout();
  }
  addEventListener("resize", resize);
  new ResizeObserver(layout).observe(document.body);
  resize();

  /* ---------- Animazione ---------- */
  const clock = new THREE.Clock();
  const ndc = new THREE.Vector3(), dir = new THREE.Vector3(), anchorPos = new THREE.Vector3();
  let frames = 0, sampleTime = 0, quality = 2, started = false;

  function toWorldAtZ0(nx, ny, out) { // punto dello schermo -> posizione 3D sul piano z = 0
    ndc.set(nx, ny, 0.5).unproject(camera);
    dir.copy(ndc).sub(camera.position).normalize();
    return out.copy(camera.position).addScaledVector(dir, -camera.position.z / dir.z);
  }

  function frame() {
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const h = innerHeight;

    // scorrimento: velocità (fa girare le forme) e avanzamento
    const dScroll = scrollY - lastScroll;
    lastScroll = scrollY;
    scrollBoost = lerp(scrollBoost, clamp(Math.abs(dScroll) * 0.02, 0, 3), 0.1);
    const scrolled = scrollY / h;
    const heroOut = clamp(scrollY / (h * 0.9), 0, 1);

    // il mouse sposta leggermente la camera: effetto profondità
    eased.lerp(pointerActive ? pointer : ZERO, 0.06);
    camera.position.x = eased.x * 0.45;
    camera.position.y = eased.y * 0.3;
    camera.lookAt(0, 0, -2);
    camera.updateMatrixWorld();

    // la G segue il riquadro dell'hero, qualunque sia l'impaginazione
    const r = anchor?.getBoundingClientRect();
    logo.visible = !!r && r.bottom > -h * 0.3 && r.top < h * 1.3;
    if (logo.visible) {
      const nx = ((r.left + r.width / 2) / innerWidth) * 2 - 1;
      const ny = -((r.top + r.height / 2) / h) * 2 + 1;
      toWorldAtZ0(nx, ny, anchorPos);
      logo.position.copy(anchorPos);
      logo.position.z = -heroOut * 2;
      const size = (Math.min(r.width, r.height) / h) * visH(0);
      logo.scale.setScalar((size / 3.5) * (1 - heroOut * 0.2));

      if (!drag) { // inerzia, poi torna a guardare avanti
        spinVel *= 0.94;
        spinY += spinVel;
        if (Math.abs(spinVel) < 0.002) spinY = lerp(spinY, Math.round(spinY / (Math.PI * 2)) * Math.PI * 2, 0.03);
      }
      const ry = spinY + eased.x * 0.6 + Math.sin(t * 0.5) * 0.12 + heroOut * Math.PI * 1.2;
      const rx = -eased.y * 0.35 + Math.sin(t * 0.7) * 0.05 + heroOut * 0.5;
      logo.rotation.y = lerp(logo.rotation.y, ry, 0.08);
      logo.rotation.x = lerp(logo.rotation.x, rx, 0.08);
      logo.position.y += Math.sin(t * 0.9) * 0.06 * logo.scale.x;
      // il puntatore "clicca" ogni tanto
      cursor.position.z = 0.32 - Math.pow(Math.max(0, Math.sin(t * 2.2)), 12) * 0.2;
    }

    // forme fluttuanti
    for (const f of floaters) {
      const m = f.mesh;
      const vh = visH(f.z);
      const vw = vh * camera.aspect;
      const baseX = f.side * f.xFrac * vw / 2;
      const baseY = (f.yScr + scrolled * PARALLAX) * vh + Math.sin(t * 0.8 + f.phase) * 0.15;

      // si scansano dal mouse
      m.position.set(baseX, baseY, f.z);
      ndc.copy(m.position).project(camera);
      const dx = (ndc.x - pointer.x) * camera.aspect;
      const dy = ndc.y - pointer.y;
      const d = Math.hypot(dx, dy);
      const reach = 0.5;
      const force = pointerActive && d < reach ? (1 - d / reach) * 1.4 : 0;
      f.push.lerp(pushTarget.set(d ? (dx / d) * force : 0, d ? (dy / d) * force : 0), 0.08);
      m.position.x += f.push.x;
      m.position.y += f.push.y;

      const boost = 1 + scrollBoost + force * 2;
      m.rotation.x += f.spin.x * dt * boost;
      m.rotation.y += f.spin.y * dt * boost;
      m.rotation.z += f.spin.z * dt;
    }

    renderer.render(scene, camera);

    if (!started) {
      started = true;
      document.documentElement.classList.add("webgl-on");
    }

    // qualità automatica: se il dispositivo fatica, riduce la risoluzione
    if (t > 1.5 && quality > 0) {
      frames++;
      sampleTime += dt;
      if (sampleTime > 2) {
        const fps = frames / sampleTime;
        frames = 0;
        sampleTime = 0;
        if (fps < 40) {
          quality--;
          dpr = quality === 1 ? Math.min(dpr, 1) : 0.75;
          renderer.setPixelRatio(dpr);
          resize();
        } else {
          quality = 0; // va bene così
        }
      }
    }
  }

  renderer.setAnimationLoop(frame);
  document.addEventListener("visibilitychange", () => {
    renderer.setAnimationLoop(document.hidden ? null : frame);
    clock.getDelta();
  });
}
