/* ----------------------------------------------------
   THE GLOWING GROVE — THREE.JS & GSAP INTERACTIVE LOGIC
   ---------------------------------------------------- */

// 1. Wish Data Array
const wishData = [
  {
    author: "An Admirer",
    message: "You have this incredible quiet strength. You don't have to be the loudest in the room for your presence to matter. Never forget how much you anchor the people lucky enough to be close to you."
  },
  {
    author: "From the Grapevine",
    message: "It takes a truly strong person to go through life and remain so gentle and sweet. The way you care for the people you love is rare and beautiful."
  },
  {
    author: "A Friend from Afar",
    message: "Even if you feel a little left out or disconnected sometimes, please know that your kindness and respect do not go unnoticed. You are seen, valued, and appreciated exactly as you are."
  },
  {
    author: "Someone Rooting For You",
    message: "Your independence and drive are inspiring. You have built your own path entirely on your own terms, and you deserve every bit of the success coming your way."
  },
  {
    author: "A Well-Wisher",
    message: "I know birthdays haven't always been a big deal in the past, but you deserve to be celebrated. Wishing you a year filled with the exact same warmth, safety, and love you so easily give to others."
  }
];

// 2. Global State Variables
let scene, camera, renderer, controls;
let treeGroup, floatingIsland, fireflySystem, fireflyGeo;
const orbsArray = [];
const glowMeshes = [];
let fireflyCount = 40;

// Mobile detection
const isMobile = (typeof navigator !== 'undefined') && (/Mobi|Android|iPhone|iPad/.test(navigator.userAgent) || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches));
const fireflySpeeds = [];

// Surroundings state
const butterflies = [];   // { group, wingL, wingR, phase, radius, speed, yBase }
const birds = [];         // { group, phase, radius, yBase, speed }
const deer = [];          // { group, phase, speed, radius }

// App State Machine
let appState = 'INTRO_PHASE'; // 'INTRO_PHASE' | 'TREE_PHASE'
let introStep = 0;
const introTexts = [
  "Yes, we know.",
  "We are officially 11 days late to the party.",
  "But honestly, cramming a celebration for someone like you into just one day didn't feel right.",
  "We know you aren't always used to being celebrated.",
  "But your quiet strength, and the gentle way you care for the people you love, doesn't go unnoticed.",
  "It’s never really about the date on a calendar. It’s about celebrating the person you are.",
  "You don't need a specific day. Every day is worth celebrating just because you exist.",
  "Happy Belated Birthday, Anish. Welcome to your own little space."
];

// Interaction and Camera Defaults
let isZoomed = false;
let currentZoomedOrb = null;
const defaultCamPos = new THREE.Vector3(0, 6, 12);
const defaultTarget = new THREE.Vector3(0, 3, 0);

// Interaction Threshold Checkers (Drag vs Click)
let startPoint = { x: 0, y: 0 };
let startTime = 0;

// Raycasting setup
const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();
const foliageGeometryCache = new Map();
const bushGeometryCache = new Map();
const rockGeometryCache = new Map();

// Timers / Clock
const clock = new THREE.Clock();

// Procedural Audio State (Used for clicking chime effects)
let audioCtx = null;
let isMuted = true;

// 3. Application Entry Point
window.addEventListener('DOMContentLoaded', () => {
  initThree();

  // Kick off async scene build — shows progress on the loading screen
  // Reduce particle/geometry counts for mobile
  if (isMobile) {
    fireflyCount = 18;
  }
  buildSceneAsync();
});

// Loading screen helpers
function setLoaderProgress(pct, status) {
  const bar = document.getElementById('loader-bar');
  const txt = document.getElementById('loader-status');
  if (bar) bar.style.width = pct + '%';
  if (txt) txt.textContent = status;
}

function hideLoader() {
  const ls = document.getElementById('loading-screen');
  if (ls) ls.classList.add('hidden');
}

// Yield one frame to let the browser paint before the next heavy step
function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

// Async scene builder — each step yields so the loading screen stays animated
async function buildSceneAsync() {
  // Step 0 — renderer is already initialised; start the render loop now
  // so the loading screen canvas bg looks alive
  setLoaderProgress(5, 'Waking up the forest…');
  await nextFrame();

  // Step 1 — Lights
  setLoaderProgress(10, 'Raising the sun…');
  await nextFrame();
  buildLights();

  // Step 2 — Tree skeleton
  setLoaderProgress(20, 'Growing the trunk and branches…');
  await nextFrame();
  const { treeMeshGroup, tips } = generateTreeGeometry();
  treeGroup = treeMeshGroup;
  treeGroup.position.y = -1.1;
  scene.add(treeGroup);

  // Step 3 — Foliage blobs (heaviest step)
  setLoaderProgress(36, 'Filling the canopy with leaves…');
  await nextFrame();
  spawnFoliage(tips);

  // Step 4 — Canopy glow + orbs
  setLoaderProgress(52, 'Hanging the glowing wish orbs…');
  await nextFrame();
  buildCanopyGlow();
  spawnWishOrbs(tips);

  // Step 5 — Fireflies
  setLoaderProgress(65, 'Waking the fireflies…');
  await nextFrame();
  spawnFireflies();

  // Step 6 — Ground, mountains, rocks
  setLoaderProgress(72, 'Sculpting the mountains…');
  await nextFrame();
  buildSurroundings();

  // Step 7 — Butterflies
  setLoaderProgress(84, 'Calling the butterflies…');
  await nextFrame();
  spawnButterflies();

  // Step 8 — Animals
  setLoaderProgress(93, 'Waking the deer and birds…');
  await nextFrame();
  spawnAnimals();

  // Step 9 — Event listeners + intro text
  setLoaderProgress(100, 'The grove is ready ✨');
  await nextFrame();
  setupEventListeners();
  document.getElementById('intro-text').textContent = introTexts[0];
  animate(); // start the render loop

  // Brief pause so user sees 100%, then fade out loader
  await new Promise(r => setTimeout(r, 600));
  hideLoader();
}

// 4. Initialize Three.js Environment
function initThree() {
  const container = document.getElementById('canvas-container');
  
  // Scene
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xf3e6f0, 0.01); // Soft warm dawn fog for Ethereal Dawn

  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  // Start in dynamic viewing position
  camera.position.set(-10, 12, 16);
  // Mobile: wider FOV and closer framing
  if (isMobile) {
    camera.fov = 60;
    // Move the camera further back on mobile so header + scene fit
    defaultCamPos.set(0, 5.2, 14);
    defaultTarget.set(0, 2.4, 0);
    camera.position.set(0, 7, 18);
    camera.updateProjectionMatrix();
  }

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.25));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  // Orbit Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 1.8; // Prevent looking completely underneath island
  controls.minPolarAngle = Math.PI / 4;   // Prevent top-down bird's-eye view
  controls.minDistance = 6;
  controls.maxDistance = 16;
  controls.target.copy(defaultTarget);
  controls.update();
}

