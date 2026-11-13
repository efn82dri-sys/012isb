import * as THREE from 'three';

export interface PhotorealisticMaterialSet {
  travertineMat: THREE.MeshStandardMaterial;
  concretePlazaMat: THREE.MeshStandardMaterial;
  boardConcreteMat: THREE.MeshStandardMaterial;
  timberSoffitMat: THREE.MeshStandardMaterial;
  bronzeMullionMat: THREE.MeshStandardMaterial;
  glassCurtainMat: THREE.MeshPhysicalMaterial;
  interiorGlassMat: THREE.MeshPhysicalMaterial;
  frostedGlassMat: THREE.MeshPhysicalMaterial;
  waterMirrorMat: THREE.MeshPhysicalMaterial;
  pvArrayMat: THREE.MeshPhysicalMaterial;
  ductAnodizedMat: THREE.MeshStandardMaterial;
  energyFlowMat: THREE.MeshStandardMaterial;
  thermalShellMat: THREE.MeshPhysicalMaterial;
  steelFrameMat: THREE.MeshStandardMaterial;
  shearCoreMat: THREE.MeshStandardMaterial;
  bracingSteelMat: THREE.MeshStandardMaterial;
  foliageMat: THREE.MeshStandardMaterial;
  warmInteriorWallMat: THREE.MeshStandardMaterial;
  coveLightMat: THREE.MeshStandardMaterial;
  cylinderGalleryMat: THREE.MeshPhysicalMaterial;
  dispose: () => void;
}

/**
 * Deterministic 2D PRNG so architectural textures remain sharp and flicker-free across mounts.
 */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createTravertineTextures(): {
  albedo: THREE.CanvasTexture;
  bump: THREE.CanvasTexture;
} {
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = 512;
  albedoCanvas.height = 512;
  const aCtx = albedoCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = 512;
  bumpCanvas.height = 512;
  const bCtx = bumpCanvas.getContext('2d');

  const rand = mulberry32(1399);

  if (aCtx && bCtx) {
    aCtx.fillStyle = '#E4DDD2';
    aCtx.fillRect(0, 0, 512, 512);
    bCtx.fillStyle = '#909090';
    bCtx.fillRect(0, 0, 512, 512);

    // Sedimentary travertine horizontal veins
    for (let y = 0; y < 512; y += 2) {
      const wave = Math.sin(y * 0.08) * 6 + Math.cos(y * 0.23) * 3;
      const noise = (rand() - 0.5) * 10;
      const base = 223 + wave + noise;
      const r = Math.min(246, Math.max(198, Math.round(base + 4)));
      const g = Math.min(240, Math.max(192, Math.round(base - 1)));
      const b = Math.min(230, Math.max(182, Math.round(base - 10)));
      aCtx.fillStyle = `rgb(${r},${g},${b})`;
      aCtx.fillRect(0, y, 512, 2);

      const bv = Math.min(200, Math.max(105, Math.round(145 + wave * 2 + noise)));
      bCtx.fillStyle = `rgb(${bv},${bv},${bv})`;
      bCtx.fillRect(0, y, 512, 2);
    }

    // Subtle porous mineral pits
    for (let i = 0; i < 650; i++) {
      const px = rand() * 512;
      const py = rand() * 512;
      const pw = 4 + rand() * 14;
      aCtx.fillStyle = 'rgba(155, 142, 126, 0.14)';
      aCtx.fillRect(px, py, pw, 1.5);
      bCtx.fillStyle = 'rgba(70, 70, 70, 0.35)';
      bCtx.fillRect(px, py, pw, 1.5);
    }

    // Architectural stone panel coursing reveals
    aCtx.strokeStyle = 'rgba(92, 86, 78, 0.24)';
    aCtx.lineWidth = 2;
    bCtx.strokeStyle = 'rgb(45, 45, 45)';
    bCtx.lineWidth = 3;
    for (let x = 0; x <= 512; x += 256) {
      aCtx.beginPath();
      aCtx.moveTo(x, 0);
      aCtx.lineTo(x, 512);
      aCtx.stroke();
      bCtx.beginPath();
      bCtx.moveTo(x, 0);
      bCtx.lineTo(x, 512);
      bCtx.stroke();
    }
    for (let y = 0; y <= 512; y += 128) {
      aCtx.beginPath();
      aCtx.moveTo(0, y);
      aCtx.lineTo(512, y);
      aCtx.stroke();
      bCtx.beginPath();
      bCtx.moveTo(0, y);
      bCtx.lineTo(512, y);
      bCtx.stroke();
    }
  }

  const albedo = new THREE.CanvasTexture(albedoCanvas);
  albedo.colorSpace = THREE.SRGBColorSpace;
  albedo.wrapS = THREE.RepeatWrapping;
  albedo.wrapT = THREE.RepeatWrapping;
  albedo.repeat.set(3, 1.5);

  const bump = new THREE.CanvasTexture(bumpCanvas);
  bump.wrapS = THREE.RepeatWrapping;
  bump.wrapT = THREE.RepeatWrapping;
  bump.repeat.set(3, 1.5);

  return { albedo, bump };
}

function createBoardConcreteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const rand = mulberry32(2026);
  if (ctx) {
    ctx.fillStyle = '#B8BEC7';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 32) {
      const shade = 176 + Math.round((rand() - 0.5) * 18);
      ctx.fillStyle = `rgb(${shade},${shade + 3},${shade + 7})`;
      ctx.fillRect(0, y, 512, 31);
      ctx.fillStyle = 'rgba(72, 78, 88, 0.25)';
      ctx.fillRect(0, y + 31, 512, 1);
    }
    for (let i = 0; i < 2400; i++) {
      const g = 145 + Math.floor(rand() * 70);
      ctx.fillStyle = `rgba(${g},${g},${g + 4},0.16)`;
      ctx.fillRect(rand() * 512, rand() * 512, 2, 2);
    }
    // Architectural formwork tie cones
    ctx.fillStyle = 'rgba(78, 84, 96, 0.48)';
    for (let x = 64; x < 512; x += 128) {
      for (let y = 64; y < 512; y += 128) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 3);
  return tex;
}

function createTimberSlatTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const rand = mulberry32(9911);
  if (ctx) {
    ctx.fillStyle = '#7B5434';
    ctx.fillRect(0, 0, 512, 512);
    const slats = 16;
    const sw = 512 / slats;
    for (let s = 0; s < slats; s++) {
      const tone = 115 + Math.round((rand() - 0.5) * 24);
      ctx.fillStyle = `rgb(${tone + 35}, ${tone - 12}, ${tone - 48})`;
      ctx.fillRect(s * sw + 2, 0, sw - 4, 512);
      // Wood grain streaks
      ctx.fillStyle = 'rgba(55, 32, 16, 0.16)';
      for (let g = 0; g < 8; g++) {
        ctx.fillRect(s * sw + 3 + rand() * (sw - 8), 0, 1.2, 512);
      }
      // Shadow reveal groove
      ctx.fillStyle = '#2B1B10';
      ctx.fillRect(s * sw, 0, 2, 512);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return tex;
}

function createBasaltPlazaTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const rand = mulberry32(4412);
  if (ctx) {
    ctx.fillStyle = '#CFD6DE';
    ctx.fillRect(0, 0, 512, 512);
    const tile = 64;
    for (let x = 0; x < 512; x += tile) {
      for (let y = 0; y < 512; y += tile) {
        const v = 204 + Math.round((rand() - 0.5) * 14);
        ctx.fillStyle = `rgb(${v},${v + 4},${v + 9})`;
        ctx.fillRect(x + 1, y + 1, tile - 2, tile - 2);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(16, 16);
  return tex;
}

function createPvCellTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0D1E45';
    ctx.fillRect(0, 0, 512, 512);
    const cols = 6;
    const rows = 10;
    const cw = 512 / cols;
    const ch = 512 / rows;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        ctx.fillStyle = (c + r) % 2 === 0 ? '#112656' : '#0E2049';
        ctx.fillRect(c * cw + 2, r * ch + 2, cw - 4, ch - 4);
        ctx.fillStyle = 'rgba(200, 222, 255, 0.25)';
        ctx.fillRect(c * cw + cw * 0.34, r * ch + 2, 1.2, ch - 4);
        ctx.fillRect(c * cw + cw * 0.68, r * ch + 2, 1.2, ch - 4);
      }
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

function createFrostedGlassRoughnessTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const rand = mulberry32(7788);
  if (ctx) {
    ctx.fillStyle = '#B8B8B8';
    ctx.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 4500; i++) {
      const v = 135 + Math.floor(rand() * 75);
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(rand() * 256, rand() * 256, 2, 2);
    }
    // Fine vertical architectural reeding
    ctx.fillStyle = 'rgba(220,220,220,0.18)';
    for (let x = 0; x < 256; x += 8) {
      ctx.fillRect(x, 0, 2, 256);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return tex;
}

export function createPhotorealisticMaterials(
  isSoftwareGl: boolean,
  isMobile: boolean,
  maxAnisotropy: number
): PhotorealisticMaterialSet {
  const { albedo: travertineAlbedo, bump: travertineBump } = createTravertineTextures();
  travertineAlbedo.anisotropy = maxAnisotropy;
  travertineBump.anisotropy = maxAnisotropy;

  const concreteTex = createBoardConcreteTexture();
  concreteTex.anisotropy = maxAnisotropy;

  const timberTex = createTimberSlatTexture();
  timberTex.anisotropy = maxAnisotropy;

  const plazaTex = createBasaltPlazaTexture();
  plazaTex.anisotropy = maxAnisotropy;

  const pvTex = createPvCellTexture();
  pvTex.anisotropy = maxAnisotropy;

  const frostedRoughTex = createFrostedGlassRoughnessTexture();

  const useTransmission = !isSoftwareGl && !isMobile;

  const travertineMat = new THREE.MeshStandardMaterial({
    map: travertineAlbedo,
    bumpMap: travertineBump,
    bumpScale: 0.02,
    color: 0xf6f3ed,
    roughness: 0.72,
    metalness: 0.02,
    transparent: true,
    opacity: 1,
  });

  const concretePlazaMat = new THREE.MeshStandardMaterial({
    map: plazaTex,
    color: 0xdbe2ea,
    roughness: 0.84,
    metalness: 0.04,
  });

  const boardConcreteMat = new THREE.MeshStandardMaterial({
    map: concreteTex,
    color: 0xcfd5de,
    roughness: 0.82,
    metalness: 0.04,
    transparent: true,
    opacity: 1,
  });

  const timberSoffitMat = new THREE.MeshStandardMaterial({
    map: timberTex,
    color: 0xdcb48a,
    roughness: 0.58,
    metalness: 0.04,
    transparent: true,
    opacity: 1,
  });

  const bronzeMullionMat = new THREE.MeshPhysicalMaterial({
    color: 0x2a3140,
    roughness: 0.28,
    metalness: 0.82,
    anisotropy: 0.4,
    transparent: true,
    opacity: 1,
  });

  // Low-E Architectural Curtain Wall Glass with authentic Fresnel reflections
  const glassCurtainMat = new THREE.MeshPhysicalMaterial({
    color: 0xdce9f5,
    roughness: 0.05,
    metalness: 0.05,
    ior: 1.52,
    reflectivity: 0.92,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    envMapIntensity: 1.65,
    transmission: useTransmission ? 0.64 : 0,
    thickness: 0.35,
    attenuationColor: new THREE.Color(0x9bbbd6),
    attenuationDistance: 8.5,
    transparent: true,
    opacity: useTransmission ? 0.94 : 0.42,
    depthWrite: false,
  });

  const interiorGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xe6f0fa,
    roughness: 0.06,
    metalness: 0.02,
    ior: 1.5,
    clearcoat: 1.0,
    envMapIntensity: 1.35,
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
  });

  // Scene 04 Frosted Architectural Glass Plane
  const frostedGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xeaf1f8,
    roughness: 0.52,
    roughnessMap: frostedRoughTex,
    metalness: 0.04,
    ior: 1.5,
    clearcoat: 0.35,
    clearcoatRoughness: 0.38,
    envMapIntensity: 1.1,
    transmission: useTransmission ? 0.72 : 0,
    thickness: 0.65,
    transparent: true,
    opacity: useTransmission ? 0.92 : 0.72,
    depthWrite: false,
  });

  const waterMirrorMat = new THREE.MeshPhysicalMaterial({
    color: 0x233852,
    roughness: 0.03,
    metalness: 0.12,
    ior: 1.333,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    envMapIntensity: 1.9,
  });

  const pvArrayMat = new THREE.MeshPhysicalMaterial({
    map: pvTex,
    color: 0xffffff,
    roughness: 0.14,
    metalness: 0.32,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    transparent: true,
    opacity: 1,
  });

  const ductAnodizedMat = new THREE.MeshStandardMaterial({
    color: 0x8ea0b5,
    roughness: 0.34,
    metalness: 0.78,
    transparent: true,
    opacity: 1,
  });

  const energyFlowMat = new THREE.MeshStandardMaterial({
    color: 0x03a54e,
    emissive: 0x03a54e,
    emissiveIntensity: 0.55,
    roughness: 0.3,
    metalness: 0.1,
    transparent: true,
    opacity: 0.82,
  });

  const thermalShellMat = new THREE.MeshPhysicalMaterial({
    color: 0x4ade80,
    roughness: 0.25,
    metalness: 0.05,
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });

  const steelFrameMat = new THREE.MeshStandardMaterial({
    color: 0x3b4860,
    roughness: 0.3,
    metalness: 0.86,
    transparent: true,
    opacity: 1,
  });

  const shearCoreMat = new THREE.MeshStandardMaterial({
    map: concreteTex,
    color: 0x9aa6b8,
    roughness: 0.76,
    metalness: 0.08,
    transparent: true,
    opacity: 1,
  });

  const bracingSteelMat = new THREE.MeshStandardMaterial({
    color: 0x223981,
    roughness: 0.28,
    metalness: 0.78,
    transparent: true,
    opacity: 1,
  });

  const foliageMat = new THREE.MeshStandardMaterial({
    color: 0x2f6b47,
    roughness: 0.88,
    metalness: 0.02,
    transparent: true,
    opacity: 1,
  });

  const warmInteriorWallMat = new THREE.MeshStandardMaterial({
    color: 0xebe6dc,
    roughness: 0.85,
    metalness: 0.02,
    transparent: true,
    opacity: 1,
  });

  const coveLightMat = new THREE.MeshStandardMaterial({
    color: 0xfff3dc,
    emissive: 0xffe4b5,
    emissiveIntensity: 1.4,
    roughness: 0.4,
    transparent: true,
    opacity: 1,
  });

  const cylinderGalleryMat = new THREE.MeshPhysicalMaterial({
    color: 0x16295c,
    roughness: 0.42,
    metalness: 0.28,
    clearcoat: 0.5,
    clearcoatRoughness: 0.35,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  return {
    travertineMat,
    concretePlazaMat,
    boardConcreteMat,
    timberSoffitMat,
    bronzeMullionMat,
    glassCurtainMat,
    interiorGlassMat,
    frostedGlassMat,
    waterMirrorMat,
    pvArrayMat,
    ductAnodizedMat,
    energyFlowMat,
    thermalShellMat,
    steelFrameMat,
    shearCoreMat,
    bracingSteelMat,
    foliageMat,
    warmInteriorWallMat,
    coveLightMat,
    cylinderGalleryMat,
    dispose: () => {
      travertineAlbedo.dispose();
      travertineBump.dispose();
      concreteTex.dispose();
      timberTex.dispose();
      plazaTex.dispose();
      pvTex.dispose();
      frostedRoughTex.dispose();

      travertineMat.dispose();
      concretePlazaMat.dispose();
      boardConcreteMat.dispose();
      timberSoffitMat.dispose();
      bronzeMullionMat.dispose();
      glassCurtainMat.dispose();
      interiorGlassMat.dispose();
      frostedGlassMat.dispose();
      waterMirrorMat.dispose();
      pvArrayMat.dispose();
      ductAnodizedMat.dispose();
      energyFlowMat.dispose();
      thermalShellMat.dispose();
      steelFrameMat.dispose();
      shearCoreMat.dispose();
      bracingSteelMat.dispose();
      foliageMat.dispose();
      warmInteriorWallMat.dispose();
      coveLightMat.dispose();
      cylinderGalleryMat.dispose();
    },
  };
}
