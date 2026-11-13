import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PhotorealisticMaterialSet } from './architecturalMaterials';
import { SceneStateSnapshot } from './heroSceneConfig';

interface BuildingModelProps {
  mats: PhotorealisticMaterialSet;
  sceneStateRef: React.MutableRefObject<SceneStateSnapshot>;
  isSoftwareGl: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  archGroupRef: React.RefObject<THREE.Group | null>;
  energyGroupRef: React.RefObject<THREE.Group | null>;
  structGroupRef: React.RefObject<THREE.Group | null>;
}

const _dummy = new THREE.Object3D();
const _curvePos = new THREE.Vector3();

function createBeveledSlab(w: number, h: number, d: number, bevel = 0.035): THREE.ExtrudeGeometry {
  const hw = w / 2 - bevel;
  const hd = d / 2 - bevel;
  const shape = new THREE.Shape();
  shape.moveTo(-hw, -hd);
  shape.lineTo(hw, -hd);
  shape.lineTo(hw, hd);
  shape.lineTo(-hw, hd);
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.02, h - bevel * 2),
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    steps: 1,
  });
  geo.rotateX(Math.PI / 2);
  geo.center();
  return geo;
}

/**
 * Generates realistic architectural glazing curtain bays while keeping the central
 * portal opening (|x| < 2.6 on z = +6.15) physically open for Scene 02 fly-through.
 */
function buildMullionPositions() {
  const cols: { x: number; y: number; z: number; h: number }[] = [];
  const xs = [-7.6, -5.8, -4.0, -2.65, 2.65, 4.0, 5.8, 7.6];
  // Front & rear curtain wall mullions (lower double height 0.2..6.8, upper 6.8..10.2)
  xs.forEach((x) => {
    cols.push({ x, y: 3.5, z: 6.12, h: 6.6 });
    cols.push({ x, y: 3.5, z: -6.12, h: 6.6 });
  });
  // Upper tier perimeter mullions (including center spans above the 2-story portal)
  [-6.8, -5.0, -3.3, -1.65, 0, 1.65, 3.3, 5.0, 6.8].forEach((x) => {
    cols.push({ x, y: 8.5, z: 5.3, h: 3.3 });
    cols.push({ x, y: 8.5, z: -5.3, h: 3.3 });
  });
  // Side facade mullions
  [-4.4, -2.2, 0, 2.2, 4.4].forEach((z) => {
    cols.push({ x: -7.7, y: 3.5, z, h: 6.6 });
    cols.push({ x: 7.7, y: 3.5, z, h: 6.6 });
  });
  return cols;
}

function buildFinPositions() {
  const fins: { x: number; y: number; z: number; h: number; ry: number }[] = [];
  // Vertical anodized architectural shading fins framing East/West & upper curtain walls
  for (let i = 0; i < 8; i++) {
    const z = -4.9 + (i * 9.8) / 7;
    fins.push({ x: -7.85, y: 5.1, z, h: 9.6, ry: 0.25 });
    fins.push({ x: 7.85, y: 5.1, z, h: 9.6, ry: -0.25 });
  }
  // Upper-level front façade rhythmic brise-soleil slats
  for (let i = 0; i < 13; i++) {
    const x = -6.2 + i * (12.4 / 12);
    fins.push({ x, y: 8.5, z: 5.48, h: 3.1, ry: 0.16 });
  }
  return fins;
}

function buildStructuralColumns() {
  const items: { x: number; y: number; z: number; h: number }[] = [];
  // Keep central corridor (|x| <= 2.4) open along main atrium axis
  const xs = [-7.1, -4.8, -2.75, 2.75, 4.8, 7.1];
  const zs = [-5.4, -1.8, 1.8, 5.4];
  xs.forEach((x) => {
    zs.forEach((z) => {
      const h = Math.abs(x) < 6.4 && Math.abs(z) < 4.8 ? 10.2 : 6.7;
      items.push({ x, y: h / 2 + 0.2, z, h });
    });
  });
  return items;
}

