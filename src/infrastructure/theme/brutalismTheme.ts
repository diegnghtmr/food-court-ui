/**
 * Brutalism Nocturnal Theme
 * Dark brutalist design system with high contrast and hard shadows
 */

export const BRUTALIST_THEME = {
  /**
   * Color Palette - Deep darks with high contrast
   */
  colors: {
    // Backgrounds
    background: {
      primary: '#0a0a0a', // Deep black
      secondary: '#121212', // Dark gray
      card: '#1a1a1a', // Card background
      hover: '#222222', // Hover state
    },

    // Text colors
    text: {
      primary: '#f5f5f5', // Bone white
      secondary: '#c0c0c0', // Silver gray
      disabled: '#6a6a6a', // Disabled gray
      inverse: '#000000', // Black (for light backgrounds)
    },

    // Status colors
    status: {
      success: '#00ff00', // Terminal green
      warning: '#ff6b35', // Burnt orange
      error: '#ff0000', // Pure red
      info: '#9b59b6', // Electric violet
      neutral: '#808080', // Neutral gray
    },

    // Borders
    border: {
      default: '#ffffff', // Solid white
      subtle: '#404040', // Subtle gray
      error: '#ff0000', // Error state
    },
  },

  /**
   * Typography - Monospace for brutalist feel
   */
  typography: {
    fontFamily: {
      primary: "'Space Mono', 'Courier New', monospace",
      secondary: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    fontSize: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px
      lg: '1.25rem', // 20px
      xl: '1.5rem', // 24px
      '2xl': '2rem', // 32px
      '3xl': '3rem', // 48px
      '4xl': '4rem', // 64px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
      black: 900,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },

  /**
   * Spacing system
   */
  spacing: {
    xs: '0.25rem', // 4px
    sm: '0.5rem', // 8px
    md: '1rem', // 16px
    lg: '1.5rem', // 24px
    xl: '2rem', // 32px
    '2xl': '3rem', // 48px
    '3xl': '4rem', // 64px
  },

  /**
   * Border configuration - No rounded corners (brutalism)
   */
  border: {
    width: {
      thin: '1px',
      medium: '2px',
      thick: '3px',
      ultra: '4px',
    },
    radius: {
      none: '0', // ALWAYS 0 in brutalism
      subtle: '2px', // Minimal, only if absolutely necessary
    },
  },

  /**
   * Shadows - Hard shadows without blur
   */
  shadows: {
    none: 'none',
    hard: '4px 4px 0px #000000',
    hardLarge: '8px 8px 0px #000000',
    hardXl: '12px 12px 0px #000000',
    hardInset: 'inset 4px 4px 0px #000000',
  },

  /**
   * Z-index layers
   */
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1300,
    tooltip: 1500,
  },

  /**
   * Breakpoints for responsive design
   */
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1440px',
  },

  /**
   * Transitions - Instant or very fast (no smooth animations)
   */
  transitions: {
    none: 'none',
    instant: '50ms ease-out',
    fast: '100ms ease-out',
  },
} as const

/**
 * Type-safe theme access
 */
export type BrutalistTheme = typeof BRUTALIST_THEME

export default BRUTALIST_THEME
