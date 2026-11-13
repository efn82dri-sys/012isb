import * as THREE from 'three';
import { Language } from '../../types/isb';

export type SceneId =
  | 'arrival'
  | 'flythrough'
  | 'exploded'
  | 'interior'
  | 'performance'
  | 'aperture'
  | 'brand';

export interface SceneSegment {
  id: SceneId;
  index: string;
  start: number;
  end: number;
  label: { fa: string; en: string };
}

export const HERO_SCENE_SEGMENTS: SceneSegment[] = [
  {
    id: 'arrival',
    index: '01',
    start: 0.0,
    end: 0.14,
    label: { fa: 'ورود معماری', en: 'Arrival' },
  },
  {
    id: 'flythrough',
    index: '02',
    start: 0.14,
    end: 0.29,
    label: { fa: 'پیمایش فضایی', en: 'Fly-Through' },
  },
  {
    id: 'exploded',
    index: '03',
    start: 0.29,
    end: 0.5,
    label: { fa: 'تفکیک سامانه‌ها', en: 'Exploded System' },
  },
  {
    id: 'interior',
    index: '04',
    start: 0.5,
    end: 0.64,
    label: { fa: 'شفافیت فضا', en: 'Interior Reveal' },
  },
  {
    id: 'performance',
    index: '05',
    start: 0.64,
    end: 0.78,
    label: { fa: 'عملکرد و داده‌ها', en: 'Performance' },
  },
  {
    id: 'aperture',
    index: '06',
    start: 0.78,
    end: 0.9,
    label: { fa: 'روزنه نور', en: 'Light Aperture' },
  },
  {
    id: 'brand',
    index: '07',
    start: 0.9,
    end: 1.0,
    label: { fa: 'هویت ISB', en: 'Brand Reveal' },
  },
];

export interface CameraKeyframe {
  t: number;
  pos: [number, number, number];
  lookAt: [number, number, number];
  fov: number;
}

/**
 * Physically continuous camera waypoints across Scenes 01–06.
 * Passing through the central portal (z=+6.5, width 4.8m, height 6.4m)
 * avoids all mullions, columns, and shear cores (located at x = +-4.6m).
 */
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  // Scene 01: Wide sunlit exterior photography perspective
  { t: 0.0, pos: [14.5, 4.1, 23.0], lookAt: [0.0, 4.4, 0.0], fov: 36 },
  { t: 0.08, pos: [9.4, 3.4, 18.0], lookAt: [0.0, 3.8, 1.5], fov: 37 },
  { t: 0.14, pos: [4.2, 2.7, 13.5], lookAt: [0.0, 3.1, 2.5], fov: 38 },

  // Scene 02: Smooth architectural approach and fly-through into double-height atrium
  { t: 0.19, pos: [0.6, 2.45, 9.2], lookAt: [0.0, 2.9, -1.5], fov: 40 },
  { t: 0.24, pos: [0.0, 2.55, 3.8], lookAt: [0.0, 3.3, -4.5], fov: 43 },
  { t: 0.29, pos: [-0.8, 3.4, -0.8], lookAt: [0.0, 4.1, -6.5], fov: 44 },

  // Scene 03: Ascend and pull back to high architectural axonometric view for 3-layer separation
  { t: 0.34, pos: [11.2, 8.8, 16.5], lookAt: [0.0, 4.9, 0.0], fov: 37 },
  { t: 0.41, pos: [14.8, 10.6, 18.8], lookAt: [0.0, 5.2, 0.0], fov: 36 },
  { t: 0.46, pos: [12.4, 9.4, 16.2], lookAt: [0.0, 4.8, 0.0], fov: 36 },
  { t: 0.5, pos: [5.4, 4.5, 11.0], lookAt: [0.0, 4.2, 0.0], fov: 38 },

  // Scene 04: Frosted glass plane threshold looking toward rising upper studio interior
  { t: 0.56, pos: [0.0, 3.85, 7.2], lookAt: [0.0, 3.9, -2.5], fov: 38 },
  { t: 0.64, pos: [0.0, 3.95, 5.4], lookAt: [0.0, 4.0, -4.0], fov: 39 },

  // Scene 05: Cylindrical gallery space
  { t: 0.71, pos: [0.0, 4.1, 3.2], lookAt: [0.0, 4.1, -5.5], fov: 40 },
  { t: 0.78, pos: [0.0, 4.1, 1.4], lookAt: [0.0, 4.1, -7.0], fov: 42 },

  // Scene 06: Optical light aperture approach
  { t: 0.85, pos: [0.0, 4.1, -2.4], lookAt: [0.0, 4.1, -9.0], fov: 46 },
  { t: 0.9, pos: [0.0, 4.1, -5.2], lookAt: [0.0, 4.1, -11.0], fov: 50 },

  // Scene 07: Settled beyond aperture
  { t: 1.0, pos: [0.0, 4.1, -6.2], lookAt: [0.0, 4.1, -12.0], fov: 50 },
];

