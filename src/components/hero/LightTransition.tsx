import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SceneStateSnapshot } from './heroSceneConfig';

interface LightTransitionProps {
  sceneStateRef: React.MutableRefObject<SceneStateSnapshot>;
}

const APERTURE_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const APERTURE_FRAG = `
  varying vec2 vUv;
  uniform float uExpand;
  uniform float uOpacity;
  uniform float uTime;

  void main() {
    vec2 centered = (vUv - 0.5) * 2.0;
    float dist = length(centered);
    float angle = atan(centered.y, centered.x);

    // Subtle concentric optical iris caustics and Fresnel refraction rings (not a star icon)
    float radius = mix(0.045, 1.55, uExpand);
    float ring1 = exp(-pow((dist - radius * 0.45) * 9.5, 2.0)) * 0.55;
    float ring2 = exp(-pow((dist - radius * 0.78) * 6.5, 2.0)) * 0.35;
    float radialRay = 0.04 * cos(angle * 12.0 + uTime * 0.45) * exp(-dist * 3.0);

    float coreGlow = smoothstep(radius, radius * 0.12, dist);
    float outerFalloff = smoothstep(radius * 1.45, radius * 0.25, dist);

    vec3 warmCore = vec3(0.98, 0.99, 1.0);
    vec3 emeraldCorona = vec3(0.012, 0.647, 0.306);
    vec3 sapphireHalo = vec3(0.133, 0.224, 0.506);

    vec3 col = mix(sapphireHalo, emeraldCorona, smoothstep(0.0, 0.6, outerFalloff));
    col = mix(col, warmCore, clamp(coreGlow * 0.92 + ring1 * 0.45, 0.0, 1.0));
    col += emeraldCorona * ring2 + warmCore * radialRay;

    float alpha = clamp((outerFalloff * 0.96 + ring1 * 0.4) * uOpacity, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

/**
 * Scene 06 — Optical Architectural Light Aperture Shader
 * Expands from a concentrated oculus point into an organic radial lens transition.
 */
export const LightTransition: React.FC<LightTransitionProps> = ({ sceneStateRef }) => {
  const groupRef = useRef<THREE.Group | null>(null);

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uExpand: { value: 0 },
          uOpacity: { value: 0 },
          uTime: { value: 0 },
        },
        vertexShader: APERTURE_VERT,
        fragmentShader: APERTURE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const ringMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0xdbeafe,
        roughness: 0.1,
        metalness: 0.85,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  useEffect(() => {
    return () => {
      shaderMat.dispose();
      ringMat.dispose();
    };
  }, [shaderMat, ringMat]);

  useFrame((state) => {
    const s = sceneStateRef.current;
    const active = s.apertureAlpha > 0.01;
    if (groupRef.current) {
      groupRef.current.visible = active;
    }
    if (!active) return;

    shaderMat.uniforms.uExpand.value = s.apertureExpand;
    shaderMat.uniforms.uOpacity.value = s.apertureAlpha;
    shaderMat.uniforms.uTime.value = state.clock.getElapsedTime();
    ringMat.opacity = s.apertureAlpha * 0.68 * (1 - s.apertureExpand * 0.55);
  });

  return (
    <group ref={groupRef} position={[0, 4.1, -9.8]} name="optical-light-aperture">
      {/* Precision anodized architectural oculus bezel */}
      <mesh material={ringMat}>
        <torusGeometry args={[1.45, 0.045, 16, 72]} />
      </mesh>
      <mesh material={ringMat}>
        <torusGeometry args={[2.15, 0.025, 12, 72]} />
      </mesh>

      {/* Expanding GLSL radial optical aperture disc */}
      <mesh position={[0, 0, 0.1]} renderOrder={10} material={shaderMat}>
        <planeGeometry args={[18, 18]} />
      </mesh>
    </group>
  );
};
