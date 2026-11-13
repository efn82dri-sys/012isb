import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SceneStateSnapshot } from './heroSceneConfig';
import { createPhotorealisticMaterials } from './architecturalMaterials';
import { BuildingModel } from './BuildingModel';
import { ExplodedLayers } from './ExplodedLayers';
import { InteriorReveal } from './InteriorReveal';
import { LightTransition } from './LightTransition';
import { CameraController } from './CameraController';

interface ArchitecturalSceneProps {
  sceneStateRef: React.MutableRefObject<SceneStateSnapshot>;
  isSoftwareGl: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
  onReady?: () => void;
  onWebglError: () => void;
}

const _dayBg = new THREE.Color('#D7E2EE');
const _nightBg = new THREE.Color('#0B1536');
const _blendBg = new THREE.Color();

const StudioAtmosphereRig: React.FC<{
  sceneStateRef: React.MutableRefObject<SceneStateSnapshot>;
}> = ({ sceneStateRef }) => {
  const { gl, scene } = useThree();
  const sunRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiRef = useRef<THREE.HemisphereLight | null>(null);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const envTex = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envTex;
    room.dispose();
    pmrem.dispose();

    const bgColor = new THREE.Color('#D7E2EE');
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2('#D7E2EE', 0.0115);

    return () => {
      if (scene.environment === envTex) scene.environment = null;
      envTex.dispose();
    };
  }, [gl, scene]);

  useFrame(() => {
    const { skyNightFactor } = sceneStateRef.current;
    _blendBg.copy(_dayBg).lerp(_nightBg, skyNightFactor);

    if (scene.background instanceof THREE.Color) {
      scene.background.copy(_blendBg);
    }
    if (scene.fog instanceof THREE.FogExp2) {
      scene.fog.color.copy(_blendBg);
      scene.fog.density = THREE.MathUtils.lerp(0.0115, 0.022, skyNightFactor);
    }
    if (sunRef.current) {
      sunRef.current.intensity = THREE.MathUtils.lerp(2.7, 0.55, skyNightFactor);
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = THREE.MathUtils.lerp(0.95, 0.35, skyNightFactor);
    }
  });

  return (
    <>
      <hemisphereLight ref={hemiRef} args={[0xf1f6ff, 0x8d877f, 0.95]} />
      {/* Natural Warm Daylight Sun Casting Crisp Architectural Shadows */}
      <directionalLight
        ref={sunRef}
        color={0xfff4e0}
        intensity={2.7}
        position={[24, 30, 20]}
        castShadow
        shadow-mapSize-width={1536}
        shadow-mapSize-height={1536}
        shadow-camera-near={4}
        shadow-camera-far={85}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      {/* Cool Architectural Sky Bounce Fill */}
      <directionalLight color={0xaec6eb} intensity={0.8} position={[-18, 12, -16]} />
      {/* Warm Atrium Interior Cove Illumination */}
      <pointLight color={0xffebd2} intensity={4.5} distance={18} decay={1.6} position={[0, 5.2, 0.5]} />
      <pointLight color={0x03a54e} intensity={1.1} distance={16} decay={2} position={[0, 4.1, -6.2]} />
    </>
  );
};

const SceneContents: React.FC<{
  sceneStateRef: React.MutableRefObject<SceneStateSnapshot>;
  isSoftwareGl: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
}> = ({ sceneStateRef, isSoftwareGl, isMobile, reducedMotion }) => {
  const { gl } = useThree();
  const maxAniso = useMemo(() => {
    try {
      return Math.min(8, gl.capabilities.getMaxAnisotropy());
    } catch {
      return 1;
    }
  }, [gl]);

  const mats = useMemo(
    () => createPhotorealisticMaterials(isSoftwareGl, isMobile, maxAniso),
    [isSoftwareGl, isMobile, maxAniso]
  );

  useEffect(() => {
    return () => {
      mats.dispose();
    };
  }, [mats]);

  const archGroupRef = useRef<THREE.Group | null>(null);
  const energyGroupRef = useRef<THREE.Group | null>(null);
  const structGroupRef = useRef<THREE.Group | null>(null);

  return (
    <>
      <StudioAtmosphereRig sceneStateRef={sceneStateRef} />
      <CameraController
        sceneStateRef={sceneStateRef}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
      />
      <BuildingModel
        mats={mats}
        sceneStateRef={sceneStateRef}
        isSoftwareGl={isSoftwareGl}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
        archGroupRef={archGroupRef}
        energyGroupRef={energyGroupRef}
        structGroupRef={structGroupRef}
      />
      <ExplodedLayers
        sceneStateRef={sceneStateRef}
        mats={mats}
        isMobile={isMobile}
        isSoftwareGl={isSoftwareGl}
        archGroupRef={archGroupRef}
        energyGroupRef={energyGroupRef}
        structGroupRef={structGroupRef}
      />
      <InteriorReveal
        sceneStateRef={sceneStateRef}
        mats={mats}
        isSoftwareGl={isSoftwareGl}
      />
      <LightTransition sceneStateRef={sceneStateRef} />
    </>
  );
};

class SceneErrorBoundary extends React.Component<
  { onError: () => void; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { onError: () => void; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export const ArchitecturalScene: React.FC<ArchitecturalSceneProps> = ({
  sceneStateRef,
  isSoftwareGl,
  isMobile,
  reducedMotion,
  onReady,
  onWebglError,
}) => {
  return (
    <SceneErrorBoundary onError={onWebglError}>
      <Canvas
        shadows={!isSoftwareGl}
        dpr={isSoftwareGl ? 1 : isMobile ? [1, 1.5] : [1, 2]}
        style={{ touchAction: 'pan-y' }}
        camera={{
          fov: 36,
          near: 0.15,
          far: 180,
          position: [14.5, 4.1, 23.0],
        }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene, camera }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.04;
          gl.shadowMap.enabled = !isSoftwareGl;
          gl.shadowMap.type = THREE.PCFSoftShadowMap;
          if (!isSoftwareGl) {
            try {
              gl.compile(scene, camera);
            } catch {
              // ignore shader pre-compile edge case
            }
          }
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            onWebglError();
          });
          requestAnimationFrame(() => {
            onReady?.();
          });
        }}
      >
        <SceneContents
          sceneStateRef={sceneStateRef}
          isSoftwareGl={isSoftwareGl}
          isMobile={isMobile}
          reducedMotion={reducedMotion}
        />
      </Canvas>
    </SceneErrorBoundary>
  );
};
