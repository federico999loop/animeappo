const baseColors = {
  black: '#1b1919',
  primary: '#db2d69',
  primaryGradientStart: '#db2d69',
  primaryGradientEnd: '#db372d',
  secondary: '#db2d69',
  light: '#efefec',
  white: '#ffffff',
  error: '#ff3b30',
  success: '#34c759',
  warning: '#ffcc00',
};

const darkTheme = {
  colors: {
    ...baseColors,
    background: baseColors.black,
    surface: '#242424',
    surfaceVariant: '#2a2a2a',
    text: baseColors.white,
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textTertiary: 'rgba(255, 255, 255, 0.5)',
  muted: 'rgba(255, 255, 255, 0.7)',
  soft: '#2a2a2a',
    border: 'rgba(255, 255, 255, 0.1)',
    divider: 'rgba(255, 255, 255, 0.08)',
    elevation: {
      level0: 'transparent',
      level1: '#2a2a2a',
      level2: '#2f2f2f',
      level3: '#353535',
    },
  },
};

const lightTheme = {
  colors: {
    ...baseColors,
    background: baseColors.light,
    surface: baseColors.white,
    surfaceVariant: '#f5f5f5',
    text: baseColors.black,
    textSecondary: 'rgba(0, 0, 0, 0.7)',
    textTertiary: 'rgba(0, 0, 0, 0.5)',
  muted: 'rgba(0, 0, 0, 0.7)',
  soft: '#f5f5f5',
    border: 'rgba(0, 0, 0, 0.1)',
    divider: 'rgba(0, 0, 0, 0.08)',
    elevation: {
      level0: 'transparent',
      level1: '#ffffff',
      level2: '#f5f5f5',
      level3: '#efefef',
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 9999,
};

export const typography = {
  h1: {
    fontFamily: 'Outfit-Bold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'Outfit-Bold',
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h3: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  subtitle1: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: 0,
  },
  subtitle2: {
    fontFamily: 'Outfit-Medium',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0,
  },
  body1: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  body2: {
    fontFamily: 'Outfit-Regular',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.15,
  },
  // backward compatible alias
  body: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  mediumHeading: {
    fontFamily: 'Outfit-SemiBold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.25,
  },
  button: {
    fontFamily: 'Outfit-Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    textTransform: 'uppercase',
  },
  caption: {
    fontFamily: 'Outfit-Regular',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.4,
  },
  overline: {
    fontFamily: 'Outfit-Medium',
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 5,
  },
};

export const animations = {
  scale: {
    pressed: 0.96,
    focused: 1.05,
  },
  timing: {
    quick: 150,
    base: 250,
    slow: 350,
  },
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  },
};

const theme = {
  dark: true,
  ...darkTheme,
  spacing,
  radii,
  typography,
  shadows,
  animations,
};

// Backward compatibility aliases for older components
// keep these in sync with the main tokens above
// color aliases
(theme as any).colors.muted = (theme as any).colors.textSecondary;
(theme as any).colors.soft = (theme as any).colors.surfaceVariant;
// typography aliases
(theme as any).typography.body = (theme as any).typography.body1;
(theme as any).typography.mediumHeading = (theme as any).typography.h3;

export type Theme = typeof theme;
export default theme;

// Also export light theme for future use
export { lightTheme, darkTheme };