// Reusable spline curves for ultra-smooth C1 camera trajectory
const _posCurve = new THREE.CatmullRomCurve3(
  CAMERA_KEYFRAMES.map((k) => new THREE.Vector3(...k.pos)),
  false,
  'catmullrom',
  0.42
);

const _lookCurve = new THREE.CatmullRomCurve3(
  CAMERA_KEYFRAMES.map((k) => new THREE.Vector3(...k.lookAt)),
  false,
  'catmullrom',
  0.42
);

export function evaluateCameraAtProgress(
  progress: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3
): number {
  const p = THREE.MathUtils.clamp(progress, 0, 1);

  // Piecewise linear parameter mapping across keyframe t values so timing matches scenes cleanly
  let segmentIdx = 0;
  for (let i = 0; i < CAMERA_KEYFRAMES.length - 1; i++) {
    if (p >= CAMERA_KEYFRAMES[i].t && p <= CAMERA_KEYFRAMES[i + 1].t) {
      segmentIdx = i;
      break;
    }
  }
  if (p >= CAMERA_KEYFRAMES[CAMERA_KEYFRAMES.length - 1].t) {
    segmentIdx = CAMERA_KEYFRAMES.length - 2;
  }

  const kf0 = CAMERA_KEYFRAMES[segmentIdx];
  const kf1 = CAMERA_KEYFRAMES[segmentIdx + 1];
  const span = Math.max(0.0001, kf1.t - kf0.t);
  const localAlpha = THREE.MathUtils.smoothstep((p - kf0.t) / span, 0, 1);

  const u = (segmentIdx + localAlpha) / (CAMERA_KEYFRAMES.length - 1);
  _posCurve.getPoint(THREE.MathUtils.clamp(u, 0, 1), outPos);
  _lookCurve.getPoint(THREE.MathUtils.clamp(u, 0, 1), outLook);

  return THREE.MathUtils.lerp(kf0.fov, kf1.fov, localAlpha);
}

/**
 * Normalized local scene weights computed deterministically from scroll progress [0..1].
 */
export interface SceneStateSnapshot {
  progress: number;
  activeScene: SceneId;
  activeSceneIndex: string;
  // Smooth 0..1 visibility weights per scene
  arrivalAlpha: number;
  flythroughAlpha: number;
  explodedOverlayAlpha: number;
  explodeFactor: number; // 0 unified -> 1 separated -> 0 reconstructed
  frostedAlpha: number; // Frosted plane presence
  frostedOpenProgress: number; // 0 closed -> 1 parted/risen
  interiorRiseProgress: number; // 0 lowered -> 1 risen in view
  performanceAlpha: number; // Scene 05 visibility
  performanceCounterProgress: number; // 0 -> 1 counter roll
  apertureAlpha: number; // Scene 06 radial optical flare
  apertureExpand: number; // 0 pinpoint -> 1 full viewport wash
  brandAlpha: number; // Scene 07 curtain & brand reveal
  brandCurtainProgress: number; // 0 closed -> 1 open
  skyNightFactor: number; // 0 bright daylight -> 1 deep architectural twilight
}

function bandAlpha(p: number, fadeInStart: number, fullStart: number, fullEnd: number, fadeOutEnd: number): number {
  if (p <= fadeInStart || p >= fadeOutEnd) return 0;
  if (p < fullStart) return THREE.MathUtils.smoothstep(p, fadeInStart, fullStart);
  if (p > fullEnd) return 1 - THREE.MathUtils.smoothstep(p, fullEnd, fadeOutEnd);
  return 1;
}

