import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { SceneStateSnapshot, evaluateCameraAtProgress } from './heroSceneConfig';

interface CameraControllerProps {
  sceneStateRef: React.MutableRefObject<SceneStateSnapshot>;
  reducedMotion: boolean;
  isMobile: boolean;
}

// Pre-allocated scratch math helpers for zero-GC render ticks
const _desiredPos = new THREE.Vector3();
const _desiredLook = new THREE.Vector3();
const _currentLook = new THREE.Vector3(0, 4.4, 0);

/**
 * Deterministic scroll-driven camera rig evaluating continuous CatmullRom keyframes
 * with damped pointer micro-parallax (disabled on mobile & reduced motion).
 */
export const CameraController: React.FC<CameraControllerProps> = ({
  sceneStateRef,
  reducedMotion,
  isMobile,
}) => {
  const { camera } = useThree();
  const pointerRef = useRef({ x: 0, y: 0 });
  const initializedRef = useRef(false);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (isMobile || reducedMotion) return;
      pointerRef.current.x = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerRef.current.y = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [isMobile, reducedMotion]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const { progress } = sceneStateRef.current;

    const targetFov = evaluateCameraAtProgress(progress, _desiredPos, _desiredLook);

    // Subtle human-eye micro-parallax scaled down inside interior rooms
    const parallaxScale = (1 - THREE.MathUtils.smoothstep(progress, 0.45, 0.85)) * 0.45;
    if (!isMobile && !reducedMotion) {
      _desiredPos.x += pointerRef.current.x * parallaxScale;
      _desiredPos.y -= pointerRef.current.y * (parallaxScale * 0.55);
    }

    if (!initializedRef.current || reducedMotion) {
      camera.position.copy(_desiredPos);
      _currentLook.copy(_desiredLook);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = targetFov;
        camera.updateProjectionMatrix();
      }
      camera.lookAt(_currentLook);
      initializedRef.current = true;
      return;
    }

    const dampLambda = 7.5;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, _desiredPos.x, dampLambda, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, _desiredPos.y, dampLambda, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, _desiredPos.z, dampLambda, dt);

    _currentLook.x = THREE.MathUtils.damp(_currentLook.x, _desiredLook.x, dampLambda, dt);
    _currentLook.y = THREE.MathUtils.damp(_currentLook.y, _desiredLook.y, dampLambda, dt);
    _currentLook.z = THREE.MathUtils.damp(_currentLook.z, _desiredLook.z, dampLambda, dt);

    if (camera instanceof THREE.PerspectiveCamera && Math.abs(camera.fov - targetFov) > 0.02) {
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 6.0, dt);
      camera.updateProjectionMatrix();
    }

    camera.lookAt(_currentLook);
  });

  return null;
};