// 5a. Build Lights
function buildLights() {
  // Soft pink ambient for warm dawn
  const ambientLight = new THREE.AmbientLight(0xf7dcec, 0.22);
  scene.add(ambientLight);

  // Warm white key light to simulate early morning sun
  const dirLight = new THREE.DirectionalLight(0xfff4e6, 1.6);
  dirLight.position.set(-11, 8, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = isMobile ? 512 : 1024;
  dirLight.shadow.mapSize.height = isMobile ? 512 : 1024;
  dirLight.shadow.camera.near = 1;
  dirLight.shadow.camera.far = 40;
  dirLight.shadow.camera.left = -18;
  dirLight.shadow.camera.right = 18;
  dirLight.shadow.camera.top = 18;
  dirLight.shadow.camera.bottom = -18;
  dirLight.shadow.bias = -0.0008;
  dirLight.shadow.normalBias = 0.03;
  scene.add(dirLight);

  // Warm hemisphere fill: soft rosy sky and muted ground
  const fillLight = new THREE.HemisphereLight(0xf7cfe8, 0x2f241f, 0.64);
  scene.add(fillLight);

  // Gentle warm rim to accent edges and give a faint dawn glow
  const rimLight = new THREE.PointLight(0xffd9c8, 0.6, 18, 2);
  rimLight.position.set(0, 7, -10);
  scene.add(rimLight);
  const hemisphereLight = new THREE.HemisphereLight(0xffe6f0, 0x2f241f, 0.12);
  scene.add(hemisphereLight);
}

// 5c. Canopy internal glow point light
function buildCanopyGlow() {
  const foliageLight = new THREE.PointLight(0xfff6ee, 1.2, 12);
  foliageLight.position.set(0, 3.5, 0);
  scene.add(foliageLight);
}


// 6. Generate Tree Geometry — Flat World-Space Branch Placement
// Each branch is a standalone mesh positioned & oriented directly in world space.
// NO nested group inheritance → zero Euler accumulation bugs → perfect symmetry guaranteed.
function generateTreeGeometry() {
  const treeMeshGroup = new THREE.Group();

  const barkMaterial = new THREE.MeshStandardMaterial({
    color: 0x3d313f, // Warm Charcoal trunk
    roughness: 0.48,
    metalness: 0.06,
    flatShading: true
  });

  // ── Helper: add a standalone cylinder branch at world position ──
  // base = THREE.Vector3 (bottom of branch in world space)
  // tip  = THREE.Vector3 (top  of branch in world space)
  // r0   = bottom radius, r1 = top radius
  function addBranchSegment(base, tip, r0, r1) {
    const dir = new THREE.Vector3().subVectors(tip, base);
    const len = dir.length();
    if (len < 0.01) return;

    const geo = new THREE.CylinderGeometry(r1, r0, len, 6);
    // Pivot at base: shift geometry up by half height
    geo.translate(0, len / 2, 0);

    const mesh = new THREE.Mesh(geo, barkMaterial);
    mesh.castShadow = true;
    mesh.receiveShadow = false;

    // Position the mesh at base
    mesh.position.copy(base);

    // Orient the mesh so its +Y axis points along dir
    const up = new THREE.Vector3(0, 1, 0);
    const normDir = dir.clone().normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, normDir);
    mesh.quaternion.copy(quaternion);

    treeMeshGroup.add(mesh);
    return mesh;
  }

  // ── Trunk ──
  // A straight, slightly tapered trunk from y=0 → y=trunkHeight.
  // We extend a hidden centre post up through the canopy so there is ZERO visible break.
  const trunkBase = new THREE.Vector3(0, 0, 0);
  const trunkTop  = new THREE.Vector3(0, 2.2, 0);
  addBranchSegment(trunkBase, trunkTop, 0.60, 0.40);

  // Thin centre post continues into canopy core (visually hidden by foliage but closes the gap)
  const coreTop = new THREE.Vector3(0, 4.2, 0);
  addBranchSegment(trunkTop, coreTop, 0.40, 0.10);

  // Collect tip positions for foliage placement
  const tips = [];

  // ── Recursive world-space branching ──
  // base    : Vector3 — branch origin in world space
  // dir     : Vector3 — normalised direction of parent branch (the branch grows along this)
  // length  : scalar length of this branch
  // r0, r1  : bottom and top radii
  // depth   : recursion depth (0 = primary limb from trunk)
  // parentAzimuth : the azimuth angle of the parent limb (radians) for perfect sub-ring distribution
  function recurse(base, dir, length, r0, r1, depth, parentAzimuth) {
    const tip = base.clone().addScaledVector(dir, length);
    addBranchSegment(base, tip, r0, r1);

    if (depth >= 4) {
      tips.push(tip);
      return;
    }

    // How many children this branch spawns
    const childCount = (depth === 0) ? 3 : 2;

    // Outward tilt from vertical — increases as we go deeper so canopy fans outward
    // depth=0: primary limbs tilt ~35°, depth=1: ~30°, depth=2: ~22°, deeper: gentle
    const tiltAngles  = [0.65, 0.55, 0.42, 0.32, 0.24];
    const tilt = tiltAngles[Math.min(depth, tiltAngles.length - 1)];

    for (let i = 0; i < childCount; i++) {
      // Each child is evenly spaced around 360° in azimuth, with a tiny jitter for organic feel
      const azimuth = parentAzimuth + (i / childCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.18;

      // Compute child direction in world space using spherical coordinates:
      // phi   = polar angle from +Y axis (tilt controls how much it leans outward)
      // theta = azimuth angle around Y axis
      const phi   = tilt;
      const theta = azimuth;
      const childDir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      ).normalize();

      const nextLen = length * (0.65 + Math.random() * 0.08);
      const nextR0  = r1;
      const nextR1  = r1 * 0.72;

      recurse(tip, childDir, nextLen, nextR0, nextR1, depth + 1, azimuth);
    }
  }

  // ── 6 primary limbs from trunk top — perfect hexagonal radial symmetry ──
  const numPrimaryLimbs = 6;
  for (let i = 0; i < numPrimaryLimbs; i++) {
    // Primary limbs begin exactly at trunk top in world space
    const azimuth = (i / numPrimaryLimbs) * Math.PI * 2;

    // Initial primary limb direction: tilted 38° outward from vertical in a radially symmetric ring
    const phi = 0.68; // ~39° from vertical
    const primaryDir = new THREE.Vector3(
      Math.sin(phi) * Math.cos(azimuth),
      Math.cos(phi),
      Math.sin(phi) * Math.sin(azimuth)
    ).normalize();

    recurse(
      trunkTop.clone(),
      primaryDir,
      1.15,   // primary limb length
      0.30,   // r0 (wide base at trunk top)
      0.21,   // r1
      0,      // depth = 0
      azimuth // parent azimuth for child ring alignment
    );
  }


  return { treeMeshGroup, tips };
}

