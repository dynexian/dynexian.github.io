/* ----------------------------------------------------
   THE GLOWING GROVE — THREE.JS & GSAP INTERACTIVE LOGIC
   ---------------------------------------------------- */

// 1. Wish Data Array
const wishData = [
  {
    author: "From Shubham",
    message: "...carrying a blazing, protective heart underneath it all. A truly rare kind of person."
  },
  {
    author: "Also from Shubham",
    message: "Time goes by so fast, and we are nearly adults now. I may not know this exact version of you today..."
  },
  {
    author: "Still me, hehe",
    message: "...but I admire all of you. Your past, your present, and your future. What I know, and even what I don't."
  },
  {
    author: "Shubham",
    message: "I know you've always been the one looking out for your family. I wish that you and all your loved ones are doing incredibly well. Please send them my regards."
  },
  {
    author: "Your well-wisher, Shubham",
    message: "Happy 22nd Birthday, Arpit. Just know you will always have a place in my life, hehe."
  }
];

// 2. Global State Variables
let scene, camera, renderer, controls;
let treeGroup, fireflySystem, fireflyGeo;
const orbsArray = [];
const glowMeshes = [];
let fireflyCount = 40;

// Lighting Objects
let mainAmbientLight, mainDirLight, mainFillLight, mainRimLight, secondaryHemisphereLight, foliageLight;

let petalsMesh;
const petalsData = [];
const koiArray = [];

// Mobile detection
const isMobile = (typeof navigator !== 'undefined') && (/Mobi|Android|iPhone|iPad/.test(navigator.userAgent) || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches));
const fireflySpeeds = [];
const nightFireflySpeeds = [];

// Surroundings state
const butterflies = [];   // { group, wingL, wingR, phase, radius, speed, yBase }
const birds = [];         // { group, phase, radius, yBase, speed }
const pandas = [];        // { group, phase, speed, radius }

// Night Mode State
let isNightMode = false;
let nightModeTransition = 0; // 0 (Day) to 1 (Night)
const glowMaterials = []; // Materials to turn glowing orange at night
let nightFireflySystem, nightFireflyGeo;
const fireworks = []; // Array of active firework particle systems

// App State Machine
let appState = 'INTRO_PHASE'; // 'INTRO_PHASE' | 'TREE_PHASE'
let introStep = 0;
const introTexts = [
  "Out of the hundred billion people who have ever lived on this planet...",
  "...I happened to meet you. Among trillions of cosmic exceptions, your existence is one truly worth celebrating.",
  "You've been here for 22 years now. That’s 8,035.5 days. 192,852 hours. 11,571,120 minutes. 694,267,200 seconds. (I don't know your exact birth time, so this one's rounded, hehe).",
  "I’ve always admired your hardened ways of doing things. Building from scratch, manually crafting 3D models and art, pulling things apart just to truly understand and learn them.",
  "You look at nature and the world with a uniquely beautiful perspective. You’ve been through a lot silently, yet you remained peaceful, calm, and quiet..."
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
  setLoaderProgress(5, 'Waking up the garden…');
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
  setLoaderProgress(36, 'Filling the canopy with cherry blossoms…');
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
  setLoaderProgress(72, 'Carving the stone lanterns…');
  await nextFrame();
  buildSurroundings();

  // Step 7 — Butterflies
  setLoaderProgress(84, 'Calling the cranes and koi…');
  await nextFrame();
  spawnButterflies();

  // Step 8 — Animals
  setLoaderProgress(93, 'Waking the deer and birds…');
  await nextFrame();
  spawnAnimals();

  // Step 9 — Event listeners + intro text
  setLoaderProgress(100, 'The path is ready ✨');
  await nextFrame();
  setupEventListeners();
  document.getElementById('intro-text').textContent = introTexts[0];
  animate(); // start the render loop

  // Brief pause so user sees 100%, then show Enter button
  await new Promise(r => setTimeout(r, 600));
  
  const barWrap = document.getElementById('loader-bar-wrap');
  const statusTxt = document.getElementById('loader-status');
  const enterBtn = document.getElementById('enter-garden-btn');
  
  if (barWrap) barWrap.style.display = 'none';
  if (statusTxt) statusTxt.style.display = 'none';
  
  if (enterBtn) {
    enterBtn.style.display = 'inline-block';
    enterBtn.addEventListener('click', () => {
      // Start music directly on Enter click to satisfy browser audio restrictions
      const bgMusic = document.getElementById('bg-music');
      if (bgMusic && bgMusic.paused) {
        bgMusic.volume = 0.16;
        bgMusic.play().catch(err => console.log("Audio play blocked:", err));
        
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) audioToggle.classList.remove('muted');
        isMuted = false;
        
        if (!audioCtx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          audioCtx = new AudioContext();
        }
      }
      hideLoader();
    });
  } else {
    hideLoader();
  }
}

// 4. Initialize Three.js Environment
function initThree() {
  const container = document.getElementById('canvas-container');
  
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87CEEB); // Fixes the dark sky by painting the 3D void
  scene.fog = new THREE.FogExp2(0x87CEEB, 0.01); // Soft sky blue fog for daytime

  // Camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  // Start in dynamic viewing position
  camera.position.set(-10, 12, 16);
  // Mobile: wider FOV and closer framing
  if (isMobile) {
    camera.fov = 65;
    // Move the camera further back on mobile so header + scene + gate fit perfectly
    defaultCamPos.set(0, 5.2, 16);
    defaultTarget.set(0, 2.4, 0);
    camera.position.set(0, 7, 22);
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
  controls.maxDistance = 24; // Increased so user can zoom out and see the whole gate
  controls.target.copy(defaultTarget);
  controls.update();
}

// 5a. Build Lights
function buildLights() {
  // Soft pink ambient for warm dawn
  mainAmbientLight = new THREE.AmbientLight(0xf7dcec, 0.22);
  scene.add(mainAmbientLight);

  // Warm white key light to simulate early morning sun
  mainDirLight = new THREE.DirectionalLight(0xfff4e6, 1.6);
  mainDirLight.position.set(-11, 8, 8);
  mainDirLight.castShadow = true;
  mainDirLight.shadow.mapSize.width = isMobile ? 512 : 1024;
  mainDirLight.shadow.mapSize.height = isMobile ? 512 : 1024;
  mainDirLight.shadow.camera.near = 1;
  mainDirLight.shadow.camera.far = 40;
  mainDirLight.shadow.camera.left = -18;
  mainDirLight.shadow.camera.right = 18;
  mainDirLight.shadow.camera.top = 18;
  mainDirLight.shadow.camera.bottom = -18;
  mainDirLight.shadow.bias = -0.0008;
  mainDirLight.shadow.normalBias = 0.03;
  scene.add(mainDirLight);

  // Warm hemisphere fill: soft rosy sky and muted ground
  mainFillLight = new THREE.HemisphereLight(0xf7cfe8, 0x2f241f, 0.64);
  scene.add(mainFillLight);

  // Gentle warm rim to accent edges and give a faint dawn glow
  mainRimLight = new THREE.PointLight(0xffd9c8, 0.6, 18, 2);
  mainRimLight.position.set(0, 7, -10);
  scene.add(mainRimLight);
  
  secondaryHemisphereLight = new THREE.HemisphereLight(0xffe6f0, 0x2f241f, 0.12);
  scene.add(secondaryHemisphereLight);
}