function buildLandscapePlanters() {
  const nodes: { x: number; y: number; z: number; sx: number; sy: number; sz: number }[] = [];
  const positions = [
    [-9.2, 0.45, 7.8],
    [-9.6, 0.45, 9.5],
    [-8.9, 0.45, 11.2],
    [9.2, 0.45, 7.8],
    [9.6, 0.45, 9.5],
    [8.9, 0.45, 11.2],
    [-10.4, 0.45, 1.2],
    [-10.4, 0.45, -2.8],
    [10.4, 0.45, 1.2],
    [10.4, 0.45, -2.8],
    // Rooftop Sero Sabz terrace vegetation nodes
    [-4.8, 7.05, 5.5],
    [-3.6, 7.05, 5.55],
    [-2.4, 7.05, 5.5],
    [2.4, 7.05, 5.5],
    [3.6, 7.05, 5.55],
    [4.8, 7.05, 5.5],
  ];
  positions.forEach(([x, y, z], idx) => {
    const s = 0.42 + (idx % 3) * 0.08;
    nodes.push({ x, y, z, sx: s, sy: s * 1.15, sz: s });
  });
  return nodes;
}

export const BuildingModel: React.FC<BuildingModelProps> = ({
  mats,
  sceneStateRef,
  isSoftwareGl,
  reducedMotion,
  archGroupRef,
  energyGroupRef,
  structGroupRef,
}) => {
  const mullionRef = useRef<THREE.InstancedMesh | null>(null);
  const finRef = useRef<THREE.InstancedMesh | null>(null);
  const columnRef = useRef<THREE.InstancedMesh | null>(null);
  const foliageRef = useRef<THREE.InstancedMesh | null>(null);
  const airflowPulseRef = useRef<THREE.InstancedMesh | null>(null);

  const mullions = useMemo(() => buildMullionPositions(), []);
  const fins = useMemo(() => buildFinPositions(), []);
  const columns = useMemo(() => buildStructuralColumns(), []);
  const foliage = useMemo(() => buildLandscapePlanters(), []);

  const geos = useMemo(() => {
    const podium = createBeveledSlab(17.4, 0.36, 13.8, 0.05);
    const floor1 = createBeveledSlab(15.6, 0.32, 12.4, 0.04);
    // Mezzanine left & right wings leaving open double-height central atrium
    const mezzWing = createBeveledSlab(4.7, 0.28, 11.4, 0.03);
    const level2 = createBeveledSlab(14.2, 0.34, 10.8, 0.04);
    const roofSlab = createBeveledSlab(12.2, 0.38, 9.2, 0.045);
    const canopySlab = createBeveledSlab(6.8, 0.26, 3.8, 0.035);

    // Thermal stack airflow convection paths ascending gently through central atrium
    const airflowCurves = [-1.25, 0, 1.25].map((x) => {
      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, 0.8, 4.4),
        new THREE.Vector3(x * 0.8, 3.2, 2.0),
        new THREE.Vector3(x * 0.55, 6.2, -0.4),
        new THREE.Vector3(x * 0.3, 9.4, -1.2),
        new THREE.Vector3(x * 0.2, 12.0, -1.5),
      ]);
    });
    const airflowTubes = airflowCurves.map((c) => new THREE.TubeGeometry(c, 32, 0.042, 8, false));

    return {
      podium,
      floor1,
      mezzWing,
      level2,
      roofSlab,
      canopySlab,
      airflowCurves,
      airflowTubes,
    };
  }, []);

  useEffect(() => {
    return () => {
      geos.podium.dispose();
      geos.floor1.dispose();
      geos.mezzWing.dispose();
      geos.level2.dispose();
      geos.roofSlab.dispose();
      geos.canopySlab.dispose();
      geos.airflowTubes.forEach((g) => g.dispose());
    };
  }, [geos]);

  // Populate static InstancedMeshes
  useEffect(() => {
    if (mullionRef.current) {
      mullions.forEach((m, i) => {
        _dummy.position.set(m.x, m.y, m.z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, m.h, 1);
        _dummy.updateMatrix();
        mullionRef.current!.setMatrixAt(i, _dummy.matrix);
      });
      mullionRef.current.instanceMatrix.needsUpdate = true;
      mullionRef.current.computeBoundingSphere();
    }

    if (finRef.current) {
      fins.forEach((f, i) => {
        _dummy.position.set(f.x, f.y, f.z);
        _dummy.rotation.set(0, f.ry, 0);
        _dummy.scale.set(1, f.h, 1);
        _dummy.updateMatrix();
        finRef.current!.setMatrixAt(i, _dummy.matrix);
      });
      finRef.current.instanceMatrix.needsUpdate = true;
      finRef.current.computeBoundingSphere();
    }

    if (columnRef.current) {
      columns.forEach((c, i) => {
        _dummy.position.set(c.x, c.y, c.z);
        _dummy.rotation.set(0, 0, 0);
        _dummy.scale.set(1, c.h, 1);
        _dummy.updateMatrix();
        columnRef.current!.setMatrixAt(i, _dummy.matrix);
      });
      columnRef.current.instanceMatrix.needsUpdate = true;
      columnRef.current.computeBoundingSphere();
    }

    if (foliageRef.current) {
      const base = new THREE.Color(0x2f6b47);
      const tint = new THREE.Color();
      foliage.forEach((n, i) => {
        _dummy.position.set(n.x, n.y, n.z);
        _dummy.rotation.set(0, i * 0.85, 0);
        _dummy.scale.set(n.sx, n.sy, n.sz);
        _dummy.updateMatrix();
        foliageRef.current!.setMatrixAt(i, _dummy.matrix);
        tint.copy(base).offsetHSL(0, 0, (i % 4) * 0.035 - 0.04);
        foliageRef.current!.setColorAt(i, tint);
      });
      foliageRef.current.instanceMatrix.needsUpdate = true;
      if (foliageRef.current.instanceColor) {
        foliageRef.current.instanceColor.needsUpdate = true;
      }
      foliageRef.current.computeBoundingSphere();
    }
  }, [mullions, fins, columns, foliage]);

  const pulseCount = 18;
  const pulsesInitializedRef = useRef(false);

  useFrame((state) => {
    const snapshot = sceneStateRef.current;
    const t = state.clock.getElapsedTime();

    // Update subtle airflow thermal beads inside Energy Layer when visible
    if (airflowPulseRef.current) {
      const energyRelevant = snapshot.explodeFactor > 0.04 || snapshot.progress < 0.55;
      airflowPulseRef.current.visible = energyRelevant;

      if (energyRelevant && !(reducedMotion && pulsesInitializedRef.current)) {
        for (let i = 0; i < pulseCount; i++) {
          const curve = geos.airflowCurves[i % geos.airflowCurves.length];
          const phase = reducedMotion ? 0.35 : t * 0.14;
          const u = (i / pulseCount + phase) % 1;
          curve.getPointAt(u, _curvePos);
          const s = 0.085 * Math.sin(u * Math.PI);
          _dummy.position.copy(_curvePos);
          _dummy.rotation.set(0, 0, 0);
          _dummy.scale.set(s, s, s);
          _dummy.updateMatrix();
          airflowPulseRef.current.setMatrixAt(i, _dummy.matrix);
        }
        airflowPulseRef.current.instanceMatrix.needsUpdate = true;
        if (reducedMotion) pulsesInitializedRef.current = true;
      }
    }
  });

  return (
    <group name="isb-architectural-campus">
      {/* HORIZON-EXTENDED ARCHITECTURAL SITE GROUNDING & REFLECTING PLAZA */}
      <group name="site-landscape">
        {/* Continuous basalt ground plane fading into atmospheric horizon fog */}
        <mesh position={[0, -0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={mats.concretePlazaMat}>
          <circleGeometry args={[72, 64]} />
        </mesh>

        {/* Travertine arrival podium plinth */}
        <mesh position={[0, 0.14, 0]} receiveShadow castShadow={!isSoftwareGl} geometry={geos.podium} material={mats.travertineMat} />

        {/* Architectural approach forecourt steps */}
        <mesh position={[0, 0.06, 8.2]} receiveShadow material={mats.travertineMat}>
          <boxGeometry args={[7.2, 0.12, 3.6]} />
        </mesh>
        <mesh position={[0, 0.02, 10.6]} receiveShadow material={mats.travertineMat}>
          <boxGeometry args={[7.6, 0.06, 2.2]} />
        </mesh>

        {/* Left & Right Shallow Reflecting Water Basins */}
        <mesh position={[-5.4, 0.03, 9.2]} material={mats.waterMirrorMat}>
          <boxGeometry args={[4.2, 0.04, 4.8]} />
        </mesh>
        <mesh position={[5.4, 0.03, 9.2]} material={mats.waterMirrorMat}>
          <boxGeometry args={[4.2, 0.04, 4.8]} />
        </mesh>

        {/* Low Architectural Stone Planter Curbs */}
        <mesh position={[-9.2, 0.2, 9.4]} receiveShadow material={mats.boardConcreteMat}>
          <boxGeometry args={[1.6, 0.4, 5.2]} />
        </mesh>
        <mesh position={[9.2, 0.2, 9.4]} receiveShadow material={mats.boardConcreteMat}>
          <boxGeometry args={[1.6, 0.4, 5.2]} />
        </mesh>

        {/* Instanced Landscape Vegetation */}
        <instancedMesh ref={foliageRef} args={[undefined, undefined, foliage.length]} material={mats.foliageMat}>
          <dodecahedronGeometry args={[1, 1]} />
        </instancedMesh>
      </group>

      {/* ================================================================= */}
      {/* 01 ARCHITECTURAL LAYER: ENVELOPE, GLAZING, TIMBER, ATRIUM INTERIOR */}
      {/* ================================================================= */}
      <group ref={archGroupRef} name="layer-architecture">
        {/* Floor Plates */}
        <mesh position={[0, 0.36, 0]} receiveShadow material={mats.travertineMat}>
          <boxGeometry args={[15.5, 0.1, 12.2]} />
        </mesh>

        {/* Mezzanine Left & Right Gallery Wings (y = 3.85m, central void unobstructed) */}
        <mesh position={[-5.3, 3.85, 0]} receiveShadow castShadow={!isSoftwareGl} geometry={geos.mezzWing} material={mats.travertineMat} />
        <mesh position={[5.3, 3.85, 0]} receiveShadow castShadow={!isSoftwareGl} geometry={geos.mezzWing} material={mats.travertineMat} />

        {/* Mezzanine Glass Balustrades overlooking central double-height atrium */}
        <mesh position={[-2.95, 4.45, 0]} material={mats.interiorGlassMat}>
          <boxGeometry args={[0.04, 1.05, 11.2]} />
        </mesh>
        <mesh position={[2.95, 4.45, 0]} material={mats.interiorGlassMat}>
          <boxGeometry args={[0.04, 1.05, 11.2]} />
        </mesh>

        {/* Level 2 Structural Floor & Spandrel Cornice (y = 6.85m) */}
        <mesh position={[0, 6.85, 0]} receiveShadow castShadow={!isSoftwareGl} geometry={geos.floor1} material={mats.travertineMat} />

        {/* Upper Studio Level Roof Slab & Skylight Coffer (y = 10.3m) */}
        <mesh position={[0, 10.3, 0]} receiveShadow castShadow={!isSoftwareGl} geometry={geos.level2} material={mats.travertineMat} />
        <mesh position={[0, 12.6, -0.5]} receiveShadow castShadow={!isSoftwareGl} geometry={geos.roofSlab} material={mats.travertineMat} />

        {/* Cantilevered Grand Entrance Canopy & Warm Oak Timber Slatted Soffit */}
        <mesh position={[0, 6.72, 7.6]} castShadow={!isSoftwareGl} geometry={geos.canopySlab} material={mats.travertineMat} />
        <mesh position={[0, 6.56, 7.6]} material={mats.timberSoffitMat}>
          <boxGeometry args={[6.4, 0.06, 3.4]} />
        </mesh>

        {/* Interior Double-Height Timber Ceiling Baffles & Cove Lighting */}
        <mesh position={[0, 6.62, 1.2]} material={mats.timberSoffitMat}>
          <boxGeometry args={[5.4, 0.08, 9.6]} />
        </mesh>
        <mesh position={[-2.5, 6.55, 1.2]} material={mats.coveLightMat}>
          <boxGeometry args={[0.08, 0.04, 9.2]} />
        </mesh>
        <mesh position={[2.5, 6.55, 1.2]} material={mats.coveLightMat}>
          <boxGeometry args={[0.08, 0.04, 9.2]} />
        </mesh>

        {/* Interior Atrium Architectural Elements (Reception Monolith & Feature Stair) */}
        <mesh position={[3.35, 0.85, 1.8]} receiveShadow castShadow={!isSoftwareGl} material={mats.travertineMat}>
          <boxGeometry args={[1.1, 0.98, 3.2]} />
        </mesh>
        <mesh position={[3.35, 1.36, 1.8]} material={mats.timberSoffitMat}>
          <boxGeometry args={[1.16, 0.05, 3.26]} />
        </mesh>
        {/* Sculptural Feature Stair Flights (x = -3.8m) */}
        {Array.from({ length: 10 }).map((_, idx) => (
          <mesh
            key={idx}
            position={[-3.7, 0.65 + idx * 0.32, 2.2 - idx * 0.42]}
            material={mats.timberSoffitMat}
          >
            <boxGeometry args={[1.2, 0.08, 0.38]} />
          </mesh>
        ))}

        {/* Interior Partition Walls with Acoustic Warm Plaster */}
        <mesh position={[-6.8, 3.5, -2.5]} receiveShadow material={mats.warmInteriorWallMat}>
          <boxGeometry args={[0.25, 6.2, 6.4]} />
        </mesh>
        <mesh position={[6.8, 3.5, -2.5]} receiveShadow material={mats.warmInteriorWallMat}>
          <boxGeometry args={[0.25, 6.2, 6.4]} />
        </mesh>

        {/* Curtain Wall Glass Bays (Left & Right of Central Portal + Sides + Upper Tier) */}
        {/* Front Left & Front Right Double-Height Curtain Glass */}
        <mesh position={[-5.15, 3.5, 6.1]} renderOrder={3} material={mats.glassCurtainMat}>
          <boxGeometry args={[4.9, 6.4, 0.08]} />
        </mesh>
        <mesh position={[5.15, 3.5, 6.1]} renderOrder={3} material={mats.glassCurtainMat}>
          <boxGeometry args={[4.9, 6.4, 0.08]} />
        </mesh>
        {/* Entrance Portal Vestibule Framing Glass Fins (Left & Right of 5.2m wide clear doorway) */}
        <mesh position={[-2.62, 3.4, 6.6]} renderOrder={3} material={mats.interiorGlassMat}>
          <boxGeometry args={[0.06, 6.2, 1.2]} />
        </mesh>
        <mesh position={[2.62, 3.4, 6.6]} renderOrder={3} material={mats.interiorGlassMat}>
          <boxGeometry args={[0.06, 6.2, 1.2]} />
        </mesh>

        {/* Rear Curtain Wall Glass */}
        <mesh position={[-5.15, 3.5, -6.1]} renderOrder={3} material={mats.glassCurtainMat}>
          <boxGeometry args={[4.9, 6.4, 0.08]} />
        </mesh>
        <mesh position={[5.15, 3.5, -6.1]} renderOrder={3} material={mats.glassCurtainMat}>
          <boxGeometry args={[4.9, 6.4, 0.08]} />
        </mesh>

        {/* Side Curtain Wall Glazing */}
        <mesh position={[-7.68, 3.5, 0]} renderOrder={3} material={mats.glassCurtainMat}>
          <boxGeometry args={[0.08, 6.4, 12.1]} />
        </mesh>
        <mesh position={[7.68, 3.5, 0]} renderOrder={3} material={mats.glassCurtainMat}>
          <boxGeometry args={[0.08, 6.4, 12.1]} />
        </mesh>

        {/* Upper Floor Level 2 Curtain Wall Glass Enclosure */}
        <mesh position={[0, 8.55, 5.28]} renderOrder={3} material={mats.glassCurtainMat}>
          <boxGeometry args={[13.8, 3.15, 0.08]} />
        </mesh>
        <mesh position={[0, 8.55, -5.28]} renderOrder={3} material={mats.glassCurtainMat}>
          <boxGeometry args={[13.8, 3.15, 0.08]} />
        </mesh>
        <mesh position={[-6.95, 8.55, 0]} renderOrder={3} material={mats.glassCurtainMat}>
          <boxGeometry args={[0.08, 3.15, 10.5]} />
        </mesh>
        <mesh position={[6.95, 8.55, 0]} renderOrder={3} material={mats.glassCurtainMat}>
          <boxGeometry args={[0.08, 3.15, 10.5]} />
        </mesh>

        {/* Instanced Anodized Bronze Window Mullions */}
        <instancedMesh ref={mullionRef} args={[undefined, undefined, mullions.length]} material={mats.bronzeMullionMat}>
          <boxGeometry args={[0.09, 1, 0.14]} />
        </instancedMesh>

        {/* Instanced Architectural Brise-Soleil Shading Fins */}
        <instancedMesh ref={finRef} args={[undefined, undefined, fins.length]} castShadow={!isSoftwareGl} material={mats.bronzeMullionMat}>
          <boxGeometry args={[0.06, 1, 0.34]} />
        </instancedMesh>
      </group>

      {/* ================================================================= */}
      {/* 02 ENERGY & BUILDING SYSTEMS LAYER: HVAC, SOLAR PV, AIRFLOW       */}
      {/* ================================================================= */}
      <group ref={energyGroupRef} name="layer-energy">
        {/* Rooftop Tilted Bifacial Solar PV Array Rows (Latitude 32 deg) */}
        {[
          { x: -3.2, z: -2.2 },
          { x: 0, z: -2.2 },
          { x: 3.2, z: -2.2 },
          { x: -3.2, z: 1.4 },
          { x: 0, z: 1.4 },
          { x: 3.2, z: 1.4 },
        ].map((pv, idx) => (
          <group key={idx} position={[pv.x, 12.95, pv.z]} rotation={[0.42, 0, 0]}>
            <mesh castShadow={!isSoftwareGl} material={mats.pvArrayMat}>
              <boxGeometry args={[2.6, 0.06, 1.45]} />
            </mesh>
            <mesh position={[0, -0.05, 0]} material={mats.bronzeMullionMat}>
              <boxGeometry args={[2.68, 0.04, 1.52]} />
            </mesh>
          </group>
        ))}

        {/* Rooftop High-Efficiency Heat Recovery & ERV Penthouse Equipment */}
        <mesh position={[-4.1, 13.35, -3.5]} castShadow={!isSoftwareGl} material={mats.ductAnodizedMat}>
          <boxGeometry args={[2.6, 1.0, 1.8]} />
        </mesh>
        <mesh position={[4.1, 13.35, -3.5]} castShadow={!isSoftwareGl} material={mats.ductAnodizedMat}>
          <boxGeometry args={[2.6, 1.0, 1.8]} />
        </mesh>

        {/* Primary Horizontal & Vertical HVAC Supply/Return Ducting Networks */}
        <mesh position={[-3.9, 6.28, 0]} material={mats.ductAnodizedMat}>
          <boxGeometry args={[0.45, 0.28, 10.6]} />
        </mesh>
        <mesh position={[3.9, 6.28, 0]} material={mats.ductAnodizedMat}>
          <boxGeometry args={[0.45, 0.28, 10.6]} />
        </mesh>
        <mesh position={[-3.9, 9.75, 0]} material={mats.ductAnodizedMat}>
          <boxGeometry args={[0.42, 0.26, 9.4]} />
        </mesh>
        <mesh position={[3.9, 9.75, 0]} material={mats.ductAnodizedMat}>
          <boxGeometry args={[0.42, 0.26, 9.4]} />
        </mesh>
        {/* Vertical Riser Trunks connecting Roof ERV to Floor Plenums */}
        <mesh position={[-3.9, 9.5, -3.5]} material={mats.ductAnodizedMat}>
          <cylinderGeometry args={[0.24, 0.24, 6.6, 16]} />
        </mesh>
        <mesh position={[3.9, 9.5, -3.5]} material={mats.ductAnodizedMat}>
          <cylinderGeometry args={[0.24, 0.24, 6.6, 16]} />
        </mesh>

        {/* Sero Sabz Planted Perimeter Terrace Troughs (Level 2 Terrace) */}
        <mesh position={[-3.6, 7.04, 5.55]} material={mats.bronzeMullionMat}>
          <boxGeometry args={[4.2, 0.14, 0.55]} />
        </mesh>
        <mesh position={[3.6, 7.04, 5.55]} material={mats.bronzeMullionMat}>
          <boxGeometry args={[4.2, 0.14, 0.55]} />
        </mesh>

        {/* Translucent High-Performance Thermal Envelope Membrane Accent */}
        <mesh position={[0, 5.15, 0]} material={mats.thermalShellMat}>
          <boxGeometry args={[14.9, 9.8, 11.7]} />
        </mesh>

        {/* Natural Stack-Ventilation Airflow Tubes & Pulses */}
        {geos.airflowTubes.map((geo, i) => (
          <mesh key={i} geometry={geo} material={mats.energyFlowMat} />
        ))}
        <instancedMesh
          ref={airflowPulseRef}
          args={[undefined, undefined, pulseCount]}
          frustumCulled={false}
          material={mats.energyFlowMat}
        >
          <sphereGeometry args={[1, 10, 10]} />
        </instancedMesh>
      </group>

      {/* ================================================================= */}
      {/* 03 STRUCTURAL ENGINEERING LAYER: CORES, STEEL COLUMNS, SEISMIC    */}
      {/* ================================================================= */}
      <group ref={structGroupRef} name="layer-structure">
        {/* Twin Asymmetric Board-Formed Concrete Seismic Shear Cores (flanking atrium) */}
        <mesh position={[-5.1, 6.4, -2.5]} castShadow={!isSoftwareGl} receiveShadow material={mats.shearCoreMat}>
          <boxGeometry args={[1.45, 12.4, 2.3]} />
        </mesh>
        <mesh position={[5.1, 6.4, -2.5]} castShadow={!isSoftwareGl} receiveShadow material={mats.shearCoreMat}>
          <boxGeometry args={[1.45, 12.4, 2.3]} />
        </mesh>

        {/* Engineered Wide-Flange Steel Column Grid */}
        <instancedMesh ref={columnRef} args={[undefined, undefined, columns.length]} castShadow={!isSoftwareGl} material={mats.steelFrameMat}>
          <boxGeometry args={[0.26, 1, 0.26]} />
        </instancedMesh>

        {/* Primary Composite Floor Transfer Beams */}
        {[-5.4, -1.8, 1.8, 5.4].map((z, idx) => (
          <mesh key={`g6-${idx}`} position={[0, 6.62, z]} material={mats.steelFrameMat}>
            <boxGeometry args={[14.4, 0.24, 0.22]} />
          </mesh>
        ))}
        {[-4.8, 0, 4.8].map((z, idx) => (
          <mesh key={`g10-${idx}`} position={[0, 10.08, z]} material={mats.steelFrameMat}>
            <boxGeometry args={[13.6, 0.22, 0.2]} />
          </mesh>
        ))}

        {/* Longitudinal Edge Girders */}
        {[-7.1, -2.75, 2.75, 7.1].map((x, idx) => (
          <mesh key={`lx-${idx}`} position={[x, 6.62, 0]} material={mats.steelFrameMat}>
            <boxGeometry args={[0.2, 0.24, 11.2]} />
          </mesh>
        ))}

        {/* Seismic Chevron / Eccentric Steel Bracing Diagonals (Bays on outer structural frames) */}
        {[
          { x: -5.95, y: 1.85, z: 5.4, rz: 0.42 },
          { x: -5.95, y: 1.85, z: 5.4, rz: -0.42 },
          { x: 5.95, y: 1.85, z: 5.4, rz: 0.42 },
          { x: 5.95, y: 1.85, z: 5.4, rz: -0.42 },
          { x: -5.95, y: 5.1, z: -5.4, rz: 0.44 },
          { x: 5.95, y: 5.1, z: -5.4, rz: -0.44 },
          { x: -3.75, y: 8.4, z: -4.8, rz: 0.5 },
          { x: 3.75, y: 8.4, z: -4.8, rz: -0.5 },
        ].map((b, i) => (
          <mesh key={i} position={[b.x, b.y, b.z]} rotation={[0, 0, b.rz]} material={mats.bracingSteelMat}>
            <cylinderGeometry args={[0.075, 0.075, 3.6, 12]} />
          </mesh>
        ))}

        {/* Deep Mat Foundation Tie Grid */}
        <mesh position={[0, 0.22, 0]} material={mats.shearCoreMat}>
          <boxGeometry args={[14.8, 0.16, 11.4]} />
        </mesh>
      </group>
    </group>
  );
};