// Spawns natural-looking foliage using large overlapping foliage BLOBS (cloud clusters).
// This mimics how real 3D games render tree canopies: not individual leaves but
// large intersecting foliage masses that form a solid, continuous hemisphere.
function spawnFoliage(tips) {
  const foliageGroup = new THREE.Group();

  const D = isMobile ? 0.58 : 1.0; // density scale for mobile
  // Foliage counts: higher on desktop to preserve hemisphere silhouette
  const tipBlobRange = isMobile ? [2, 3] : [5, 7];
  const shellRingCount = isMobile ? 5 : 7;
  const shellPerRing = isMobile ? 10 : 14;
  const interiorCount = isMobile ? 18 : 76;

  // ── Cherry blossom / songkran pink foliage palette ──
  // Base: soft blossom pink with warmer rosy highlights
  const greenMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xb97f86, roughness: 0.86, metalness: 0.01, flatShading: true }), // deep muted rose
    new THREE.MeshStandardMaterial({ color: 0xdca0a7, roughness: 0.80, metalness: 0.02, flatShading: true }), // base blossom pink
    new THREE.MeshStandardMaterial({ color: 0xf0c5ca, roughness: 0.75, metalness: 0.02, flatShading: true }), // soft highlight
    new THREE.MeshStandardMaterial({ color: 0xe6b0b8, roughness: 0.72, metalness: 0.02, flatShading: true }), // warm rose tint
    new THREE.MeshStandardMaterial({ color: 0xfff3f6, roughness: 0.68, metalness: 0.03, flatShading: true }), // bright highlights
    new THREE.MeshStandardMaterial({ color: 0x8d5d67, roughness: 0.90, metalness: 0.0, flatShading: true }), // shadow
    new THREE.MeshStandardMaterial({ color: 0xe8b7bf, roughness: 0.78, metalness: 0.01, flatShading: true }), // mid tone
  ];

  // ── Helper: create one organic foliage blob ──
  // A subdivided icosahedron with per-vertex random displacement → organic bumpy blob
  function makeFoliageBlob(radius, jitter) {
    const cacheKey = `${radius.toFixed(2)}:${jitter.toFixed(2)}`;
    const cachedGeo = foliageGeometryCache.get(cacheKey);
    if (cachedGeo) return cachedGeo.clone();

    const geo = new THREE.IcosahedronGeometry(radius, 1); // lighter blob with similar silhouette
    const pos = geo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      pos.setXYZ(v,
        pos.getX(v) * (1 + (Math.random() - 0.5) * jitter),
        pos.getY(v) * (1 + (Math.random() - 0.5) * jitter),
        pos.getZ(v) * (1 + (Math.random() - 0.5) * jitter)
      );
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    foliageGeometryCache.set(cacheKey, geo.clone());
    return geo;
  }

  // ── PASS 1: Branch-tip clusters ──
  // Place 4–6 overlapping blobs directly at each branch tip.
  // Blobs are large enough (0.55–0.9) to "swallow" the end of the branch,
  // so the branch visually connects INTO the foliage mass with no gap.
  tips.forEach((tip) => {
    const baseBlob = tipBlobRange[0] + Math.floor(Math.random() * (tipBlobRange[1] - tipBlobRange[0] + 1));
    const blobCount = Math.max(1, Math.floor(baseBlob * D));
    for (let b = 0; b < blobCount; b++) {
      const radius = 0.58 + Math.random() * 0.42;
      const geo = makeFoliageBlob(radius, 0.24);
      const mat = greenMaterials[Math.floor(Math.random() * greenMaterials.length)];
      const mesh = new THREE.Mesh(geo, mat);

      // Very tight offset — blobs sit directly on/around the tip (place in world coords)
      mesh.position.set(
        tip.x + (Math.random() - 0.5) * 0.25,
        tip.y + (Math.random() - 0.5) * 0.25,
        tip.z + (Math.random() - 0.5) * 0.25
      );
      // Convert the computed world position into tree-local coordinates so foliage remains attached
      if (treeGroup && typeof treeGroup.worldToLocal === 'function') {
        const worldP = mesh.position.clone();
        const localP = worldP.clone();
        treeGroup.worldToLocal(localP);
        mesh.position.copy(localP);
      }

      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      foliageGroup.add(mesh);
    }
  });

  // ── PASS 2: Hemisphere shell fill ──
  // Use evenly spaced latitude rings so the canopy stays balanced from every side.
  const domeR   = 3.5;
  const centerY = 4.0;

  const ringPhis = [];
  for (let r = 0; r < shellRingCount; r++) {
    const t = shellRingCount === 1 ? 0 : r / (shellRingCount - 1);
    ringPhis.push(0.14 * Math.PI + t * 0.40 * Math.PI);
  }

  ringPhis.forEach((phi, ringIndex) => {
    const ringRadius = ringIndex === 0 ? 0.98 : ringIndex === ringPhis.length - 1 ? 0.78 : 0.88 + ringIndex * 0.01;
    for (let i = 0; i < shellPerRing; i++) {
      const theta = (i / shellPerRing) * Math.PI * 2 + (ringIndex % 2) * (Math.PI / shellPerRing);
      const x = ringRadius * domeR * Math.sin(phi) * Math.cos(theta);
      const z = ringRadius * domeR * Math.sin(phi) * Math.sin(theta);
      const y = ringRadius * domeR * Math.cos(phi) + centerY;
      if (y < 2.0) continue;

      const radius = 0.74 + Math.random() * 0.38;
      const geo = makeFoliageBlob(radius, 0.18);
      const matIdx = 2 + (i + ringIndex) % 3;
      const mesh = new THREE.Mesh(geo, greenMaterials[matIdx]);
      mesh.position.set(x, y, z);
      if (treeGroup && typeof treeGroup.worldToLocal === 'function') {
        const localP = mesh.position.clone();
        treeGroup.worldToLocal(localP);
        mesh.position.copy(localP);
      }
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.castShadow = true;
      mesh.receiveShadow = false;
      foliageGroup.add(mesh);
    }
  });

  // ── PASS 3: Interior volume fill ──
  // Fill the center volume so the shell feels continuous from all angles.
  for (let i = 0; i < interiorCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = 0.1 * Math.PI + Math.random() * 0.42 * Math.PI;
    const r = 0.45 + Math.random() * 0.38;

    const x = r * domeR * Math.sin(phi) * Math.cos(theta);
    const z = r * domeR * Math.sin(phi) * Math.sin(theta);
    const y = r * domeR * Math.cos(phi) + centerY;

    if (y < 2.2) continue;

    const radius = 0.56 + Math.random() * 0.32;
    const geo = makeFoliageBlob(radius, 0.18);
    // Inner blobs are darker (shadow colours)
    const matIdx = Math.floor(Math.random() * 3); // use darker mats (idx 0–2)
    const mesh = new THREE.Mesh(geo, greenMaterials[matIdx]);

    // Place interior blob in world space then convert to tree-local
    mesh.position.set(x, y, z);
    if (treeGroup && typeof treeGroup.worldToLocal === 'function') {
      const worldP = mesh.position.clone();
      const localP = worldP.clone();
      treeGroup.worldToLocal(localP);
      mesh.position.copy(localP);
    }
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    foliageGroup.add(mesh);
  }

  // Add a few connector blobs around the trunk/top area to prevent visible gaps
  const trunkConnectors = isMobile ? 10 : 20;
  const trunkTopWorld = new THREE.Vector3(0, centerY - 0.6, 0);
  for (let i = 0; i < trunkConnectors; i++) {
    const a = (i / trunkConnectors) * Math.PI * 2 + Math.random() * 0.4;
    const rr = 0.38 + Math.random() * 1.0;
    const tx = trunkTopWorld.x + Math.cos(a) * rr;
    const ty = trunkTopWorld.y + (Math.random() - 0.2) * 0.6;
    const tz = trunkTopWorld.z + Math.sin(a) * rr;
    const radius = 0.54 + Math.random() * 0.30;
    const geo = makeFoliageBlob(radius, 0.06 + Math.random() * 0.06);
    const mat = greenMaterials[Math.floor(Math.random() * greenMaterials.length)];
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(tx, ty, tz);
    if (treeGroup && typeof treeGroup.worldToLocal === 'function') {
      const localP = mesh.position.clone();
      treeGroup.worldToLocal(localP);
      mesh.position.copy(localP);
    }
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    foliageGroup.add(mesh);
  }

  // Side imbalance is handled by the ring symmetry above; no separate side band needed.

  // Add foliage directly inside treeGroup so it shares all natural slow rotation/sway
  treeGroup.add(foliageGroup);
}