// 5c. Canopy internal glow point light
function buildCanopyGlow() {
  foliageLight = new THREE.PointLight(0xfff6ee, 1.2, 12);
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
      if (treeGroup) {
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
      if (treeGroup) {
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
    if (treeGroup) {
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
    if (treeGroup) {
      const localP = mesh.position.clone();
      treeGroup.worldToLocal(localP);
      mesh.position.copy(localP);
    }
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    foliageGroup.add(mesh);
  }

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
// 8b. LIVING WORLD — Japanese Garden Surroundings
// ═══════════════════════════════════════════════════════

function buildSurroundings() {
  // ── Ground plane (Mossy) ──
  const groundGeo = new THREE.CircleGeometry(38, 12);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x2d5016,
    roughness: 0.95,
    metalness: 0.0,
    flatShading: true
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.1;
  ground.receiveShadow = true;
  scene.add(ground);
  
  // ── Hidden Grass Message (Easter Egg) ──
  const hiddenCanvas = document.createElement('canvas');
  hiddenCanvas.width = 1024;
  hiddenCanvas.height = 256;
  const hCtx = hiddenCanvas.getContext('2d');
  hCtx.fillStyle = 'rgba(0,0,0,0)'; // Transparent background
  hCtx.fillRect(0, 0, 1024, 256);
  hCtx.fillStyle = '#1a300d'; // Subtle dark green to blend into the moss (0x2d5016)
  hCtx.font = 'bold 90px "Comic Sans MS", cursive';
  hCtx.textAlign = 'center';
  hCtx.textBaseline = 'middle';
  hCtx.fillText("psst... happy birthday!", 512, 128);
  
  const hiddenTex = new THREE.CanvasTexture(hiddenCanvas);
  hiddenTex.needsUpdate = true;
  const hiddenMat = new THREE.MeshBasicMaterial({ 
    map: hiddenTex, 
    transparent: true, 
    opacity: 0.35, // Very subtle
    depthWrite: false
  });
  const hiddenMesh = new THREE.Mesh(new THREE.PlaneGeometry(10, 2.5), hiddenMat);
  hiddenMesh.rotation.x = -Math.PI / 2;
  hiddenMesh.position.set(0, -1.09, 14); // Right at camera spawn, before Torii gate
  scene.add(hiddenMesh);

  const pathGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 6);
  const pathMat = new THREE.MeshStandardMaterial({ color: 0x7a7a8a, roughness: 0.9, flatShading: true });
  const mainPathCount = 42;
  const shrineBranchCount = 14;
  const pondBranchCount = 10;
  const pathCount = mainPathCount + shrineBranchCount + pondBranchCount;
  
  const pathMesh = new THREE.InstancedMesh(pathGeo, pathMat, pathCount);
  const dummy = new THREE.Object3D();
  let globalPathIdx = 0;
  
  // 1. Main sweeping curve from Gate to Teahouse
  for (let i = 0; i < mainPathCount; i++) {
    const t = i / (mainPathCount - 1);
    
    // Cubic Bezier Formula
    const mt = 1 - t;
    const xPos = 3 * mt * (t*t) * (-16);
    // End Z at -12.5 so it hits the bottom of the Teahouse stairs perfectly
    const zPos = (mt*mt*mt)*11.5 + 3*(mt*mt)*t*(4) + 3*mt*(t*t)*(-2) + (t*t*t)*(-12.5);
    
    const jitterX = Math.sin(t * Math.PI * 8) * 0.3;
    const jitterZ = Math.cos(t * Math.PI * 8) * 0.3;

    dummy.position.set(xPos + jitterX, -1.05, zPos + jitterZ);
    dummy.rotation.set(0, Math.random()*Math.PI, 0);
    dummy.scale.set(1 + Math.random()*0.4, 1, 1 + Math.random()*0.4);
    dummy.updateMatrix();
    pathMesh.setMatrixAt(globalPathIdx++, dummy.matrix);
  }
  
  // 2. Branch Path to Pagoda Shrines (Forks perfectly from the main path at t=0.3)
  for (let i = 0; i < shrineBranchCount; i++) {
    const t = i / (shrineBranchCount - 1);
    const startX = -3.02; // Exact X coordinate on main curve at t=0.3
    const startZ = 4.99;  // Exact Z coordinate on main curve at t=0.3
    const endX = -12.0;
    const endZ = 8.0;
    
    const xPos = startX + (endX - startX) * t;
    const zPos = startZ + (endZ - startZ) * t + Math.sin(t * Math.PI) * 1.5;

    const jitterX = Math.sin(t * Math.PI * 4) * 0.2;
    const jitterZ = Math.cos(t * Math.PI * 4) * 0.2;

    dummy.position.set(xPos + jitterX, -1.05, zPos + jitterZ);
    dummy.rotation.set(0, Math.random()*Math.PI, 0);
    dummy.scale.set(0.8 + Math.random()*0.3, 1, 0.8 + Math.random()*0.3); // slightly smaller stones
    dummy.updateMatrix();
    pathMesh.setMatrixAt(globalPathIdx++, dummy.matrix);
  }

  // 3. Branch Path to Koi Pond (Connects the Teahouse directly to the Pond)
  for (let i = 0; i < pondBranchCount; i++) {
    const t = i / (pondBranchCount - 1);
    // Quadratic Bezier from Teahouse to Pond edge
    // P0(0, -12.5), P1(6, -10), P2(8, -3)
    const xPos = Math.pow(1 - t, 2) * 0 + 2 * (1 - t) * t * 6 + Math.pow(t, 2) * 8;
    const zPos = Math.pow(1 - t, 2) * -12.5 + 2 * (1 - t) * t * -10 + Math.pow(t, 2) * -3;

    const jitterX = Math.sin(t * Math.PI * 3) * 0.2;
    const jitterZ = Math.cos(t * Math.PI * 3) * 0.2;

    dummy.position.set(xPos + jitterX, -1.05, zPos + jitterZ);
    dummy.rotation.set(0, Math.random()*Math.PI, 0);
    dummy.scale.set(0.8 + Math.random()*0.3, 1, 0.8 + Math.random()*0.3);
    dummy.updateMatrix();
    pathMesh.setMatrixAt(globalPathIdx++, dummy.matrix);
  }
  pathMesh.receiveShadow = true;
  scene.add(pathMesh);

  // ── Mountain Ring Background ──
  const mountainGroup = new THREE.Group();
  const mountainCount = 24;
  for (let i = 0; i < mountainCount; i++) {
    const angle = (i / mountainCount) * Math.PI * 2;
    const dist = 34 + Math.random() * 10;
    const mx = Math.cos(angle) * dist;
    const mz = Math.sin(angle) * dist;
    const mHeight = 12 + Math.random() * 12;
    const mRadius = 8 + Math.random() * 6;

    const geo = new THREE.ConeGeometry(mRadius, mHeight, 6);
    const mat = new THREE.MeshStandardMaterial({ color: 0x16213e, roughness: 0.9, flatShading: true });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(mx, -1.1 + mHeight/2, mz);
    mesh.rotation.y = Math.random() * Math.PI;
    
    // Snow cap
    if (mHeight > 16) {
      const capGeo = new THREE.ConeGeometry(mRadius * 0.45, mHeight * 0.45, 6);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.9, flatShading: true });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(0, mHeight/2 - mHeight*0.22, 0);
      cap.scale.set(1.02, 1.0, 1.02); // Scale outwards slightly to completely eliminate Z-fighting
      mesh.add(cap);
    }
    
    // Slight jitter to vertices
    const pos = geo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      if (pos.getY(v) < mHeight/2 - 1) {
        pos.setXYZ(v, pos.getX(v)*(1+(Math.random()-0.5)*0.1), pos.getY(v), pos.getZ(v)*(1+(Math.random()-0.5)*0.1));
      }
    }
    pos.needsUpdate = true;
    mountainGroup.add(mesh);
  }
  scene.add(mountainGroup);

  // ── Torii Gate ──
  const toriiGroup = new THREE.Group();
  const toriiMat = new THREE.MeshStandardMaterial({ color: 0xe94560, roughness: 0.7, metalness: 0.1 });
  const toriiBaseMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9 });
  
  // Pillars
  const pillarGeo = new THREE.CylinderGeometry(0.2, 0.2, 3.5, 8);
  const p1 = new THREE.Mesh(pillarGeo, toriiMat); p1.position.set(-1.5, 1.75, 0);
  const p2 = new THREE.Mesh(pillarGeo, toriiMat); p2.position.set(1.5, 1.75, 0);
  // Bases
  const baseGeo = new THREE.BoxGeometry(0.6, 0.4, 0.6);
  const b1 = new THREE.Mesh(baseGeo, toriiBaseMat); b1.position.set(-1.5, 0.2, 0);
  const b2 = new THREE.Mesh(baseGeo, toriiBaseMat); b2.position.set(1.5, 0.2, 0);
  // Top beams
  const beam1Geo = new THREE.BoxGeometry(4.2, 0.25, 0.3);
  const beam1 = new THREE.Mesh(beam1Geo, toriiMat); beam1.position.set(0, 3.4, 0);
  const beam2Geo = new THREE.BoxGeometry(3.6, 0.2, 0.2);
  const beam2 = new THREE.Mesh(beam2Geo, toriiMat); beam2.position.set(0, 2.9, 0);
  // Center tie
  const tieGeo = new THREE.BoxGeometry(0.15, 0.5, 0.15);
  const tie = new THREE.Mesh(tieGeo, toriiMat); tie.position.set(0, 3.15, 0);
  
  toriiGroup.add(p1, p2, b1, b2, beam1, beam2, tie);
  toriiGroup.position.set(0, -1.1, 10); // Straddling the path, fully visible
  toriiGroup.castShadow = true;
  scene.add(toriiGroup);

  // ── Stone Lanterns (Toro) ──
  const lanternMat = new THREE.MeshStandardMaterial({ color: 0x7a7a8a, roughness: 0.9, flatShading: true });
  const lanternPositions = [
    { x: -2.5, z: 10.2 },
    { x: 2.5, z: 10.2 }
  ];
  lanternPositions.forEach(lp => {
    const lGroup = new THREE.Group();
    const lBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 6), lanternMat);
    lBase.position.y = 0.6;
    const lMid = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.1, 0.8), lanternMat);
    lMid.position.y = 1.25;
    const lTop = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.4, 4), lanternMat);
    lTop.position.y = 1.8;
    lTop.rotation.y = Math.PI/4;
    
    // Light
    const lLight = new THREE.PointLight(0xffbe0f, 1.0, 5);
    lLight.position.set(0, 1.5, 0);
    const lGlow = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshBasicMaterial({color: 0xffbe0f}));
    lGlow.position.y = 1.5;
    
    lGroup.add(lBase, lMid, lTop, lLight, lGlow);
    lGroup.position.set(lp.x, -1.1, lp.z);
    scene.add(lGroup);
  });

  // ── Koi Pond ──
  const pondGroup = new THREE.Group();
  const pondGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.2, 16);
  const pondMat = new THREE.MeshStandardMaterial({ 
    color: 0x4facfe, 
    roughness: 0.2, 
    metalness: 0.3,
    transparent: true,
    opacity: 0.85
  });
  const pond = new THREE.Mesh(pondGeo, pondMat);
  pond.position.y = 0.1;
  pondGroup.add(pond);
  
  // Pond rocks border (organic, densely packed)
  const pondRockGeo = new THREE.IcosahedronGeometry(0.3, 0);
  const prCount = 90;
  const prMesh = new THREE.InstancedMesh(pondRockGeo, lanternMat, prCount);
  for(let i=0; i<prCount; i++) {
    // Add jitter to angle and radius for organic overlap
    const angle = (i/prCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
    const rad = 4.3 + Math.random() * 0.5;
    dummy.position.set(Math.cos(angle)*rad, Math.random()*0.15, Math.sin(angle)*rad);
    dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
    dummy.scale.set(0.5 + Math.random(), 0.5 + Math.random()*0.5, 0.5 + Math.random());
    dummy.updateMatrix();
    prMesh.setMatrixAt(i, dummy.matrix);
  }
  pondGroup.add(prMesh);

  // Lily Pads
  const lilyMat = new THREE.MeshStandardMaterial({ color: 0x4fa03a, roughness: 0.9, flatShading: true });
  const lilyGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.05, 8);
  for(let i=0; i<12; i++) {
    const lAngle = Math.random() * Math.PI * 2;
    const lRad = Math.random() * 3.8;
    const lily = new THREE.Mesh(lilyGeo, lilyMat);
    lily.position.set(Math.cos(lAngle)*lRad, 0.12, Math.sin(lAngle)*lRad);
    lily.scale.setScalar(0.5 + Math.random() * 0.8);
    lily.rotation.y = Math.random() * Math.PI;
    pondGroup.add(lily);
  }

  pondGroup.position.set(12, -1.15, -2); // Moved right/back
  scene.add(pondGroup);
  
  // Save pond position for koi animation
  pondGroup.userData.center = new THREE.Vector3(12, -1.15, -2);

  // ── Japanese Pagoda Shrines ──
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a2e15, roughness: 0.9 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, flatShading: true });

  const createShrine = (x, z, ry) => {
    const sGroup = new THREE.Group();
    const sBase = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 4), woodMat);
    sBase.position.y = 0.2;
    sGroup.add(sBase);
    const pillarPos = [[-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5], [1.5, 1.5]];
    pillarPos.forEach(([px, pz]) => {
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 2.5, 4), woodMat);
      pillar.position.set(px, 1.5, pz);
      sGroup.add(pillar);
    });
    const sanctum = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2, 2.5), new THREE.MeshStandardMaterial({ color: 0xdddddd }));
    sanctum.position.y = 1.4;
    sGroup.add(sanctum);
    const roof1 = new THREE.Mesh(new THREE.ConeGeometry(3.5, 1.5, 4), roofMat);
    roof1.position.y = 3.2;
    roof1.rotation.y = Math.PI / 4;
    sGroup.add(roof1);
    const roof2 = new THREE.Mesh(new THREE.ConeGeometry(2.5, 1.2, 4), roofMat);
    roof2.position.y = 4.2;
    roof2.rotation.y = Math.PI / 4;
    sGroup.add(roof2);
    sGroup.position.set(x, -1.15, z);
    sGroup.rotation.y = ry;
    scene.add(sGroup);
  };
  createShrine(-14, 5, Math.PI / 8);
  createShrine(-12, 11, Math.PI / 6);

  // ── Grand Teahouse (Highly Detailed) ──
  const teahouseGroup = new THREE.Group();
  const thWhiteMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.9 });
  const thRedMat = new THREE.MeshStandardMaterial({ color: 0xd92525, roughness: 0.8 }); // Vibrant red
  const thRoofMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, flatShading: true });
  const thWoodMat = new THREE.MeshStandardMaterial({ color: 0x2e1b0d, roughness: 0.9 }); // Dark wood for windows/doors
  thWoodMat.userData = { originalColor: new THREE.Color(0x2e1b0d), glowColor: new THREE.Color(0xffaa00), isStandard: true };
  glowMaterials.push(thWoodMat);
  
  // Stone Base
  const thBase = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.4, 6.4), new THREE.MeshStandardMaterial({ color: 0x666666 }));
  thBase.position.y = 0.2;
  teahouseGroup.add(thBase);

  // Front Stone Stairs
  const thStairsMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.9 });
  const step1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.15, 0.6), thStairsMat);
  step1.position.set(0, 0.075, 3.5);
  const step2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.3, 0.6), thStairsMat);
  step2.position.set(0, 0.15, 2.9);
  teahouseGroup.add(step1, step2);

  // First Floor Main Building (White Walls)
  const thFloor1 = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.5, 5.2), thWhiteMat);
  thFloor1.position.y = 1.65;
  teahouseGroup.add(thFloor1);

  // First Floor Red Pillars & Horizontal Trim
  const thPillarPos = [[-2.7, -2.7], [2.7, -2.7], [-2.7, 2.7], [2.7, 2.7], 
                       [-1.35, 2.7], [1.35, 2.7], [-1.35, -2.7], [1.35, -2.7],
                       [-2.7, 1.35], [-2.7, -1.35], [2.7, 1.35], [2.7, -1.35]];
  thPillarPos.forEach(([px, pz]) => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.6, 0.2), thRedMat);
    pillar.position.set(px, 1.65, pz);
    teahouseGroup.add(pillar);
  });
  
  // Horizontal Red Trim (Mid-level and Top)
  const trim1 = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.15, 5.6), thRedMat);
  trim1.position.y = 1.65;
  const trim2 = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.2, 5.6), thRedMat);
  trim2.position.y = 2.85;
  teahouseGroup.add(trim1, trim2);

  // First Floor Dark Wood Windows/Doors
  // Front doors
  const doorGeo = new THREE.BoxGeometry(1.6, 1.8, 0.1);
  const door1 = new THREE.Mesh(doorGeo, thWoodMat); door1.position.set(0, 1.3, 2.65);
  // Side windows
  const winGeo = new THREE.BoxGeometry(0.1, 1.2, 1.8);
  const win1 = new THREE.Mesh(winGeo, thWoodMat); win1.position.set(2.65, 2.0, 0);
  const win2 = new THREE.Mesh(winGeo, thWoodMat); win2.position.set(-2.65, 2.0, 0);
  teahouseGroup.add(door1, win1, win2);

  // First Floor Roof (Tiered)
  const thRoof1a = new THREE.Mesh(new THREE.ConeGeometry(5.2, 1.5, 4), thRoofMat);
  thRoof1a.position.y = 3.6;
  thRoof1a.rotation.y = Math.PI / 4;
  thRoof1a.scale.set(1, 0.7, 1);
  
  const thRoof1b = new THREE.Mesh(new THREE.ConeGeometry(5.5, 0.5, 4), thRoofMat);
  thRoof1b.position.y = 3.2;
  thRoof1b.rotation.y = Math.PI / 4;
  teahouseGroup.add(thRoof1a, thRoof1b);

  // Second Floor (Balcony Level)
  const thFloor2 = new THREE.Mesh(new THREE.BoxGeometry(3.8, 2.0, 3.8), thWhiteMat);
  thFloor2.position.y = 5.2;
  teahouseGroup.add(thFloor2);
  
  // Second floor pillars
  const thPillarPos2 = [[-2.0, -2.0], [2.0, -2.0], [-2.0, 2.0], [2.0, 2.0]];
  thPillarPos2.forEach(([px, pz]) => {
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.0, 0.2), thRedMat);
    pillar.position.set(px, 5.2, pz);
    teahouseGroup.add(pillar);
  });
  
  // Balcony Base & Rails (Red)
  const balconyBase = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.2, 5.0), thRedMat);
  balconyBase.position.y = 4.2;
  teahouseGroup.add(balconyBase);
  
  // Detailed Balcony Railings
  const addBalconyRail = (x, z, width, depth) => {
    const railTop = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, depth), thRedMat);
    railTop.position.set(x, 4.8, z);
    teahouseGroup.add(railTop);
    
    // Slats
    const isX = width > depth;
    const count = Math.floor(isX ? width / 0.4 : depth / 0.4);
    const step = (isX ? width : depth) / count;
    for(let i=0; i<count; i++) {
        const slat = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.05), thRedMat);
        if(isX) {
            slat.position.set(x - width/2 + 0.2 + i*step, 4.5, z);
        } else {
            slat.position.set(x, 4.5, z - depth/2 + 0.2 + i*step);
        }
        teahouseGroup.add(slat);
    }
  };
  addBalconyRail(0, 2.4, 4.8, 0.1); // Front
  addBalconyRail(0, -2.4, 4.8, 0.1); // Back
  addBalconyRail(2.4, 0, 0.1, 4.8); // Right
  addBalconyRail(-2.4, 0, 0.1, 4.8); // Left

  // Second Floor Windows
  const winGeo2 = new THREE.BoxGeometry(1.6, 1.2, 0.1);
  const win3 = new THREE.Mesh(winGeo2, thWoodMat); win3.position.set(0, 5.2, 1.95);
  teahouseGroup.add(win3);

  // Second Floor Roof (Tiered)
  const thRoof2a = new THREE.Mesh(new THREE.ConeGeometry(4.0, 1.6, 4), thRoofMat);
  thRoof2a.position.y = 6.8;
  thRoof2a.rotation.y = Math.PI / 4;
  thRoof2a.scale.set(1, 0.8, 1);
  
  const thRoof2b = new THREE.Mesh(new THREE.ConeGeometry(4.3, 0.5, 4), thRoofMat);
  thRoof2b.position.y = 6.3;
  thRoof2b.rotation.y = Math.PI / 4;
  teahouseGroup.add(thRoof2a, thRoof2b);

  // Roof Finial Top & Accents
  const thFinial = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.5, 1.8), thRoofMat);
  thFinial.position.y = 7.5;
  const thFinialTop = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), thRoofMat);
  thFinialTop.position.y = 7.9;
  teahouseGroup.add(thFinial, thFinialTop);

  teahouseGroup.position.set(0, -1.15, -16); // Center back
  scene.add(teahouseGroup);

  // ── Mini Sakura Grove (Front-Right) ──
  // Replaces the Zen Rock Garden with something more lush and beautiful
  const miniGroveGroup = new THREE.Group();
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2314, roughness: 0.9 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0xffb7c5, roughness: 0.8, flatShading: true });
  
  const addMiniTree = (x, z, scale) => {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 1.5, 5), trunkMat);
    trunk.position.y = 0.75;
    const l1 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.8, 0), leafMat);
    l1.position.set(0, 1.6, 0);
    const l2 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.6, 0), leafMat);
    l2.position.set(0.4, 1.4, 0.4);
    const l3 = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 0), leafMat);
    l3.position.set(-0.4, 1.3, -0.3);
    tree.add(trunk, l1, l2, l3);
    tree.position.set(x, -1.15, z);
    tree.scale.setScalar(scale);
    tree.rotation.y = Math.random() * Math.PI;
    miniGroveGroup.add(tree);
  };
  addMiniTree(10, 6, 1.2);
  addMiniTree(13, 8, 1.0);
  addMiniTree(11, 10, 0.8);
  scene.add(miniGroveGroup);

  // ── Bamboo Grove (Realistic Clustered Growth) ──
  // Bamboos grow in dense clumps/groves. We generate cluster centers first.
  const clusterCount = isMobile ? 6 : 12;
  const bambooCount = isMobile ? 80 : 200; // Increased count since they are clustered tightly
  const clusters = [];
  
  while(clusters.length < clusterCount) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 10 + Math.random() * 16; // 10 to 26
    const cx = Math.cos(angle) * dist;
    const cz = Math.sin(angle) * dist;
    
    // Keep cluster away from the main front path area (z > 2 and x near center)
    if (cz > 2 && Math.abs(cx) < 10) continue; 
    // Keep cluster away from the pond
    if (Math.hypot(cx - 12, cz - (-2)) < 8) continue;
    // Keep cluster away from Pagoda Shrines
    if (Math.hypot(cx - (-14), cz - 5) < 7) continue;
    if (Math.hypot(cx - (-12), cz - 11) < 7) continue;
    // Keep cluster away from Zen Garden
    if (Math.hypot(cx - (-12), cz - (-10)) < 8) continue;
    // Keep cluster away from Teahouse (0, -16) and sweeping path
    if (Math.hypot(cx - 0, cz - (-16)) < 10) continue;
    const approxT = (11.5 - cz) / 26;
    if (approxT >= 0 && approxT <= 1) {
      // Cubic Bezier approximation for path X
      const pathX = 3 * (1 - approxT) * (approxT * approxT) * (-16);
      if (Math.abs(cx - pathX) < 8.0) continue;
    }
    
    clusters.push({x: cx, z: cz});
  }

  const bambooMat = new THREE.MeshStandardMaterial({ color: 0x4fa03a, roughness: 0.8 });
  const bambooGroup = new THREE.Group();
  
  for (let i = 0; i < bambooCount; i++) {
    // Pick a cluster
    const cluster = clusters[i % clusterCount];
    
    // Spawn stalk close to the cluster center (within a 4 unit radius)
    const offsetAngle = Math.random() * Math.PI * 2;
    const offsetDist = Math.random() * 2.5;
    const bx = cluster.x + Math.cos(offsetAngle) * offsetDist;
    const bz = cluster.z + Math.sin(offsetAngle) * offsetDist;
    
    const h = 4 + Math.random() * 6;
    
    const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, h, 5), bambooMat);
    stalk.position.set(bx, -1.1 + h/2, bz);
    // Bamboos lean slightly outward from their cluster center
    stalk.rotation.set((Math.random()-0.5)*0.15, 0, (Math.random()-0.5)*0.15);
    
    // Add 4-6 leaves to each stalk for realism
    const leafCount = 4 + Math.floor(Math.random()*3);
    for(let j=0; j<leafCount; j++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.5, 3), bambooMat);
      // Attach leaves to the top half of the stalk
      leaf.position.y = (h/2) - (Math.random() * h * 0.5);
      leaf.rotation.z = Math.PI/2 + (Math.random()-0.5)*0.5; // point outwards
      leaf.rotation.y = Math.random() * Math.PI*2;
      stalk.add(leaf);
    }
    
    bambooGroup.add(stalk);
  }
  scene.add(bambooGroup);

  // ── Falling Sakura Petals (Instanced) ──
  const petalCount = isMobile ? 150 : 400;
  const fallingPetalGeo = new THREE.IcosahedronGeometry(0.08, 0);
  fallingPetalGeo.scale(1, 0.2, 0.7); // flatten it into a 3D petal shape
  const petalMat = new THREE.MeshBasicMaterial({ 
    color: 0xfff3f6, 
    transparent: true, 
    opacity: 0.8,
  });
  petalsMesh = new THREE.InstancedMesh(fallingPetalGeo, petalMat, petalCount);
  
  for (let i = 0; i < petalCount; i++) {
    const x = (Math.random() - 0.5) * 30;
    const y = Math.random() * 15;
    const z = (Math.random() - 0.5) * 30;
    
    dummy.position.set(x, y, z);
    dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    dummy.updateMatrix();
    petalsMesh.setMatrixAt(i, dummy.matrix);
    
    petalsData.push({
      x, y, z,
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      rz: Math.random() * Math.PI,
      speed: 0.02 + Math.random() * 0.03,
      wobbleSpeed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2
    });
  }
  scene.add(petalsMesh);

  // ── Azalea Bushes & Flowers (Original Foliage restored) ──
  const rockColors = [0x5a5a6e, 0x6b6b7a, 0x4a4a58, 0x7a7a8a];
  const bushColors = [0x2e8b57, 0x3cb371, 0x8fbc8f]; // Japanese greens
  const flowerColors = [0xffb7c5, 0xffc0cb, 0xffffff]; // Sakura pinks/whites

  const genRock = () => {
    const geo = new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.5, 0);
    geo.scale(1, 0.6 + Math.random() * 0.4, 1);
    return geo;
  };
  const genBush = () => {
    return new THREE.IcosahedronGeometry(0.6 + Math.random() * 0.6, 1);
  };

  // Helper to prevent spawning on the path, pond, or inside the Torii gate
  const isValidSpawn = (x, z) => {
    // Avoid pond (x: 12, z: -2, radius: 5.5)
    if (Math.hypot(x - 12, z - (-2)) < 5.5) return false;
    // Avoid sweeping left path
    const approxT = (11.5 - z) / 26;
    if (approxT >= 0 && approxT <= 1) {
      const pathX = 3 * (1 - approxT) * (approxT * approxT) * (-16);
      if (Math.abs(x - pathX) < 4.0) return false;
    }
    // Avoid Torii base (x: 0, z: 10)
    if (Math.hypot(x - 0, z - 10) < 4.0) return false;
    // Avoid tree trunk
    if (Math.hypot(x, z) < 2.5) return false;
    // Avoid Shrine (x: -14, z: 5)
    if (Math.hypot(x - (-14), z - 5) < 5.0) return false;
    // Avoid Mini Grove (x: 12, z: 8)
    if (Math.hypot(x - 12, z - 8) < 5.0) return false;
    // Avoid Zen Garden (x: -12, z: -10)
    if (Math.hypot(x - (-12), z - (-10)) < 6.0) return false;
    // Avoid Teahouse (x: 0, z: -16)
    if (Math.hypot(x - 0, z - (-16)) < 6.5) return false;
    return true;
  };

  // ── Stone Lanterns (Tōrō) ──
  const lanternGroup = new THREE.Group();
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x888899, roughness: 0.8, flatShading: true });
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffedcc }); // Warm glowing light inside
  glowMat.userData = { originalColor: new THREE.Color(0xffedcc), glowColor: new THREE.Color(0xffaa00), isBasic: true };
  glowMaterials.push(glowMat);
  
  const createLantern = (x, z, ry) => {
    const lGrp = new THREE.Group();
    // Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.8), stoneMat);
    base.position.y = 0.1;
    lGrp.add(base);
    // Pillar
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 1.2, 4), stoneMat);
    pillar.position.y = 0.8;
    pillar.rotation.y = Math.PI / 4;
    lGrp.add(pillar);
    // Platform
    const plat = new THREE.Mesh(new THREE.BoxGeometry(1, 0.2, 1), stoneMat);
    plat.position.y = 1.5;
    lGrp.add(plat);
    // Light Box
    const lightBox = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), glowMat);
    lightBox.position.y = 1.9;
    lGrp.add(lightBox);
    // Roof
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.2, 0.6, 4), stoneMat);
    roof.position.y = 2.4;
    roof.rotation.y = Math.PI / 4;
    lGrp.add(roof);
    // Finial
    const finial = new THREE.Mesh(new THREE.SphereGeometry(0.15), stoneMat);
    finial.position.y = 2.8;
    lGrp.add(finial);
    
    lGrp.position.set(x, -1.15, z);
    lGrp.rotation.y = ry;
    lanternGroup.add(lGrp);
  };
  // Scatter lanterns around the back edges of the garden
  createLantern(-6, -12, Math.PI/6);
  createLantern(8, -14, -Math.PI/4);
  createLantern(-16, -2, Math.PI/8);
  createLantern(16, 2, -Math.PI/6);
  scene.add(lanternGroup);

  // ── Zen Sand Garden (Karesansui) ──
  // Placing a beautiful circular raked sand bed in the very empty back-left area
  const zenGroup = new THREE.Group();
  const sandMat = new THREE.MeshStandardMaterial({ color: 0xd8d8d0, roughness: 1.0, flatShading: true });
  
  // Make a very flat wide cylinder for the sand bed
  const sandGeo = new THREE.CylinderGeometry(4.5, 4.5, 0.1, 16);
  const sandBed = new THREE.Mesh(sandGeo, sandMat);
  sandBed.position.y = 0.05;
  zenGroup.add(sandBed);
  
  // Add 3 feature rocks to the zen garden
  const r1 = new THREE.Mesh(genRock(), new THREE.MeshStandardMaterial({ color: rockColors[0], roughness: 0.9 }));
  r1.position.set(1.5, 0.5, 1);
  r1.rotation.set(Math.random(), Math.random(), Math.random());
  
  const r2 = new THREE.Mesh(genRock(), new THREE.MeshStandardMaterial({ color: rockColors[1], roughness: 0.9 }));
  r2.position.set(-1.0, 0.3, -1.5);
  r2.scale.set(0.6, 0.6, 0.6);
  r2.rotation.set(Math.random(), Math.random(), Math.random());
  
  const r3 = new THREE.Mesh(genRock(), new THREE.MeshStandardMaterial({ color: rockColors[2], roughness: 0.9 }));
  r3.position.set(-2.0, 0.4, 1.0);
  r3.scale.set(0.8, 0.8, 0.8);
  r3.rotation.set(Math.random(), Math.random(), Math.random());
  
  zenGroup.add(r1, r2, r3);
  zenGroup.position.set(-12, -1.15, -10); // Back-left corner
  scene.add(zenGroup);

  // ── Secondary Sakura Grove & Rocks (Beside Pond) ──
  // Filling the empty space back-right of the pond
  addMiniTree(16, -6, 1.3);
  addMiniTree(14, -9, 0.9);
  addMiniTree(18, -10, 1.1);
  addMiniTree(12, -13, 1.0);
  
  const pondRock1 = new THREE.Mesh(genRock(), new THREE.MeshStandardMaterial({ color: rockColors[0], roughness: 0.9 }));
  pondRock1.position.set(15, -1.0, -4);
  pondRock1.scale.set(1.5, 1.5, 1.5);
  pondRock1.rotation.set(Math.random(), Math.random(), Math.random());
  
  const pondRock2 = new THREE.Mesh(genRock(), new THREE.MeshStandardMaterial({ color: rockColors[2], roughness: 0.9 }));
  pondRock2.position.set(13, -1.1, -7);
  pondRock2.scale.set(1.2, 1.2, 1.2);
  pondRock2.rotation.set(Math.random(), Math.random(), Math.random());
  
  scene.add(pondRock1, pondRock2);

  // Add Bushes (Increased density)
  const bushCount = isMobile ? 30 : 60;
  for (let i = 0; i < bushCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 6 + Math.random() * 22;
    const bx = Math.cos(angle)*radius;
    const bz = Math.sin(angle)*radius;
    if (!isValidSpawn(bx, bz)) continue;

    const mat = new THREE.MeshStandardMaterial({ color: bushColors[Math.floor(Math.random() * bushColors.length)], roughness: 0.9, flatShading: true });
    const mesh = new THREE.Mesh(genBush(), mat);
    mesh.position.set(bx, -1.2, bz);
    mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
    scene.add(mesh);
  }

  // Scattered Outer Forest Trees
  const outerTreeCount = 15;
  for(let i=0; i<outerTreeCount; i++){
    const angle = Math.random() * Math.PI * 2;
    const radius = 16 + Math.random() * 10;
    const tx = Math.cos(angle)*radius;
    const tz = Math.sin(angle)*radius;
    if(tz > 5 && Math.abs(tx) < 10) continue; // Keep front clear
    addMiniTree(tx, tz, 0.8 + Math.random()*0.7);
  }

  // Add Flowers
  const flowerCount = isMobile ? 25 : 50;
  for (let i = 0; i < flowerCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 5 + Math.random() * 18;
    const fx = Math.cos(angle)*radius;
    const fz = Math.sin(angle)*radius;
    if (!isValidSpawn(fx, fz)) continue;

    const fMat = new THREE.MeshStandardMaterial({ color: flowerColors[Math.floor(Math.random() * flowerColors.length)], roughness: 0.8, flatShading: true });
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.15, 0), fMat);
    mesh.position.set(fx, -1.0, fz);
    scene.add(mesh);
  }

  // ── Ground Details (Fallen Petals & Stylized Grass) ──
  const groundDetailsGroup = new THREE.Group();
  
  // 1. Fallen Petals (Instanced)
  const fallenPetalCount = isMobile ? 800 : 1500;
  const fallenPetalMat = new THREE.MeshStandardMaterial({ color: 0xffb7c5, roughness: 0.8, flatShading: true });
  const petalGeo = new THREE.IcosahedronGeometry(0.08, 0);
  petalGeo.scale(1, 0.2, 0.7); // flatten it into a 3D petal shape
  const fallenPetalMesh = new THREE.InstancedMesh(petalGeo, fallenPetalMat, fallenPetalCount);
  
  let validFallen = 0;
  for(let i=0; i<fallenPetalCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    // more petals closer to tree
    const radius = 1.5 + Math.pow(Math.random(), 2) * 18; 
    const px = Math.cos(angle)*radius;
    const pz = Math.sin(angle)*radius;
    if(isValidSpawn(px, pz)) {
      dummy.position.set(px, -1.13, pz); // flat on ground
      dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      dummy.scale.setScalar(0.7 + Math.random()*0.6);
      dummy.updateMatrix();
      fallenPetalMesh.setMatrixAt(validFallen++, dummy.matrix);
    }
  }
  fallenPetalMesh.count = validFallen;
  groundDetailsGroup.add(fallenPetalMesh);

  // 2. Stylized Moss Patches (Instanced)
  // Replaces the pointy grass with large flat circles embedded in the ground, 
  // giving the terrain color variation and a lush, hand-painted look.
  const mossCount = isMobile ? 250 : 500;
  const mossMat = new THREE.MeshStandardMaterial({ color: 0x669b66, roughness: 1.0, flatShading: true });
  const mossGeo = new THREE.CylinderGeometry(1, 1, 0.1, 7); // flat heptagons
  const mossMesh = new THREE.InstancedMesh(mossGeo, mossMat, mossCount);

  let validMoss = 0;
  for(let i=0; i<mossCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2 + Math.random() * 26;
    const gx = Math.cos(angle)*radius;
    const gz = Math.sin(angle)*radius;
    if(isValidSpawn(gx, gz)) {
      dummy.position.set(gx, -1.18, gz); // embedded almost completely in ground
      dummy.rotation.set(0, Math.random()*Math.PI, 0); 
      // vary sizes massively for layered patches
      dummy.scale.set(0.5 + Math.random()*2.5, 1, 0.5 + Math.random()*2.5);
      dummy.updateMatrix();
      mossMesh.setMatrixAt(validMoss++, dummy.matrix);
    }
  }
  mossMesh.count = validMoss;
  groundDetailsGroup.add(mossMesh);
  
  scene.add(groundDetailsGroup);
}

