export const EASE_CURVES = {
  default: 'power2.out',
  smooth: 'power3.out',
  elastic: 'elastic.out(1, 0.5)',
  back: 'back.out(1.2)',
  sine: 'sine.inOut',
  linear: 'none',
} as const;

export const DURATIONS = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.2,
  entrance: 0.8,
} as const;

export const DEFAULT_SCROLL_TRIGGER = {
  start: 'top 85%',
  end: 'bottom 15%',
  toggleActions: 'play none none none',
} as const;

export const FADE_UP_FROM = {
  opacity: 0,
  y: 40,
} as const;

export const FADE_UP_TO = {
  opacity: 1,
  y: 0,
  duration: DURATIONS.normal,
  ease: EASE_CURVES.smooth,
} as const;

export const STAGGER_CONFIG = {
  normal: { stagger: 0.1, duration: DURATIONS.normal, ease: EASE_CURVES.smooth },
  fast: { stagger: 0.06, duration: DURATIONS.fast, ease: EASE_CURVES.default },
  slow: { stagger: 0.15, duration: DURATIONS.slow, ease: EASE_CURVES.smooth },
} as const;

export const HERO_TIMELINE_DEFAULTS = {
  defaults: { ease: EASE_CURVES.smooth },
} as const;
