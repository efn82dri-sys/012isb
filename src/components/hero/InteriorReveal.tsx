import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PhotorealisticMaterialSet } from './architecturalMaterials';
import { SceneStateSnapshot } from './heroSceneConfig';

interface InteriorRevealProps {
  sceneStateRef: React.MutableRefObject<SceneStateSnapshot>;
  mats: PhotorealisticMaterialSet;
  isSoftwareGl: boolean;
}

/**
 * Scene 04 + Scene 05 3D spatial staging:
 * - Physical frosted architectural glass partition framing the camera threshold
 * - Warm sunlit architectural studio bay rising vertically into frame as the frosted plane parts
 * - Semi-translucent ribbed cylindrical rotunda backdrop enclosing Scene 05 metrics
 */
export const InteriorReveal: React.FC<InteriorRevealProps> = ({
  sceneStateRef,
  mats,
  isSoftwareGl,
}) => {
  const frostedGroupRef = useRef<THREE.Group | null>(null);
  const frostedPaneRef = useRef<THREE.Mesh | null>(null);
  const studioVolumeRef = useRef<THREE.Group | null>(null);
  const cylinderRef = useRef<THREE.Group | null>(null);

  const ribAngles = useMemo(
    () => Array.from({ length: 24 }, (_, idx) => (idx / 24) * Math.PI * 2),
    []
  );

  useFrame(() => {
    const s = sceneStateRef.current;

    // Scene 04 Frosted architectural partition
    if (frostedGroupRef.current && frostedPaneRef.current) {
      const visible = s.frostedAlpha > 0.01 || (s.progress > 0.48 && s.progress < 0.67);
      frostedGroupRef.current.visible = visible;

      // Pane slides smoothly upward out of frame as scroll advances
      const liftY = s.frostedOpenProgress * 3.8;
      frostedPaneRef.current.position.y = 3.9 + liftY;

      const baseOp = isSoftwareGl ? 0.72 : 0.92;
      mats.frostedGlassMat.opacity =
        baseOp * s.frostedAlpha * (1 - s.frostedOpenProgress * 0.42);
    }

    // Scene 04 Rising Architectural Interior Studio Vignette
    if (studioVolumeRef.current) {
      const active = s.progress > 0.48 && s.progress < 0.78;
      studioVolumeRef.current.visible = active;
      // Rises vertically into alignment at y = 0
      const riseOffset = (1 - s.interiorRiseProgress) * -2.8;
      studioVolumeRef.current.position.y = riseOffset;
    }

    // Scene 05 Soft Architectural Cylindrical Surface
    if (cylinderRef.current) {
      const cylActive = s.performanceAlpha > 0.01 || (s.progress > 0.62 && s.progress < 0.86);
      cylinderRef.current.visible = cylActive;
      mats.cylinderGalleryMat.opacity = s.performanceAlpha * 0.48;
      cylinderRef.current.rotation.y = s.progress * Math.PI * 0.35;
    }
  });

  return (
    <group name="interior-and-gallery-reveal">
      {/* SCENE 04: SEMI-TRANSPARENT FROSTED GLASS ARCHITECTURAL PLANE */}
      <group ref={frostedGroupRef} position={[0, 0, 2.2]}>
        <mesh ref={frostedPaneRef} position={[0, 3.9, 0]} renderOrder={6} material={mats.frostedGlassMat}>
          <boxGeometry args={[6.8, 3.8, 0.06]} />
        </mesh>
        {/* Anodized mullion threshold frame */}
        <mesh position={[-3.45, 3.9, 0]} material={mats.bronzeMullionMat}>
          <boxGeometry args={[0.1, 4.4, 0.12]} />
        </mesh>
        <mesh position={[3.45, 3.9, 0]} material={mats.bronzeMullionMat}>
          <boxGeometry args={[0.1, 4.4, 0.12]} />
        </mesh>
      </group>

      {/* SCENE 04: ARCHITECTURAL STUDIO INTERIOR RISING BEHIND FROSTED PLANE */}
      <group ref={studioVolumeRef} position={[0, 0, -2.2]}>
        {/* Timber & Travertine Architectural Model Pedestal Table */}
        <mesh position={[0, 2.85, 0]} receiveShadow material={mats.travertineMat}>
          <boxGeometry args={[4.8, 0.24, 2.2]} />
        </mesh>
        <mesh position={[0, 2.71, 0]} material={mats.timberSoffitMat}>
          <boxGeometry args={[4.6, 0.08, 2.0]} />
        </mesh>
        {/* Warm Oak Acoustic Slatted Back Wall */}
        <mesh position={[0, 4.35, -1.8]} material={mats.timberSoffitMat}>
          <boxGeometry args={[6.4, 3.1, 0.14]} />
        </mesh>
        {/* Illuminated Architectural Light Cove */}
        <mesh position={[0, 5.75, -1.65]} material={mats.coveLightMat}>
          <boxGeometry args={[5.8, 0.08, 0.14]} />
        </mesh>
        {/* Architectural Table Scale Massing Study */}
        <mesh position={[-0.7, 3.22, 0]} material={mats.boardConcreteMat}>
          <boxGeometry args={[1.1, 0.5, 0.8]} />
        </mesh>
        <mesh position={[0.5, 3.35, 0.08]} material={mats.glassCurtainMat}>
          <boxGeometry args={[0.85, 0.76, 0.72]} />
        </mesh>
      </group>

      {/* SCENE 05: SOFT ARCHITECTURAL CYLINDRICAL ROTUNDA BACKDROP */}
      <group ref={cylinderRef} position={[0, 4.1, -6.4]}>
        <mesh material={mats.cylinderGalleryMat} renderOrder={4}>
          <cylinderGeometry args={[6.2, 6.2, 7.6, 48, 1, true]} />
        </mesh>
        {/* Architectural cylindrical vertical fins framing soft depth */}
        {ribAngles.map((ang, i) => (
          <mesh
            key={i}
            position={[Math.cos(ang) * 6.08, 0, Math.sin(ang) * 6.08]}
            rotation={[0, -ang, 0]}
            material={mats.bronzeMullionMat}
          >
            <boxGeometry args={[0.05, 7.2, 0.12]} />
          </mesh>
        ))}
        {/* Top & bottom cylindrical shadow rings */}
        <mesh position={[0, 3.65, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.coveLightMat}>
          <torusGeometry args={[6.05, 0.04, 12, 64]} />
        </mesh>
        <mesh position={[0, -3.65, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.bronzeMullionMat}>
          <torusGeometry args={[6.05, 0.06, 12, 64]} />
        </mesh>
      </group>
    </group>
  );
};