// 7. Place Glowing Orbs (Double Mesh) hovering under the tree in a lively orbit
function spawnWishOrbs(tips) {
  const orbColors = [0x2de8d8, 0x3bd6ff, 0xcffeff, 0x9be8ff, 0x7fffd4, 0x8ef6e4, 0x5ef0ff];
  const orbCount = wishData.length;
  const baseOrbitRadius = isMobile ? 1.65 : 1.95;
  const baseOrbitHeight = isMobile ? 0.58 : 0.68;

  wishData.forEach((wish, idx) => {
    const angle = (idx / wishData.length) * Math.PI * 2;
    const orbitRadius = baseOrbitRadius + (idx % 2) * 0.12;
    const orbitHeight = baseOrbitHeight + (idx % 3) * (isMobile ? 0.05 : 0.08);
    const localCenter = new THREE.Vector3(
      Math.cos(angle) * orbitRadius,
      orbitHeight,
      Math.sin(angle) * orbitRadius
    );

    const orbColor = orbColors[idx % orbColors.length];

    // Core Orb Mesh
    const orbRadius = isMobile ? 0.32 : 0.22;
    const orbGeo = new THREE.SphereGeometry(orbRadius, 12, 12);
    const orbMat = new THREE.MeshBasicMaterial({
      color: orbColor,
      transparent: true,
      opacity: 1.0,
      depthWrite: false
    });

    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    orbMesh.renderOrder = 4;
    const worldPos = localCenter.clone();
    if (treeGroup) {
      treeGroup.localToWorld(worldPos);
    }
    orbMesh.position.copy(worldPos);
    
    orbMesh.userData = {
      index: idx,
      wish: wish,
      orbitCenter: localCenter.clone(),
      orbitRadius,
      orbitHeight,
      orbitAngle: angle,
      orbitBaseAngle: angle,
      orbitWobble: 0.16 + (idx % 2) * 0.03,
      orbitSpeed: 0.8 + idx * 0.05,
      orbitPhase: Math.random() * Math.PI * 2,
      basePos: worldPos.clone(),
      phase: Math.random() * Math.PI * 2
    };

    scene.add(orbMesh);
    orbsArray.push(orbMesh);

    // Outer Glow Mesh (Additive blending)
    const outerGeo = new THREE.SphereGeometry(isMobile ? 0.62 : 0.45, 12, 12);
    const outerMat = new THREE.MeshBasicMaterial({
      color: orbColor,
      transparent: true,
      opacity: 0.30,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    outerMesh.renderOrder = 3;
    outerMesh.position.copy(worldPos);
    scene.add(outerMesh);
    
    orbMesh.userData.glowMesh = outerMesh;

    // Small local pointlight: casts beautiful glowing pools of light onto the island base!
    const localLight = new THREE.PointLight(orbColor, 1.85, 2.8, 2.0);
    localLight.position.set(0, 0, 0);
    orbMesh.add(localLight);
  });
}

// ═══════════════════════════════════════════════════════
// 8b. LIVING WORLD — Ground, Bushes, Mountains, Animals
// ═══════════════════════════════════════════════════════

function buildSurroundings() {
  // ── Ground plane ──
  const groundGeo = new THREE.CircleGeometry(38, 8);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x3d7a2f,
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.1;
  ground.receiveShadow = true;
  scene.add(ground);

  // ── Low-poly mountains in the background ──
  const mountainColors = [0x2d5c28, 0x3a7533, 0x4d9440, 0x1e3d1a, 0x567a30];
  const mountainData = [
    { x: -22, z: -18, h: 9,  r: 7 },
    { x:  18, z: -22, h: 11, r: 8 },
    { x: -14, z: -28, h: 14, r: 9 },
    { x:  28, z: -16, h: 8,  r: 6 },
    { x:   6, z: -30, h: 10, r: 7 },
    { x: -30, z: -10, h: 7,  r: 5 },
    { x:  22, z:  -8, h: 6,  r: 5 },
    { x: -18, z:  16, h: 8,  r: 6 },
    { x:  16, z:  18, h: 9,  r: 7 },
    { x:   0, z:  32, h: 11, r: 8 },
  ];
  mountainData.forEach(m => {
    const geo = new THREE.ConeGeometry(m.r, m.h, 5 + Math.floor(Math.random()*3));
    // Displace vertices slightly for natural look
    const pos = geo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      if (pos.getY(v) < m.h - 0.5) { // don't move peak
        pos.setXYZ(v,
          pos.getX(v) * (1 + (Math.random()-0.5)*0.18),
          pos.getY(v),
          pos.getZ(v) * (1 + (Math.random()-0.5)*0.18)
        );
      }
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
      color: mountainColors[Math.floor(Math.random()*mountainColors.length)],
      roughness: 0.9, metalness: 0.0, flatShading: true
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(m.x, -1.1 + m.h/2, m.z);
    mesh.rotation.y = Math.random() * Math.PI;
    scene.add(mesh);
  });

  // ── Helper: make a rounded low-poly bush blob ──
  function makeBushBlob(radius) {
    const cacheKey = radius.toFixed(2);
    const cachedGeo = bushGeometryCache.get(cacheKey);
    if (cachedGeo) return cachedGeo.clone();

    const geo = new THREE.IcosahedronGeometry(radius, 0);
    const pos = geo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      pos.setXYZ(v,
        pos.getX(v) * (1 + (Math.random()-0.5)*0.4),
        pos.getY(v) * (0.7 + Math.random()*0.3), // flatten bottom
        pos.getZ(v) * (1 + (Math.random()-0.5)*0.4)
      );
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    bushGeometryCache.set(cacheKey, geo.clone());
    return geo;
  }

  const bushColors = [0x2d6b22, 0x3d8a2e, 0x4fa03a, 0x245c1c, 0x5cb845, 0x1d4f18];

  // ── Bushes scattered across the ground ──
  for (let i = 0; i < 24; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 6 + Math.random() * 22;
    const bx = Math.cos(angle) * dist;
    const bz = Math.sin(angle) * dist;

    const bushGroup = new THREE.Group();
    // 2–4 overlapping blobs per bush
    const blobCount = 2 + Math.floor(Math.random() * 3);
    for (let b = 0; b < blobCount; b++) {
      const r = 0.5 + Math.random() * 0.9;
      const geo = makeBushBlob(r);
      const mat = new THREE.MeshStandardMaterial({
        color: bushColors[Math.floor(Math.random()*bushColors.length)],
        roughness: 0.9, metalness: 0.0, flatShading: true
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random()-0.5)*r*1.2,
        r*0.5,
        (Math.random()-0.5)*r*1.2
      );
      bushGroup.add(mesh);
    }
    bushGroup.position.set(bx, -1.1, bz);
    bushGroup.rotation.y = Math.random() * Math.PI * 2;
    scene.add(bushGroup);
  }

  // ── Flower clusters ──
  const flowerColors = [0xff6b9d, 0xff9f43, 0xffd32a, 0xa29bfe, 0xfd79a8, 0x55efc4, 0xfdcb6e];
  for (let i = 0; i < 32; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 5.5 + Math.random() * 20;
    const fx = Math.cos(angle) * dist;
    const fz = Math.sin(angle) * dist;

    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.55, 4);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x2d7a1e, roughness: 0.9, flatShading: true });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(fx, -1.1 + 0.27, fz);
    scene.add(stem);

    // Petal head — flattened sphere
    const petalGeo = new THREE.IcosahedronGeometry(0.18 + Math.random()*0.12, 0);
    const petalMat = new THREE.MeshStandardMaterial({
      color: flowerColors[Math.floor(Math.random()*flowerColors.length)],
      roughness: 0.6, metalness: 0.0, emissive: flowerColors[Math.floor(Math.random()*flowerColors.length)],
      emissiveIntensity: 0.15, flatShading: true
    });
    const petal = new THREE.Mesh(petalGeo, petalMat);
    petal.position.set(fx, -1.1 + 0.58, fz);
    scene.add(petal);
  }

  // ── Rocks ──
  const rockColors = [0x5a5a6e, 0x6b6b7a, 0x4a4a58, 0x7a7a8a];
  const butterflyCountLocal = isMobile ? 6 : 12;
  for (let i = 0; i < butterflyCountLocal; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 5 + Math.random() * 18;
    const rx = Math.cos(angle) * dist;
    const rz = Math.sin(angle) * dist;
    const rr = 0.2 + Math.random() * 0.55;
    const cacheKey = rr.toFixed(2);
    let geo = rockGeometryCache.get(cacheKey);
    if (!geo) {
      geo = new THREE.IcosahedronGeometry(rr, 0);
      const pos = geo.attributes.position;
      for (let v = 0; v < pos.count; v++) {
        pos.setXYZ(v,
          pos.getX(v)*(1+(Math.random()-0.5)*0.3),
          pos.getY(v)*(0.55+Math.random()*0.3),
          pos.getZ(v)*(1+(Math.random()-0.5)*0.3)
        );
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
      rockGeometryCache.set(cacheKey, geo.clone());
    } else {
      geo = geo.clone();
    }
    const mat = new THREE.MeshStandardMaterial({
      color: rockColors[Math.floor(Math.random()*rockColors.length)],
      roughness: 0.95, metalness: 0.1, flatShading: true
    });
    const rock = new THREE.Mesh(geo, mat);
    rock.position.set(rx, -1.1 + rr*0.35, rz);
    rock.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    scene.add(rock);
  }

  // ── Grass tufts ──
  const grassMat = new THREE.MeshStandardMaterial({ color: 0x5cb845, roughness: 0.9, flatShading: true });
  for (let i = 0; i < 48; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 5 + Math.random() * 25;
    const gx = Math.cos(angle) * dist;
    const gz = Math.sin(angle) * dist;
    const bladeCount = 3 + Math.floor(Math.random() * 3);
    for (let b = 0; b < bladeCount; b++) {
      const h = 0.25 + Math.random() * 0.4;
      const geo = new THREE.ConeGeometry(0.04, h, 3);
      geo.translate(0, h/2, 0);
      const blade = new THREE.Mesh(geo, grassMat);
      blade.position.set(
        gx + (Math.random()-0.5)*0.3,
        -1.1,
        gz + (Math.random()-0.5)*0.3
      );
      blade.rotation.set(0, Math.random()*Math.PI*2, (Math.random()-0.5)*0.35);
      scene.add(blade);
    }
  }
}

