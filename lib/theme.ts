export const lightTheme = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  card: '#ffffff',
  primary: '#369379',
  primaryForeground: '#fafafa',
  secondary: '#f5f5f5',
  secondaryForeground: '#171717',
  muted: '#f5f5f5',
  mutedForeground: '#737373',
  accent: '#f5f5f5',
  accentForeground: '#171717',
  destructive: '#dc2626',
  border: '#e5e5e5',
  input: '#e5e5e5',
};

export type Theme = typeof lightTheme;

export const darkTheme: Theme = {
  background: '#0a0a0a',
  foreground: '#fafafa',
  card: '#171717',
  primary: '#047857',
  primaryForeground: '#171717',
  secondary: '#262626',
  secondaryForeground: '#fafafa',
  muted: '#262626',
  mutedForeground: '#a1a1a1',
  accent: '#262626',
  accentForeground: '#fafafa',
  destructive: '#dc2626',
  border: '#ffffff1a',
  input: '#ffffff26',
};

export const radius = 10;
