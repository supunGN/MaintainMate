/**
 * Animation constants for MaintainMate-v2
 * Timing and easing values for consistent animations
 */

export const Animation = {
  // Splash Screen Timings
  splash: {
    displayDuration: 1800,    // Total display time (ms)
    iconPulseDuration: 800,   // Icon scale & slide animation (ms) - faster!
    fadeDuration: 200,       // Fade out duration (ms)
  },

  // General Animation Durations
  duration: {
    instant: 0,
    fast: 200,
    normal: 300,
    slow: 500,
  },

  // Easing Functions (for react-native-reanimated)
  easing: {
    // Common easing curves
    linear: 'linear',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
} as const;