// ── Butterflies ──
function spawnButterflies() {
  const butterflyColors = [
    [0xff6b9d, 0xff8fab], // pink
    [0xf9ca24, 0xf0932b], // yellow-orange
    [0xa29bfe, 0x6c5ce7], // purple
    [0x00cec9, 0x81ecec], // teal
    [0xfd79a8, 0xfdcb6e], // pink-gold
    [0x55efc4, 0x00b894], // mint
    [0xffeaa7, 0xff7675], // warm
  ];

  for (let i = 0; i < 12; i++) {
    const group = new THREE.Group();
    const cols = butterflyColors[i % butterflyColors.length];
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2d1a0e, roughness: 0.8, flatShading: true });
    const wingMat = new THREE.MeshStandardMaterial({
      color: cols[0], emissive: cols[1], emissiveIntensity: 0.35,
      roughness: 0.5, metalness: 0.1,
      transparent: true, opacity: 0.88, flatShading: true, side: THREE.DoubleSide
    });
    const wingMatR = wingMat.clone();
    wingMatR.color.setHex(cols[1]);

    // Body
    const bodyGeo = typeof THREE.CapsuleGeometry === 'function'
      ? new THREE.CapsuleGeometry(0.04, 0.18, 2, 4)
      : new THREE.CylinderGeometry(0.03, 0.05, 0.2, 4);
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.rotation.z = Math.PI / 2;
    group.add(body);

    // Wings — flat triangular shapes
    function makeWing(side) {
      // Upper wing
      const pts = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(side * 0.55, 0.35),
        new THREE.Vector2(side * 0.45, -0.1),
      ];
      const shape = new THREE.Shape(pts);
      const geo = new THREE.ShapeGeometry(shape);
      return geo;
    }

    const wLGeo = makeWing(-1);
    const wRGeo = makeWing(1);
    const wingL = new THREE.Mesh(wLGeo, wingMat);
    const wingR = new THREE.Mesh(wRGeo, wingMatR);
    wingL.position.x = -0.06;
    wingR.position.x =  0.06;
    // Lower wings
    function makeLowerWing(side) {
      const pts = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(side * 0.38, -0.2),
        new THREE.Vector2(side * 0.28, -0.38),
      ];
      const shape = new THREE.Shape(pts);
      return new THREE.ShapeGeometry(shape);
    }
    const wLLGeo = makeLowerWing(-1);
    const wRLGeo = makeLowerWing(1);
    const wingLL = new THREE.Mesh(wLLGeo, wingMat);
    const wingRL = new THREE.Mesh(wRLGeo, wingMatR);
    wingLL.position.x = -0.06;
    wingRL.position.x =  0.06;

    group.add(wingL);
    group.add(wingR);
    group.add(wingLL);
    group.add(wingRL);

    // Place butterfly in the world
    const angle = Math.random() * Math.PI * 2;
    const radius = 4 + Math.random() * 12;
    const yBase = 0.5 + Math.random() * 4.5;
    group.position.set(Math.cos(angle)*radius, yBase, Math.sin(angle)*radius);
    group.rotation.x = -Math.PI / 2; // lay flat
    scene.add(group);

    butterflies.push({
      group, wingL, wingR, wingLL, wingRL,
      phase: Math.random() * Math.PI * 2,
      radius,
      angle,
      speed: 0.18 + Math.random() * 0.22,
      yBase,
      yPhase: Math.random() * Math.PI * 2
    });
  }
}