export function computeSceneState(rawProgress: number): SceneStateSnapshot {
  const p = THREE.MathUtils.clamp(rawProgress, 0, 1);

  let activeScene: SceneId = 'arrival';
  let activeSceneIndex = '01';
  for (const seg of HERO_SCENE_SEGMENTS) {
    if (p >= seg.start && (p < seg.end || seg.end === 1)) {
      activeScene = seg.id;
      activeSceneIndex = seg.index;
      break;
    }
  }

  // Exploded separation: ramp up 0.30..0.38, hold 0.38..0.44, reconstruct 0.44..0.50
  let explodeFactor = 0;
  if (p > 0.3 && p < 0.5) {
    if (p < 0.38) {
      explodeFactor = THREE.MathUtils.smoothstep(p, 0.3, 0.38);
    } else if (p <= 0.44) {
      explodeFactor = 1;
    } else {
      explodeFactor = 1 - THREE.MathUtils.smoothstep(p, 0.44, 0.5);
    }
  }

  // Scene 04 frosted plane & interior vertical rise
  const frostedAlpha = bandAlpha(p, 0.49, 0.52, 0.62, 0.65);
  const frostedOpenProgress = THREE.MathUtils.smoothstep(p, 0.51, 0.63);
  const interiorRiseProgress = THREE.MathUtils.smoothstep(p, 0.5, 0.62);

  // Scene 05 data counters & cylindrical studio
  const performanceAlpha = bandAlpha(p, 0.63, 0.66, 0.76, 0.79);
  const performanceCounterProgress = THREE.MathUtils.smoothstep(p, 0.65, 0.75);

  // Scene 06 optical aperture
  const apertureAlpha = bandAlpha(p, 0.77, 0.8, 0.89, 0.93);
  const apertureExpand = THREE.MathUtils.smoothstep(p, 0.79, 0.9);

  // Scene 07 ISB brand reveal
  const brandAlpha = THREE.MathUtils.smoothstep(p, 0.89, 0.94);
  const brandCurtainProgress = THREE.MathUtils.smoothstep(p, 0.9, 0.96);

  // Daylight transitions smoothly into architectural twilight starting at Scene 05
  const skyNightFactor = THREE.MathUtils.smoothstep(p, 0.62, 0.82);

  return {
    progress: p,
    activeScene,
    activeSceneIndex,
    arrivalAlpha: bandAlpha(p, -0.01, 0.0, 0.11, 0.15),
    flythroughAlpha: bandAlpha(p, 0.13, 0.16, 0.26, 0.3),
    explodedOverlayAlpha: bandAlpha(p, 0.31, 0.35, 0.45, 0.495),
    explodeFactor,
    frostedAlpha,
    frostedOpenProgress,
    interiorRiseProgress,
    performanceAlpha,
    performanceCounterProgress,
    apertureAlpha,
    apertureExpand,
    brandAlpha,
    brandCurtainProgress,
    skyNightFactor,
  };
}

