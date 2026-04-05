import {Platform} from 'react-native';

export const theme = {
  colors: {
    background: '#ffffff',
    surface: '#ffffff',
    elevated: '#f7f5f2',
    card: '#ffffff',
    text: '#171411',
    mutedText: '#a39c92',
    border: '#efebe4',
    accent: '#b28a43',
    accentSoft: '#f5eedf',
    dark: '#131313',
    success: '#274b37',
    danger: '#8f4c45',
    shadow: '#1f1710',
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 18,
    pill: 999,
  },
  typography: {
    hero: 'Georgia',
    body: Platform.select({
      ios: 'System',
      android: 'sans-serif',
      default: 'System',
    }),
  },
  shadow: Platform.select({
    ios: {
      shadowColor: '#1f1710',
      shadowOpacity: 0.03,
      shadowRadius: 8,
      shadowOffset: {width: 0, height: 4},
    },
    android: {
      elevation: 1,
    },
    default: {},
  }),
};