// ── Animals: low-poly deer + birds ──
function spawnAnimals() {
  // ── Low-poly birds (swooping flocks) ──
  const birdMat = new THREE.MeshStandardMaterial({
    color: 0x2c2c54, roughness: 0.7, metalness: 0.1, flatShading: true
  });

  const birdCountLocal = isMobile ? 4 : 8;
  for (let b = 0; b < birdCountLocal; b++) {
    const group = new THREE.Group();

    // Body — small elongated icosahedron
    const bodyGeo = new THREE.IcosahedronGeometry(0.18, 0);
    bodyGeo.scale(1.8, 0.8, 1);
    const body = new THREE.Mesh(bodyGeo, birdMat);
    group.add(body);

    // Tail
    const tailGeo = new THREE.ConeGeometry(0.07, 0.28, 3);
    tailGeo.translate(0, -0.24, 0);
    const tail = new THREE.Mesh(tailGeo, birdMat);
    tail.rotation.z = Math.PI;
    tail.position.x = -0.3;
    group.add(tail);

    // Wings — flat triangles
    function makeBirdWing(side) {
      const pts = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(side * 0.5, 0.18),
        new THREE.Vector2(side * 0.42, -0.08),
      ];
      return new THREE.ShapeGeometry(new THREE.Shape(pts));
    }
    const wL = new THREE.Mesh(makeBirdWing(-1), birdMat.clone());
    const wR = new THREE.Mesh(makeBirdWing( 1), birdMat.clone());
    wL.name = 'wingL'; wR.name = 'wingR';
    group.add(wL);
    group.add(wR);

    const angle = Math.random() * Math.PI * 2;
    const radius = 8 + Math.random() * 14;
    const yBase = 5 + Math.random() * 7;
    group.position.set(Math.cos(angle)*radius, yBase, Math.sin(angle)*radius);
    scene.add(group);

    birds.push({
      group, wL, wR,
      phase: Math.random() * Math.PI * 2,
      angle,
      radius,
      yBase,
      speed: 0.4 + Math.random() * 0.3
    });
  }

  // ── Low-poly Deer ──
  const deerBodyMat = new THREE.MeshStandardMaterial({ color: 0xb5651d, roughness: 0.85, flatShading: true });
  const deerLegMat  = new THREE.MeshStandardMaterial({ color: 0x8B4513, roughness: 0.9, flatShading: true });
  const deerAntlerMat = new THREE.MeshStandardMaterial({ color: 0x5c3a1e, roughness: 0.9, flatShading: true });

  const deerCountLocal = isMobile ? 1 : 2;
  for (let d = 0; d < deerCountLocal; d++) {
    const group = new THREE.Group();

    // Body
    const bodyGeo = new THREE.IcosahedronGeometry(0.6, 0);
    bodyGeo.scale(1.7, 1.0, 1.0);
    const body = new THREE.Mesh(bodyGeo, deerBodyMat);
    body.position.y = 1.0;
    group.add(body);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.55, 4);
    const neck = new THREE.Mesh(neckGeo, deerBodyMat);
    neck.position.set(0.55, 1.45, 0);
    neck.rotation.z = -0.55;
    group.add(neck);

    // Head
    const headGeo = new THREE.IcosahedronGeometry(0.25, 0);
    const head = new THREE.Mesh(headGeo, deerBodyMat);
    head.position.set(0.95, 1.78, 0);
    group.add(head);

    // Snout
    const snoutGeo = new THREE.IcosahedronGeometry(0.12, 0);
    snoutGeo.scale(1.4, 0.9, 0.9);
    const snout = new THREE.Mesh(snoutGeo, deerBodyMat);
    snout.position.set(1.22, 1.7, 0);
    group.add(snout);

    // Ears
    [-1,1].forEach(side => {
      const earGeo = new THREE.ConeGeometry(0.1, 0.22, 3);
      const ear = new THREE.Mesh(earGeo, deerBodyMat);
      ear.position.set(0.88, 2.02, side * 0.22);
      ear.rotation.x = side * 0.4;
      group.add(ear);
    });

    // Antlers (only for first deer)
    if (d === 0) {
      [-1, 1].forEach(side => {
        const aGeo = new THREE.CylinderGeometry(0.03, 0.06, 0.55, 3);
        const a = new THREE.Mesh(aGeo, deerAntlerMat);
        a.position.set(0.88, 2.25, side * 0.14);
        a.rotation.z = side * 0.35;
        group.add(a);
        // Branch
        const a2Geo = new THREE.CylinderGeometry(0.02, 0.04, 0.3, 3);
        const a2 = new THREE.Mesh(a2Geo, deerAntlerMat);
        a2.position.set(0.88 + side*0.15, 2.48, side*0.14);
        a2.rotation.set(0, 0, side*0.8);
        group.add(a2);
      });
    }

    // Legs — 4 cylinders
    const legPositions = [[0.45, 0, 0.3],[0.45, 0, -0.3],[-0.45, 0, 0.3],[-0.45, 0, -0.3]];
    legPositions.forEach(([lx,,lz]) => {
      const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.85, 4);
      const leg = new THREE.Mesh(legGeo, deerLegMat);
      leg.position.set(lx, 0.42, lz);
      group.add(leg);
    });

    // Tail
    const tailGeo = new THREE.IcosahedronGeometry(0.1, 0);
    const tail = new THREE.Mesh(tailGeo, new THREE.MeshStandardMaterial({ color: 0xf5f5f5, flatShading: true }));
    tail.position.set(-0.75, 1.1, 0);
    group.add(tail);

    const angle = (d * Math.PI) + Math.random() * 0.5;
    const radius = 9 + d * 4;
    group.position.set(Math.cos(angle)*radius, -1.1, Math.sin(angle)*radius);
    group.rotation.y = angle + Math.PI;
    group.scale.setScalar(0.75);
    scene.add(group);

    deer.push({
      group,
      phase: Math.random() * Math.PI * 2,
      angle,
      radius,
      speed: 0.06 + Math.random() * 0.04
    });
  }
}