export function getStoryCopy(lang: Language) {
  return {
    cornerTopLeft: 'ISB / 2026',
    cornerTopRight:
      lang === 'fa'
        ? 'معماری × مهندسی × پایداری'
        : 'ARCHITECTURE × ENGINEERING × SUSTAINABILITY',
    cornerBottomLeft:
      lang === 'fa'
        ? 'مشهد · ۳۶.۳۲° شمالی · ۵۹.۵۳° شرقی'
        : 'MASHHAD · 36.32° N · 59.53° E',
    scrollPrompt: lang === 'fa' ? 'برای پیمایش صحنه‌ها اسکرول کنید' : 'SCROLL TO EXPLORE',
    scene01: {
      headline: lang === 'fa' ? 'آینده را مهندسی می‌کنیم.' : "WE DESIGN WHAT'S NEXT.",
      secondary: 'فراتر از معماری؛ در مسیر آینده‌ای پایدار',
      thesis:
        lang === 'fa'
          ? 'ما صرفاً ساختمان نمی‌سازیم؛ محیط‌هایی هوشمند، یکپارچه و پایدار می‌آفرینیم.'
          : "We don't just design buildings. We design intelligent, integrated and sustainable environments.",
    },
    scene02: {
      eyebrow: lang === 'fa' ? '۰۲ · پیمایش فضایی' : '02 · SPATIAL CONTINUITY',
      headline:
        lang === 'fa' ? 'معماری فراتر از فرم است.' : 'ARCHITECTURE IS MORE THAN FORM.',
      caption:
        lang === 'fa'
          ? 'گذر از پوسته شیشه‌ای Low-E به قلب آتریوم نورگیر و فضاهای داخلی زنده'
          : 'Passing through calibrated Low-E glazing into daylight-driven interior circulation.',
    },
    scene03: {
      eyebrow: lang === 'fa' ? '۰۳ · کالبد یکپارچه' : '03 · INTEGRATED SYSTEMS',
      headline:
        lang === 'fa'
          ? 'سه تخصص. یک هوش مهندسی.'
          : 'THREE DISCIPLINES. ONE INTELLIGENCE.',
      layers: [
        {
          index: '01',
          title: lang === 'fa' ? 'لایه معماری و شهرسازی' : 'ARCHITECTURAL LAYER',
          accent: '#1E3980',
          items:
            lang === 'fa'
              ? ['پوسته ساختمان و نما', 'سازمان‌دهی فضایی داخل', 'لوورها و هندسه اقلیمی']
              : ['Building envelope & façade', 'Interior spatial organization', 'Climatic brise-soleil geometry'],
        },
        {
          index: '02',
          title: lang === 'fa' ? 'لایه انرژی و سیستم‌ها' : 'ENERGY LAYER',
          accent: '#03A54E',
          items:
            lang === 'fa'
              ? ['توزیع HVAC و جریان هوا', 'پوسته حرارتی و نور روز', 'سامانه‌های انرژی تجدیدپذیر']
              : ['HVAC & stack airflow distribution', 'Thermal envelope & daylighting', 'Renewable solar PV integration'],
        },
        {
          index: '03',
          title: lang === 'fa' ? 'لایه سازه و طراحی لرزه‌ای' : 'STRUCTURAL LAYER',
          accent: '#4D63AD',
          items:
            lang === 'fa'
              ? ['قاب باربر، ستون و تیرها', 'هسته برشی مقاوم لرزه‌ای', 'اتصالات مهندسی هم‌راستا']
              : ['Primary steel frame & girders', 'Reinforced seismic shear core', 'Precision structural connections'],
        },
      ],
    },
    scene04: {
      eyebrow: lang === 'fa' ? '۰۴ · مهندسی شفافیت' : '04 · ENVIRONMENTAL CLARITY',
      headline: lang === 'fa' ? 'طراحی‌شده برای عملکرد.' : 'DESIGNED TO PERFORM.',
      copy:
        lang === 'fa'
          ? 'هم‌نشینی معماری، مهندسی و هوش زیست‌محیطی در یک فضای واقعی.'
          : 'Architecture, engineering and environmental intelligence working together.',
    },
    scene05: {
      eyebrow: lang === 'fa' ? '۰۵ · داده‌های مستند گروه ISB' : '05 · VERIFIED PRACTICE METRICS',
      headline: lang === 'fa' ? 'عملکرد قابل سنجش.' : 'MEASURED IMPACT.',
      labels: {
        projects: lang === 'fa' ? 'پروژه معماری و انرژی مستند' : 'Verified Architectural & Energy Projects',
        experience: lang === 'fa' ? 'سال تجربه حرفه‌ای و پژوهشی' : 'Years of Professional Practice',
        disciplines: lang === 'fa' ? 'دپارتمان تخصصی یکپارچه' : 'Integrated Technical Disciplines',
        programs: lang === 'fa' ? 'دوره تخصصی آکادمی ISB' : 'Specialized Academy Programs',
      },
    },
    scene06: {
      eyebrow: lang === 'fa' ? '۰۶ · کانون انرژی و نور' : '06 · OPTICAL APERTURE',
      label:
        lang === 'fa'
          ? 'انرژی، هوش و تحول پایدار'
          : 'ENERGY · INTELLIGENCE · SUSTAINABLE TRANSFORMATION',
    },
    scene07: {
      statement: lang === 'fa' ? 'ساختن آینده‌ای بهتر.' : 'BUILDING A BETTER FUTURE.',
      substatement:
        lang === 'fa'
          ? 'گروه ساختمانی بنای پایدار ایران‌زمین — طراحی، شبیه‌سازی انرژی و آموزش تخصصی'
          : 'Iran Sustainable Building Group — Integrated Design, Building Science & Academy',
      ctas: {
        architecture: lang === 'fa' ? 'کاوش معماری' : 'EXPLORE ARCHITECTURE',
        engineering: lang === 'fa' ? 'کشف مهندسی' : 'DISCOVER ENGINEERING',
        academy: lang === 'fa' ? 'ورود به آکادمی ISB' : 'ENTER ISB ACADEMY',
      },
    },
  };
}
