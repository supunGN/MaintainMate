/**
 * Spacing constants for MaintainMate-v2
 * Based on 8px grid system
 */

export const Spacing = {
  // Base unit (8px)
  unit: 8,

  // Common spacing values
  xs: 4,   // 0.5 * unit
  sm: 8,   // 1 * unit
  md: 16,  // 2 * unit
  lg: 24,  // 3 * unit
  xl: 32,  // 4 * unit
  xxl: 48, // 6 * unit

  // Screen padding
  screenHorizontal: 16,
  screenVertical: 20,

  // Component spacing
  componentGap: 12,
  sectionGap: 24,

  // Component dimensions
  buttonHeight: 56,
  inputHeight: 56,
  iconButton: 40,

  // Icon sizes
  icon: {
    sm: 16,
    md: 24,
    lg: 32,
  },

  // Border radius
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
} as const;
