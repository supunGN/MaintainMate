/**
 * Color constants for MaintainMate-v2
 * Organized by usage and theme
 */

export const Colors = {
  // Splash Screen Colors
  splash: {
    gradientStart: '#2D8B57', // Green
    gradientEnd: '#000000',   // Black
    iconColor: '#FFFFFF',     // White
  },

  // Primary Brand Colors
  primary: {
    main: '#2D8B57',
    light: '#3FA76F',
    dark: '#1F5F3D',
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    black: '#000000',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',
  },

  // Semantic Colors
  success: '#4CAF50',
  successLight: '#E8F5E9',
  warning: '#FF9800',
  error: '#F44336',
  errorDark: '#E53935',
  errorLight: '#FFEBEE',
  info: '#2196F3',

  // Text Colors
  text: {
    primary: '#212121',
    secondary: '#757575',
    tertiary: '#888888',
    quaternary: '#555555',
    disabled: '#BDBDBD',
    inverse: '#FFFFFF',
  },

  // Background Colors
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    dark: '#212121',
    light: '#F7F9FC',
    subtle: '#F0F0F0',
  },

  // Border Colors
  border: {
    light: '#E5E5E5',
    default: '#E0E0E0',
    dark: '#BDBDBD',
  },

  // Chart Colors (for reports)
  chart: {
    primary: '#2F8B57',
    secondary: '#66BB6A',
    tertiary: '#A5D6A7',
  },

  // Onboarding Colors
  onboarding: {
    activeDot: '#2D8B57',
    inactiveDot: '#E0E0E0',
    skipText: '#757575',
  },
} as const;