// ── Butterflies ──
function spawnButterflies() {
  const butterflyColors = [
    [0xffffff, 0xfff3f6], // pure white with slight pink
    [0xffe6e6, 0xffcce0], // light sakura
    [0xffb3cc, 0xff99b3], // deeper pink
    [0xffffff, 0xe6f2ff], // white with ice blue
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
  // ── Japanese Cranes (Birds) ──
  const craneMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, roughness: 0.7, metalness: 0.1, flatShading: true
  });
  const craneRedMat = new THREE.MeshStandardMaterial({
    color: 0xcc0000, roughness: 0.7, metalness: 0.1, flatShading: true
  });
  const craneBlackMat = new THREE.MeshStandardMaterial({
    color: 0x222222, roughness: 0.7, metalness: 0.1, flatShading: true
  });

  const birdCountLocal = isMobile ? 4 : 8;
  for (let b = 0; b < birdCountLocal; b++) {
    const group = new THREE.Group();

    // Body — elongated
    const bodyGeo = new THREE.IcosahedronGeometry(0.15, 0);
    bodyGeo.scale(2.2, 0.7, 0.7);
    const body = new THREE.Mesh(bodyGeo, craneMat);
    group.add(body);

    // Neck & Head (Red accent)
    const neckGeo = new THREE.CylinderGeometry(0.04, 0.06, 0.4, 4);
    const neck = new THREE.Mesh(neckGeo, craneMat);
    neck.position.set(0.35, 0.2, 0);
    neck.rotation.z = -0.5;
    const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.08, 0), craneRedMat);
    head.position.set(0.45, 0.4, 0);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.15, 3), craneBlackMat);
    beak.position.set(0.55, 0.4, 0);
    beak.rotation.z = -Math.PI/2;
    group.add(neck, head, beak);

    // Tail (Black accent)
    const tailGeo = new THREE.ConeGeometry(0.08, 0.3, 3);
    tailGeo.translate(0, -0.15, 0);
    const tail = new THREE.Mesh(tailGeo, craneBlackMat);
    tail.rotation.z = Math.PI * 0.8;
    tail.position.set(-0.35, 0, 0);
    group.add(tail);

    // Wings
    function makeBirdWing(side) {
      const pts = [
        new THREE.Vector2(0, 0),
        new THREE.Vector2(side * 0.6, 0.2),
        new THREE.Vector2(side * 0.5, -0.1),
      ];
      return new THREE.ShapeGeometry(new THREE.Shape(pts));
    }
    const wL = new THREE.Mesh(makeBirdWing(-1), craneMat.clone());
    const wR = new THREE.Mesh(makeBirdWing( 1), craneMat.clone());
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
      speed: 0.3 + Math.random() * 0.2
    });
  }

  // ── Pandas ──
  const pandaWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true });
  const pandaBlack = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.9, flatShading: true });

  const pandaCountLocal = isMobile ? 1 : 2;
  // Use global pandas array
  for (let p = 0; p < pandaCountLocal; p++) {
    const group = new THREE.Group();

    // Body
    const bodyGeo = new THREE.IcosahedronGeometry(0.45, 0);
    const body = new THREE.Mesh(bodyGeo, pandaWhite);
    body.position.set(0, 0.6, 0);
    group.add(body);

    // Head
    const headGeo = new THREE.IcosahedronGeometry(0.35, 0);
    const head = new THREE.Mesh(headGeo, pandaWhite);
    head.position.set(0.35, 1.05, 0);
    group.add(head);

    // Ears
    [-1, 1].forEach(side => {
      const earGeo = new THREE.IcosahedronGeometry(0.12, 0);
      const ear = new THREE.Mesh(earGeo, pandaBlack);
      ear.position.set(0.3, 1.35, side * 0.25);
      group.add(ear);
    });

    // Eyes
    [-1, 1].forEach(side => {
      const eyeGeo = new THREE.IcosahedronGeometry(0.06, 0);
      const eye = new THREE.Mesh(eyeGeo, pandaBlack);
      eye.position.set(0.65, 1.15, side * 0.15);
      // eye patch
      const patchGeo = new THREE.IcosahedronGeometry(0.1, 0);
      const patch = new THREE.Mesh(patchGeo, pandaBlack);
      patch.scale.set(1, 0.8, 1);
      patch.position.set(0.62, 1.1, side * 0.18);
      patch.rotation.x = side * 0.5;
      group.add(eye, patch);
    });

    // Nose
    const noseGeo = new THREE.IcosahedronGeometry(0.05, 0);
    const nose = new THREE.Mesh(noseGeo, pandaBlack);
    nose.position.set(0.72, 1.0, 0);
    group.add(nose);

    // Legs
    const legPositions = [[0.2, 0.3, 0.25],[0.2, 0.3, -0.25],[-0.2, 0.3, 0.25],[-0.2, 0.3, -0.25]];
    group.userData.legs = [];
    legPositions.forEach(([lx, ly, lz]) => {
      const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.4, 5);
      legGeo.translate(0, -0.2, 0);
      const leg = new THREE.Mesh(legGeo, pandaBlack);
      leg.position.set(lx, ly + 0.2, lz);
      group.add(leg);
      group.userData.legs.push(leg);
    });
    
    // Tail
    const tailGeo = new THREE.IcosahedronGeometry(0.1, 0);
    const tail = new THREE.Mesh(tailGeo, pandaBlack);
    tail.position.set(-0.45, 0.5, 0);
    group.add(tail);

    const angle = (p * Math.PI) + Math.random() * 0.5;
    const radius = 3.5 + p * 1.5;
    group.position.set(Math.cos(angle)*radius, -1.1, Math.sin(angle)*radius);
    group.rotation.y = angle + Math.PI;
    group.scale.setScalar(0.75);
    scene.add(group);

    pandas.push({
      group,
      phase: Math.random() * Math.PI * 2,
      angle,
      radius,
      speed: 0.06 + Math.random() * 0.04
    });
  }

  // ── Koi Fish ──
  const koiMat1 = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 }); // White
  const koiMat2 = new THREE.MeshStandardMaterial({ color: 0xff4500, roughness: 0.5 }); // Orange/Red
  
  const koiCount = 3;
  for(let i=0; i<koiCount; i++) {
    const kGroup = new THREE.Group();
    // Body
    const bodyGeo = typeof THREE.CapsuleGeometry === 'function' 
      ? new THREE.CapsuleGeometry(0.12, 0.4, 4, 8)
      : new THREE.CylinderGeometry(0.12, 0.12, 0.4, 8);
    bodyGeo.rotateZ(Math.PI/2);
    const body = new THREE.Mesh(bodyGeo, i%2===0 ? koiMat1 : koiMat2);
    // Spot
    const spotGeo = new THREE.IcosahedronGeometry(0.1, 0);
    const spot = new THREE.Mesh(spotGeo, i%2===0 ? koiMat2 : koiMat1);
    spot.position.set(0.1, 0.05, 0);
    spot.scale.set(1.5, 0.5, 1);
    
    // Tail
    const tailGeo = new THREE.ConeGeometry(0.1, 0.3, 3);
    tailGeo.rotateZ(-Math.PI/2);
    const tail = new THREE.Mesh(tailGeo, i%2===0 ? koiMat2 : koiMat1);
    tail.position.set(-0.35, 0, 0);
    
    kGroup.add(body, spot, tail);
    
    const angle = (i/koiCount) * Math.PI * 2;
    // Pond center is at (12, -1.15, 2)
    kGroup.position.set(12 + Math.cos(angle)*2, -1.05, 2 + Math.sin(angle)*2);
    scene.add(kGroup);
    
    koiArray.push({
      group: kGroup,
      tail: tail,
      angle: angle,
      radius: 1.5 + Math.random()*1.5,
      speed: 0.2 + Math.random()*0.1,
      phase: Math.random() * Math.PI*2
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
  
  // ── Night Fireflies ──
  nightFireflyGeo = new THREE.BufferGeometry();
  const nightPositions = new Float32Array(150 * 3);
  for (let i = 0; i < 150; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 25.0; // Scatter across entire map
    nightPositions[i * 3] = Math.cos(angle) * radius;
    nightPositions[i * 3 + 1] = 0.2 + Math.random() * 8.0;
    nightPositions[i * 3 + 2] = Math.sin(angle) * radius - 5; // Offset to garden center
    
    nightFireflySpeeds.push({
      x: (Math.random() - 0.5) * 0.01,
      y: 0.002 + Math.random() * 0.006,
      z: (Math.random() - 0.5) * 0.01,
      phase: Math.random() * Math.PI * 2
    });
  }
  nightFireflyGeo.setAttribute('position', new THREE.BufferAttribute(nightPositions, 3));
  
  const nightFireflyMat = new THREE.PointsMaterial({
    size: 0.18,
    map: fireflyTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0 // Invisible during the day
  });
  
  nightFireflySystem = new THREE.Points(nightFireflyGeo, nightFireflyMat);
  scene.add(nightFireflySystem);
}

// 9b. Fireworks System (Night Mode Only)
function spawnFirework() {
  const fColor = new THREE.Color().setHSL(Math.random(), 1, 0.6);
  const geo = new THREE.BufferGeometry();
  const particleCount = isMobile ? 60 : 120;
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];
  
  // Spawn high up behind the teahouse/mountains
  const startX = (Math.random() - 0.5) * 35;
  const startY = 12 + Math.random() * 8;
  const startZ = -18 - Math.random() * 10;
  
  for (let i = 0; i < particleCount; i++) {
    positions[i*3] = startX;
    positions[i*3+1] = startY;
    positions[i*3+2] = startZ;
    
    // Spherical explosion
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    const speed = 0.15 + Math.random() * 0.25; // Bigger explosion radius
    
    velocities.push({
      x: Math.sin(phi) * Math.cos(theta) * speed,
      y: Math.cos(phi) * speed,
      z: Math.sin(phi) * Math.sin(theta) * speed
    });
  }
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const mat = new THREE.PointsMaterial({
    size: 2.0, // Much larger particles so they are easily visible from afar
    color: fColor,
    map: fireflySystem.material.map, // Reuse firefly texture
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 1
  });
  
  const firework = new THREE.Points(geo, mat);
  scene.add(firework);
  
  fireworks.push({
    mesh: firework,
    velocities: velocities,
    life: 1.0,
    decay: 0.005 + Math.random() * 0.005 // Last much longer (3-4 seconds)
  });
}

function updateFireworks() {
  if (Math.random() < 0.03 && nightModeTransition > 0.8) { // Spawn more frequently
    spawnFirework();
  }
  
  for (let i = fireworks.length - 1; i >= 0; i--) {
    const fw = fireworks[i];
    fw.life -= fw.decay;
    
    if (fw.life <= 0) {
      scene.remove(fw.mesh);
      fw.mesh.geometry.dispose();
      fw.mesh.material.dispose();
      fireworks.splice(i, 1);
      continue;
    }
    
    fw.mesh.material.opacity = fw.life;
    const pos = fw.mesh.geometry.attributes.position.array;
    for (let j = 0; j < fw.velocities.length; j++) {
      fw.velocities[j].y -= 0.002; // gravity
      pos[j*3] += fw.velocities[j].x;
      pos[j*3+1] += fw.velocities[j].y;
      pos[j*3+2] += fw.velocities[j].z;
      
      // Air drag (slightly less to let them expand more)
      fw.velocities[j].x *= 0.98;
      fw.velocities[j].y *= 0.98;
      fw.velocities[j].z *= 0.98;
    }
    fw.mesh.geometry.attributes.position.needsUpdate = true;
  }
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
    // If it's a touch pointer, use the changedTouches coordinates if available
    let endX = e.clientX;
    let endY = e.clientY;
    const dist = Math.hypot(endX - startPoint.x, endY - startPoint.y);
    const duration = Date.now() - startTime;

    // Filter Tap: Relaxed move distance to < 20px to support fat fingers on mobile, speed fast (< 400ms)
    if (dist < 20 && duration < 400) {
      handlePointerTap(e);
    }
  });

  // UI Event Listeners
  document.getElementById('close-btn').addEventListener('click', resetCamera);
  document.getElementById('back-grove-btn').addEventListener('click', resetCamera);
  document.getElementById('next-wish-btn').addEventListener('click', loadNextWish);
  
  const readWishesBtn = document.getElementById('open-first-orb-btn');
  if(readWishesBtn) {
    readWishesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if(orbsArray.length > 0) zoomToOrb(orbsArray[0]);
    });
  }
  
  // Set up background music trigger
  const audioToggle = document.getElementById('audio-toggle');
  audioToggle.style.display = 'flex';
  audioToggle.classList.add('muted'); // Starts in a muted state
  audioToggle.addEventListener('click', toggleAudio);
  
  // Set up Night Mode trigger
  const nightModeToggle = document.getElementById('night-mode-toggle');
  const moonIcon = document.getElementById('moon-icon');
  const sunIcon = document.getElementById('sun-icon');
  nightModeToggle.style.display = 'flex';
  nightModeToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    isNightMode = !isNightMode;
    if (isNightMode) {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }
  });

  // Skip Intro Listener
  const skipBtn = document.getElementById('skip-intro-btn');
  if(skipBtn) {
    skipBtn.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      introStep = introTexts.length; // skip to end
      advanceIntro();
    });
  }

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
    const percentage = ((introStep + 1) / introTexts.length) * 100;
    progressFill.style.width = `${percentage}%`;
  }

  if (introStep < introTexts.length) {
    const introTextEl = document.getElementById('intro-text');
    
    // Trigger wind-blown exit animation
    introTextEl.classList.remove('intro-text-active');
    introTextEl.classList.add('intro-text-leaving');
    
    setTimeout(() => {
      // Update text and trigger wind-blown entry animation
      introTextEl.textContent = introTexts[introStep];
      introTextEl.classList.remove('intro-text-leaving');
      introTextEl.classList.add('intro-text-active');
      
      // Serene chime tone accompanying text transitions
      triggerChimeTone(300 + introStep * 80);
    }, 600); // Wait 600ms for the exit animation to complete
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

// 13. Camera zoom transition (Cinematic Framing)
function zoomToOrb(orbMesh) {
  isZoomed = true;
  currentZoomedOrb = orbMesh;

  // Release other captured orbs, and capture the targeted one to stabilize it for reading!
  orbsArray.forEach(o => o.userData.isCaptured = false);
  orbMesh.userData.isCaptured = true;
  orbMesh.userData.basePos.copy(orbMesh.position); // Lock current coordinates

  controls.enabled = false;
  
  // Define cinematic landmarks to frame in the background based on orb index
  const landmarks = [
    new THREE.Vector3(0, 2, 10),      // 0: Torii Gate
    new THREE.Vector3(12, -1, -2),    // 1: Koi Pond
    new THREE.Vector3(-14, 5, 5),     // 2: Pagoda Shrines
    new THREE.Vector3(0, 8, -20),     // 3: Mountains / Background
    new THREE.Vector3(12, 5, 8)       // 4: Mini Sakura Grove
  ];
  
  const landmarkIndex = orbMesh.userData.index % landmarks.length;
  const landmarkPos = landmarks[landmarkIndex];
  
  // Calculate direction FROM the landmark TO the orb.
  // By extending this line PAST the orb, the camera looks AT the orb with the landmark directly behind it!
  const targetCamPos = new THREE.Vector3();
  const dirFromLandmark = new THREE.Vector3().subVectors(orbMesh.position, landmarkPos).normalize();
  
  // Slightly elevate the camera angle so it's not looking perfectly horizontal
  dirFromLandmark.y += 0.35;
  dirFromLandmark.normalize();
  
  // Place camera 3.5 units away from the orb, on the opposite side of the landmark
  targetCamPos.copy(orbMesh.position).addScaledVector(dirFromLandmark, 3.5);

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
  const aspect = window.innerWidth / window.innerHeight;
  camera.aspect = aspect;
  
  // Dynamically increase FOV for vertical mobile screens to prevent cramped framing
  if (window.innerWidth < 768) {
    camera.fov = aspect < 1 ? 65 + (1 - aspect) * 25 : 65; // Max FOV ~90 on tall phones to capture gate
  } else {
    camera.fov = 45;
  }
  
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 15. Physics Loop
function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();
  
  // ── Night Mode Interpolation ──
  const targetTransition = isNightMode ? 1 : 0;
  if (Math.abs(nightModeTransition - targetTransition) > 0.001) {
    nightModeTransition += (targetTransition - nightModeTransition) * 0.04; // Smooth lerp
    
    // Day colors
    const daySky = new THREE.Color(0x87CEEB);
    const dayAmb = new THREE.Color(0xf7dcec);
    const dayDir = new THREE.Color(0xfff4e6);
    const dayFillSky = new THREE.Color(0xf7cfe8);
    const dayFillGnd = new THREE.Color(0x2f241f);
    
    // Night colors
    const nightSky = new THREE.Color(0x0a1128); // Midnight blue
    const nightAmb = new THREE.Color(0x1a2244); // Dim moon glow
    const nightDir = new THREE.Color(0x405580); // Cool moonlight
    const nightFillSky = new THREE.Color(0x1a2244);
    const nightFillGnd = new THREE.Color(0x0a0c10);
    
    // Interpolate environment
    scene.background.lerpColors(daySky, nightSky, nightModeTransition);
    scene.fog.color.copy(scene.background);
    if(mainAmbientLight) mainAmbientLight.color.lerpColors(dayAmb, nightAmb, nightModeTransition);
    if(mainDirLight) {
      mainDirLight.color.lerpColors(dayDir, nightDir, nightModeTransition);
      mainDirLight.intensity = 1.6 - (nightModeTransition * 0.8); // Dimmer at night
    }
    if(mainFillLight) {
      mainFillLight.color.lerpColors(dayFillSky, nightFillSky, nightModeTransition);
      mainFillLight.groundColor.lerpColors(dayFillGnd, nightFillGnd, nightModeTransition);
    }
    if(secondaryHemisphereLight) {
      secondaryHemisphereLight.color.lerpColors(dayFillSky, nightFillSky, nightModeTransition);
      secondaryHemisphereLight.groundColor.lerpColors(dayFillGnd, nightFillGnd, nightModeTransition);
    }
    
    // Glow materials
    glowMaterials.forEach(mat => {
      if (mat.userData.isStandard) {
        mat.emissive.lerpColors(new THREE.Color(0x000000), mat.userData.glowColor, nightModeTransition);
        mat.color.lerpColors(mat.userData.originalColor, mat.userData.glowColor, nightModeTransition);
      } else if (mat.userData.isBasic) {
        mat.color.lerpColors(mat.userData.originalColor, mat.userData.glowColor, nightModeTransition);
      }
    });
  }

  // Sprawling tree flexing/rotation
  if (treeGroup) {
    treeGroup.rotation.y = time * 0.035;
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
  
  if (nightFireflySystem) {
    nightFireflySystem.material.opacity = nightModeTransition * 0.9; // Fade in at night
    
    if (nightModeTransition > 0) {
      const nPos = nightFireflyGeo.attributes.position.array;
      for (let i = 0; i < 150; i++) {
        nPos[i * 3 + 1] += nightFireflySpeeds[i].y;
        nPos[i * 3]     += Math.sin(time * 0.5 + nightFireflySpeeds[i].phase) * 0.008 + nightFireflySpeeds[i].x;
        nPos[i * 3 + 2] += Math.cos(time * 0.5 + nightFireflySpeeds[i].phase) * 0.008 + nightFireflySpeeds[i].z;
        if (nPos[i * 3 + 1] > 8.5) {
          nPos[i * 3 + 1] = 0.2 + Math.random() * 0.5;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 25.0;
          nPos[i * 3]     = Math.cos(angle) * radius;
          nPos[i * 3 + 2] = Math.sin(angle) * radius - 5;
        }
      }
      nightFireflyGeo.attributes.position.needsUpdate = true;
    }
  }
  
  // ── Update Fireworks ──
  updateFireworks();

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

  // ── Animate Pandas ──
  pandas.forEach((p) => {
    p.angle += p.speed * 0.006;
    const dx = Math.cos(p.angle) * p.radius;
    const dz = Math.sin(p.angle) * p.radius;
    p.group.position.set(dx, -1.1, dz);
    p.group.rotation.y = -p.angle - Math.PI / 2;
    // Gentle head bob 
    const headBob = Math.sin(time * 0.8 + p.phase) * 0.05;
    if (p.group.children[1]) p.group.children[1].position.y = 1.05 + headBob;

    // Walking animation
    if (p.group.userData.legs) {
      const legAnim = Math.sin(time * 6 + p.phase) * 0.25;
      p.group.userData.legs[0].rotation.z = legAnim;
      p.group.userData.legs[1].rotation.z = -legAnim;
      p.group.userData.legs[2].rotation.z = -legAnim;
      p.group.userData.legs[3].rotation.z = legAnim;
    }
  });

  // ── Koi Fish Animation (Organic wandering) ──
  koiArray.forEach(k => {
    k.angle += k.speed * 0.03;
    
    // Vary the radius slowly over time for wandering behavior instead of a strict circle
    const wanderRadius = k.radius + Math.sin(time * 0.4 + k.phase) * 1.2;
    
    // Target position slightly ahead in time to calculate lookAt rotation
    const nextAngle = k.angle + 0.1;
    const nextRadius = k.radius + Math.sin((time + 0.1) * 0.4 + k.phase) * 1.2;
    
    const px = 12 + Math.cos(k.angle) * wanderRadius;
    const pz = -2 + Math.sin(k.angle) * wanderRadius;
    
    const nx = 12 + Math.cos(nextAngle) * nextRadius;
    const nz = -2 + Math.sin(nextAngle) * nextRadius;
    
    k.group.position.x = px;
    k.group.position.z = pz;
    
    // Look tangentially toward the next position
    const dx = nx - px;
    const dz = nz - pz;
    k.group.rotation.y = -Math.atan2(dz, dx) - Math.PI; // Fish model happens to face backward natively
    
    // Tail wagging
    if(k.tail) {
      k.tail.rotation.y = Math.sin(time * 8 + k.phase) * 0.4;
    }
  });

  // ── Falling Petals ──
  if (petalsMesh) {
    const dummy = new THREE.Object3D();
    for (let i = 0; i < petalsData.length; i++) {
      const p = petalsData[i];
      p.y -= p.speed;
      // Gentle wind/wobble
      p.x += Math.sin(time * p.wobbleSpeed + p.phase) * 0.01;
      p.z += Math.cos(time * p.wobbleSpeed + p.phase) * 0.01;
      
      // Tumbling rotation
      p.rx += 0.02;
      p.ry += 0.03;
      p.rz += 0.01;

      // Wrap around
      if (p.y < -1.0) {
        p.y = 10 + Math.random() * 5;
        p.x = (Math.random() - 0.5) * 30;
        p.z = (Math.random() - 0.5) * 30;
      }

      dummy.position.set(p.x, p.y, p.z);
      dummy.rotation.set(p.rx, p.ry, p.rz);
      dummy.updateMatrix();
      petalsMesh.setMatrixAt(i, dummy.matrix);
    }
    petalsMesh.instanceMatrix.needsUpdate = true;
  }

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

// Pause animation when tab is inactive
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    clock.stop();
  } else {
    clock.start();
  }
});