// 9. Particles System
function spawnFireflies() {
  fireflyGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(fireflyCount * 3);

  for (let i = 0; i < fireflyCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.5 + Math.random() * 4.0;
    const x = Math.cos(angle) * radius;
    const y = 0.2 + Math.random() * 6.5;
    const z = Math.sin(angle) * radius;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    fireflySpeeds.push({
      x: (Math.random() - 0.5) * 0.006,
      y: 0.005 + Math.random() * 0.008,
      z: (Math.random() - 0.5) * 0.006,
      phase: Math.random() * Math.PI * 2
    });
  }

  fireflyGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
  gradient.addColorStop(0, 'rgba(255, 200, 80, 1)');
  gradient.addColorStop(0.3, 'rgba(238, 69, 64, 0.7)');
  gradient.addColorStop(1, 'rgba(238, 69, 64, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 16);
  const fireflyTexture = new THREE.CanvasTexture(canvas);

  const fireflyMat = new THREE.PointsMaterial({
    size: 0.16,
    map: fireflyTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  fireflySystem = new THREE.Points(fireflyGeo, fireflyMat);
  scene.add(fireflySystem);
}

// 10. Event Listeners
function setupEventListeners() {
  const container = document.getElementById('canvas-container');

  // Intro Tap Controller
  const introOverlay = document.getElementById('intro-sequence');
  introOverlay.addEventListener('pointerdown', (e) => {
    e.stopPropagation(); // prevent raycaster firing on background
    advanceIntro();
  });

  // Track start positions to filter clicks vs swipes
  container.addEventListener('pointerdown', (e) => {
    startPoint.x = e.clientX;
    startPoint.y = e.clientY;
    startTime = Date.now();
  });

  container.addEventListener('pointerup', (e) => {
    const endX = e.clientX;
    const endY = e.clientY;
    const dist = Math.hypot(endX - startPoint.x, endY - startPoint.y);
    const duration = Date.now() - startTime;

    // Filter Tap: Move distance < 6px, and speed fast (< 250ms)
    if (dist < 6 && duration < 250) {
      handlePointerTap(e);
    }
  });

  // UI Event Listeners
  document.getElementById('close-btn').addEventListener('click', resetCamera);
  document.getElementById('back-grove-btn').addEventListener('click', resetCamera);
  document.getElementById('next-wish-btn').addEventListener('click', loadNextWish);
  
  // Set up background music trigger
  const audioToggle = document.getElementById('audio-toggle');
  audioToggle.style.display = 'flex';
  audioToggle.classList.add('muted'); // Starts in a muted state
  audioToggle.addEventListener('click', toggleAudio);

  // Resize Listener
  window.addEventListener('resize', onWindowResize);
}

// 11. State Machine: Advance Minimalist Intro Screen on Taps
function advanceIntro() {
  if (appState !== 'INTRO_PHASE') return;
  
  // Trigger background audio element loop play on the first touch (browser safety restriction bypass)
  const bgMusic = document.getElementById('bg-music');
  if (bgMusic && bgMusic.paused) {
    bgMusic.volume = 0.16; // Extremely quiet, soft, and pleasant baseline volume
    bgMusic.play().catch(err => console.log("Audio play blocked:", err));
    
    // Sync the bottom right audio button visual state
    const audioToggle = document.getElementById('audio-toggle');
    audioToggle.classList.remove('muted');
    isMuted = false;
    
    // Initialize audio context for synthesized tap chime accents
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  }

  introStep++;

  // Update Progress bar
  const progressFill = document.getElementById('intro-progress');
  if (progressFill) {
    const percentage = Math.min((introStep + 1) * 25, 100);
    progressFill.style.width = `${percentage}%`;
  }

  if (introStep < introTexts.length) {
    const introTextEl = document.getElementById('intro-text');
    // Smooth transition
    introTextEl.classList.remove('intro-text-active');
    
    setTimeout(() => {
      introTextEl.textContent = introTexts[introStep];
      introTextEl.classList.add('intro-text-active');
      // Serene chime tone accompanying text transitions
      triggerChimeTone(300 + introStep * 80);
    }, 400);
  } else {
    revealGrove();
  }
}

// Transition from Intro to 3D Scene
function revealGrove() {
  appState = 'TREE_PHASE';
  
  // Hide Intro overlay
  const introOverlay = document.getElementById('intro-sequence');
  introOverlay.classList.add('fade-out');

  // Fade in Canvas, Header, and Instruction toast in CSS
  document.body.classList.add('grove-revealed');

  // Sweep transition: zoom camera from dynamic coordinates down to standard default position
  controls.enabled = false;
  camera.position.set(-10, 11, 15);
  controls.target.copy(defaultTarget);
  controls.update();

  gsap.to(camera.position, {
    x: defaultCamPos.x,
    y: defaultCamPos.y,
    z: defaultCamPos.z,
    duration: 3.4,
    ease: "power2.out",
    onUpdate: () => controls.update(),
    onComplete: () => {
      controls.enabled = true;
    }
  });

  // Gorgeous arpeggio synthesized chime chord swell on entering grove
  triggerChimeTone(440); // A4
  setTimeout(() => triggerChimeTone(554.37), 160); // C#5
  setTimeout(() => triggerChimeTone(659.25), 320); // E5
}

// 12. Tap raycaster
function handlePointerTap(e) {
  if (appState !== 'TREE_PHASE') return; // restrict clicks during intro

  if (isZoomed && currentZoomedOrb) {
    const clickedOrb = checkOrbIntersection(e);
    if (clickedOrb && clickedOrb !== currentZoomedOrb) {
      zoomToOrb(clickedOrb);
    }
    return;
  }

  const clickedOrb = checkOrbIntersection(e);
  if (clickedOrb) {
    zoomToOrb(clickedOrb);
  }
}

function checkOrbIntersection(e) {
  const rect = renderer.domElement.getBoundingClientRect();
  mouseVector.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouseVector.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouseVector, camera);
  const intersects = raycaster.intersectObjects(orbsArray);

  if (intersects.length > 0) {
    return intersects[0].object;
  }
  return null;
}

// 13. Camera zoom transition
function zoomToOrb(orbMesh) {
  isZoomed = true;
  currentZoomedOrb = orbMesh;

  // Release other captured orbs, and capture the targeted one to stabilize it for reading!
  orbsArray.forEach(o => o.userData.isCaptured = false);
  orbMesh.userData.isCaptured = true;
  orbMesh.userData.basePos.copy(orbMesh.position); // Lock current coordinates

  controls.enabled = false;
  
  const targetCamPos = new THREE.Vector3();
  const dir = new THREE.Vector3().subVectors(camera.position, orbMesh.position).normalize();
  
  dir.y += 0.2;
  dir.normalize();
  
  targetCamPos.copy(orbMesh.position).addScaledVector(dir, 2.2);

  // GSAP Camera Position
  gsap.killTweensOf(camera.position);
  gsap.to(camera.position, {
    x: targetCamPos.x,
    y: targetCamPos.y,
    z: targetCamPos.z,
    duration: 1.4,
    ease: "power2.inOut",
    onUpdate: () => controls.update()
  });

  // GSAP Target Position
  gsap.killTweensOf(controls.target);
  gsap.to(controls.target, {
    x: orbMesh.position.x,
    y: orbMesh.position.y,
    z: orbMesh.position.z,
    duration: 1.4,
    ease: "power2.inOut",
    onUpdate: () => controls.update(),
    onComplete: () => {
      controls.enabled = true; // allow close-up orb orbiting
      displayWishOverlay(orbMesh.userData.wish, orbMesh.userData.index);
    }
  });

  // Hide instructional toast
  gsap.to("#instruction-toast", { opacity: 0, duration: 0.4 });
  
  // High quality bell tone accent on tap
  triggerChimeTone(450 + Math.random() * 500);
}

function resetCamera() {
  controls.enabled = false;
  hideWishOverlay();

  // Release captured state to let orbs resume their playful circular dance!
  orbsArray.forEach(o => o.userData.isCaptured = false);

  // Return to overview
  gsap.killTweensOf(camera.position);
  gsap.to(camera.position, {
    x: defaultCamPos.x,
    y: defaultCamPos.y,
    z: defaultCamPos.z,
    duration: 1.5,
    ease: "power2.inOut",
    onUpdate: () => controls.update()
  });

  gsap.killTweensOf(controls.target);
  gsap.to(controls.target, {
    x: defaultTarget.x,
    y: defaultTarget.y,
    z: defaultTarget.z,
    duration: 1.5,
    ease: "power2.inOut",
    onUpdate: () => controls.update(),
    onComplete: () => {
      controls.enabled = true;
      isZoomed = false;
      currentZoomedOrb = null;
    }
  });

  // Show instruction toast
  gsap.to("#instruction-toast", { opacity: 1, duration: 0.6 });
  
  triggerChimeTone(300);
}

// 14. UI overlay card display
function displayWishOverlay(wish, index) {
  const container = document.getElementById('wish-overlay-container');
  const wishText = document.getElementById('wish-text');
  const wishAuthor = document.getElementById('wish-author');

  wishText.textContent = wish.message;
  wishAuthor.textContent = `— ${wish.author}`;

  container.classList.add('active');
  
  // Premium bouncy scaling visual intro
  gsap.fromTo("#wish-card", 
    { scale: 0.8, opacity: 0 }, 
    { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.2)" }
  );
}

function hideWishOverlay() {
  const container = document.getElementById('wish-overlay-container');
  
  gsap.to("#wish-card", { 
    scale: 0.85, 
    opacity: 0, 
    duration: 0.4, 
    ease: "power2.in",
    onComplete: () => {
      container.classList.remove('active');
    }
  });
}

function loadNextWish() {
  if (!currentZoomedOrb) return;

  const currentIdx = currentZoomedOrb.userData.index;
  const nextIdx = (currentIdx + 1) % wishData.length;
  const nextOrb = orbsArray[nextIdx];

  gsap.to("#wish-card", {
    scale: 0.85,
    opacity: 0,
    duration: 0.35,
    ease: "power2.in",
    onComplete: () => {
      document.getElementById('wish-overlay-container').classList.remove('active');
      zoomToOrb(nextOrb);
    }
  });
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 15. Physics Loop
function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();

  // Sprawling tree flexing/rotation
  if (treeGroup) {
    treeGroup.rotation.y = time * 0.035;
    treeGroup.updateMatrixWorld(true);
  }

  // Playful Floating Wish Orbs anchored to the canopy tips
  orbsArray.forEach((orb) => {
    const phase = orb.userData.phase;
    
    if (!orb.userData.isCaptured) {
      orb.userData.orbitAngle = orb.userData.orbitBaseAngle + Math.sin(time * orb.userData.orbitSpeed + orb.userData.orbitPhase) * orb.userData.orbitWobble;
      const anchoredPos = new THREE.Vector3(
        Math.cos(orb.userData.orbitAngle) * orb.userData.orbitRadius,
        orb.userData.orbitHeight + Math.sin(time * 1.15 + phase) * 0.08,
        Math.sin(orb.userData.orbitAngle) * orb.userData.orbitRadius
      );
      if (treeGroup) {
        treeGroup.localToWorld(anchoredPos);
      }
      orb.position.copy(anchoredPos);
    } else {
      orb.position.y = orb.userData.basePos.y + Math.sin(time * 1.0 + phase) * 0.03;
    }

    if (orb.userData.glowMesh) {
      orb.userData.glowMesh.position.copy(orb.position);
      const scaleWave = 1 + Math.sin(time * 3 + phase) * 0.1;
      orb.userData.glowMesh.scale.set(scaleWave, scaleWave, scaleWave);
    }
    const opacityPulse = 0.88 + Math.sin(time * 2.5 + phase) * 0.08;
    orb.material.opacity = opacityPulse;
    const corePulse = 1 + Math.sin(time * 2.4 + phase) * 0.05;
    orb.scale.setScalar(corePulse);
  });

  // Drifting Fireflies
  if (fireflySystem) {
    const positions = fireflyGeo.attributes.position.array;
    for (let i = 0; i < fireflyCount; i++) {
      positions[i * 3 + 1] += fireflySpeeds[i].y;
      positions[i * 3]     += Math.sin(time * 0.8 + fireflySpeeds[i].phase) * 0.005 + fireflySpeeds[i].x;
      positions[i * 3 + 2] += Math.cos(time * 0.8 + fireflySpeeds[i].phase) * 0.005 + fireflySpeeds[i].z;
      if (positions[i * 3 + 1] > 7.5) {
        positions[i * 3 + 1] = 0.2 + Math.random() * 0.5;
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.3 + Math.random() * 4.0;
        positions[i * 3]     = Math.cos(angle) * radius;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }
    }
    fireflyGeo.attributes.position.needsUpdate = true;
  }

  // ── Animate Butterflies ──
  butterflies.forEach((bf) => {
    const t = time * bf.speed;
    bf.angle += bf.speed * 0.012;

    // Circular flight path with gentle bobbing
    const bx = Math.cos(bf.angle) * bf.radius;
    const bz = Math.sin(bf.angle) * bf.radius;
    const by = bf.yBase + Math.sin(time * 1.8 + bf.yPhase) * 0.5;

    bf.group.position.set(bx, by, bz);

    // Face direction of travel (tangent to circle)
    bf.group.rotation.y = -bf.angle - Math.PI / 2;

    // Wing flapping — rotate wings around x-axis
    const flapAngle = Math.sin(time * 6 + bf.phase) * 0.75;
    bf.wingL.rotation.y  =  flapAngle;
    bf.wingR.rotation.y  = -flapAngle;
    bf.wingLL.rotation.y =  flapAngle * 0.7;
    bf.wingRL.rotation.y = -flapAngle * 0.7;
  });

  // ── Animate Birds ──
  birds.forEach((bd) => {
    bd.angle += bd.speed * 0.008;

    const bx = Math.cos(bd.angle) * bd.radius;
    const bz = Math.sin(bd.angle) * bd.radius;
    const by = bd.yBase + Math.sin(time * 0.6 + bd.phase) * 1.2; // graceful swooping

    bd.group.position.set(bx, by, bz);
    bd.group.rotation.y = -bd.angle - Math.PI / 2;

    // Wing flap
    const flapA = Math.sin(time * 4 + bd.phase) * 0.5;
    bd.wL.rotation.y =  flapA;
    bd.wR.rotation.y = -flapA;
  });

  // ── Animate Deer (gentle grazing wander) ──
  deer.forEach((d) => {
    d.angle += d.speed * 0.006;
    const dx = Math.cos(d.angle) * d.radius;
    const dz = Math.sin(d.angle) * d.radius;
    d.group.position.set(dx, -1.1, dz);
    d.group.rotation.y = -d.angle - Math.PI / 2;
    // Gentle head bob (grazing motion)
    const headBob = Math.sin(time * 0.8 + d.phase) * 0.08;
    if (d.group.children[1]) d.group.children[1].position.y = 1.45 + headBob;
    if (d.group.children[2]) d.group.children[2].position.y = 1.78 + headBob;
    if (d.group.children[3]) d.group.children[3].position.y = 1.7  + headBob;
  });

  controls.update();
  renderer.render(scene, camera);
}

// 16. Audio System Integration
function toggleAudio() {
  const btn = document.getElementById('audio-toggle');
  const bgMusic = document.getElementById('bg-music');
  
  if (isMuted) {
    if (bgMusic) {
      bgMusic.muted = false;
      bgMusic.volume = 0.16; // Ensure volume stays quiet, soft, and pleasant on toggle
      if (bgMusic.paused) {
        bgMusic.play().catch(err => console.log("Audio resume blocked: ", err));
      }
    }
    isMuted = false;
    btn.classList.remove('muted');
    
    // Initialize Web Audio context for click accent tones
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
  } else {
    if (bgMusic) {
      bgMusic.muted = true;
    }
    isMuted = true;
    btn.classList.add('muted');
  }
}

// Synthesized High-Quality Chime Tone (used for accents during taps/clicks)
function triggerChimeTone(frequency) {
  if (!audioCtx || isMuted) return;

  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(frequency * 1.6, audioCtx.currentTime);

  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  // Extremely soft peak volume (0.015 instead of 0.08) for a pleasant, delicate bell chime
  gainNode.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.0);

  osc.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 4.1);
}
