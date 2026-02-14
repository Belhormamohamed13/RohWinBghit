/**
 * RohWinBghit Design System - Design Tokens
 * 
 * Color Palette:
 * - Primary: #16a34a (Green)
 * - Dark Green: #15803d
 * - Light Green: #dcfce7
 * - Background: #f8fafc
 * - Text: #111827
 * - Borders: #e5e7eb
 * - Danger: #ef4444
 * - Warning: #f59e0b
 * 
 * Typography: Inter or Poppins
 * Grid: 8px system
 * Border Radius: 12px-16px
 */

// Color Tokens
export const colors = {
    // Primary Green
    primary: {
        50: '#dcfce7',
        100: '#bbf7d0',
        200: '#86efac',
        300: '#4ade80',
        400: '#22c55e',
        500: '#16a34a', // Main primary
        600: '#15803d', // Dark green
        700: '#166534',
        800: '#14532d',
        900: '#052e16',
    },

    // Neutral
    background: '#f8fafc',
    surface: '#ffffff',

    // Text
    text: {
        primary: '#111827',
        secondary: '#4b5563',
        muted: '#9ca3af',
        inverse: '#ffffff',
    },

    // Borders
    border: {
        light: '#f3f4f6',
        DEFAULT: '#e5e7eb',
        dark: '#d1d5db',
    },

    // Status
    success: {
        light: '#dcfce7',
        DEFAULT: '#16a34a',
        dark: '#15803d',
    },

    warning: {
        light: '#fef3c7',
        DEFAULT: '#f59e0b',
        dark: '#d97706',
    },

    danger: {
        light: '#fee2e2',
        DEFAULT: '#ef4444',
        dark: '#dc2626',
    },

    info: {
        light: '#dbeafe',
        DEFAULT: '#3b82f6',
        dark: '#2563eb',
    },

    // Dark scale (for reference)
    dark: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
    },
} as const;

// Typography Tokens
export const typography = {
    fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['Noto Sans Arabic', 'Tahoma', 'Arial', 'sans-serif'],
    },

    fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],     // 12px
        sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
        lg: ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        xl: ['1.25rem', { lineHeight: '1.75rem' }],  // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],   // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '1' }],        // 48px
    },

    fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },
} as const;

// Spacing Tokens (8px grid)
export const spacing = {
    0: '0',
    1: '0.25rem',  // 4px
    2: '0.5rem',   // 8px
    3: '0.75rem',  // 12px
    4: '1rem',     // 16px
    5: '1.25rem',  // 20px
    6: '1.5rem',   // 24px
    8: '2rem',     // 32px
    10: '2.5rem',  // 40px
    12: '3rem',    // 48px
    16: '4rem',    // 64px
    20: '5rem',    // 80px
    24: '6rem',    // 96px
} as const;

// Border Radius Tokens
export const borderRadius = {
    none: '0',
    sm: '0.25rem',   // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.75rem',   // 12px
    lg: '1rem',      // 16px
    xl: '1.5rem',    // 24px
    '2xl': '2rem',   // 32px
    full: '9999px',
} as const;

// Shadow Tokens
export const shadows = {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    elevated: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
} as const;

// Animation Tokens
export const animations = {
    transitionDuration: {
        fast: '150ms',
        normal: '200ms',
        slow: '300ms',
        slower: '500ms',
    },

    transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
        in: 'cubic-bezier(0.4, 0, 1, 1)',
        out: 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },

    keyframes: {
        fadeIn: {
            from: { opacity: '0' },
            to: { opacity: '1' },
        },
        slideUp: {
            from: { transform: 'translateY(20px)', opacity: '0' },
            to: { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
            from: { transform: 'translateY(-20px)', opacity: '0' },
            to: { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
            from: { transform: 'scale(0.95)', opacity: '0' },
            to: { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
            '0%': { backgroundPosition: '-200% 0' },
            '100%': { backgroundPosition: '200% 0' },
        },
    },
} as const;

// Z-index tokens
export const zIndex = {
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
} as const;

// Breakpoints (for reference)
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

// Combined theme object
export const theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    animations,
    zIndex,
    breakpoints,
} as const;

export type Theme = typeof theme;
export type Colors = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;
