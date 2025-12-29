/**
 * Typography constants for MaintainMate-v2
 * Font sizes, weights, and line heights from Figma
 */

export const Typography = {
  // Font Families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },

  // Font Sizes
  fontSize: {
    h1: 38,      // Large headings
    h2: 30,      // Onboarding titles
    h3: 24,      // Section titles
    body: 18,    // Onboarding subtitles, button text
    bodySmall: 16, // Skip text, captions
    caption: 14,
    small: 12,
  },

  // Font Weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  // Line Heights
  lineHeight: {
    h1: 46,      // For 38px font
    h2: 38,      // For 30px font (onboarding titles)
    h3: 32,      // For 24px font
    body: 28,    // For 18px font (onboarding subtitles)
    bodySmall: 24, // For 16px font
    caption: 20,
    small: 16,
  },

  // Text Variants (Pre-configured combinations)
  variants: {
    h1: {
      fontSize: 38,
      lineHeight: 46,
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 30,
      lineHeight: 38,
      fontWeight: '700' as const,
    },
    h3: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '400' as const,
    },
    bodyBold: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '600' as const,
    },
    caption: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    small: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
    },
    button: {
      fontSize: 18,
      lineHeight: 28,
      fontWeight: '600' as const,
    },
  },
} as const;
