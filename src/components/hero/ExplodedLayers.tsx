import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PhotorealisticMaterialSet } from './architecturalMaterials';
import { SceneStateSnapshot } from './heroSceneConfig';

interface ExplodedLayersProps {
  sceneStateRef: React.MutableRefObject<SceneStateSnapshot>;
  mats: PhotorealisticMaterialSet;
  isMobile: boolean;
  isSoftwareGl: boolean;
  archGroupRef: React.RefObject<THREE.Group | null>;
  energyGroupRef: React.RefObject<THREE.Group | null>;
  structGroupRef: React.RefObject<THREE.Group | null>;
}

/**
 * Coordinates deterministic, reversible scroll-driven separation of the
 * Architecture, Energy, and Structural layers during Scene 03, then smoothly
 * reconstructs the integrated building into Scene 04.
 */
export const ExplodedLayers: React.FC<ExplodedLayersProps> = ({
  sceneStateRef,
  mats,
  isMobile,
  isSoftwareGl,
  archGroupRef,
  energyGroupRef,
  structGroupRef,
}) => {
  const datumLinesRef = useRef<THREE.LineSegments | null>(null);

  const datumGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pts = new Float32Array([
      -9.5, 0.4, 0, 9.5, 0.4, 0,
      0, 0.4, 0, 0, 17.5, 0,
      -9.5, 6.85, 0, 9.5, 6.85, 0,
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
    return geo;
  }, []);

  const datumMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: 0x223981,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  useEffect(() => {
    return () => {
      datumGeo.dispose();
      datumMat.dispose();
    };
  }, [datumGeo, datumMat]);

  useFrame(() => {
    const { explodeFactor, progress, skyNightFactor } = sceneStateRef.current;
    const spreadX = isMobile ? 4.4 : 6.8;
    const liftY = isMobile ? 3.8 : 5.4;

    if (archGroupRef.current) {
      archGroupRef.current.position.set(
        -explodeFactor * spreadX,
        explodeFactor * 1.1,
        explodeFactor * 0.9
      );
    }

    if (energyGroupRef.current) {
      energyGroupRef.current.position.set(0, explodeFactor * liftY, 0);
      // Energy thermal envelope subtly intensifies during exploded inspection
      mats.thermalShellMat.opacity = 0.08 + explodeFactor * 0.2;
      mats.energyFlowMat.opacity = 0.55 + explodeFactor * 0.4;
    }

    if (structGroupRef.current) {
      structGroupRef.current.position.set(
        explodeFactor * spreadX,
        0,
        -explodeFactor * 1.1
      );
    }

    // Fade outer architectural shell slightly at Scene 05+ twilight cylindrical reveal
    const envelopeFade = 1 - THREE.MathUtils.smoothstep(progress, 0.65, 0.78) * 0.65;
    mats.travertineMat.opacity = envelopeFade;
    mats.timberSoffitMat.opacity = envelopeFade;
    mats.bronzeMullionMat.opacity = envelopeFade;
    mats.glassCurtainMat.opacity = (isSoftwareGl ? 0.42 : 0.94) * envelopeFade;
    mats.warmInteriorWallMat.opacity = envelopeFade;

    // Gentle transition from bright daylight architecture toward twilight gallery
    mats.coveLightMat.emissiveIntensity = 1.2 + skyNightFactor * 1.4;

    datumMat.opacity = explodeFactor * 0.48;
    if (datumLinesRef.current) {
      datumLinesRef.current.visible = explodeFactor > 0.015;
    }
  });

  return <lineSegments ref={datumLinesRef} geometry={datumGeo} material={datumMat} />;
};
