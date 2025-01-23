import { createTheme, rem } from '@mantine/core';

const base = {
  colors: {},
  defaultRadius: 'md',
  spacing: {
    xxs: rem(4),
    xxl: rem(32),
    gr: rem(56),
  },
};

export const oceanBlueTheme = createTheme({ ...base, primaryColor: 'blue' });
export const forestGreenTheme = createTheme({ ...base, primaryColor: 'green' });
export const sunsetRedTheme = createTheme({ ...base, primaryColor: 'red' });
export const goldenYellowTheme = createTheme({ ...base, primaryColor: 'yellow' });
export const amberOrangeTheme = createTheme({ ...base, primaryColor: 'orange' });

export const lavenderVioletTheme = createTheme({ ...base, primaryColor: 'violet' });
export const skyCyanTheme = createTheme({ ...base, primaryColor: 'cyan' });
export const limeGreenTheme = createTheme({ ...base, primaryColor: 'lime' });
export const tealTheme = createTheme({ ...base, primaryColor: 'teal' });

export const theme = {
  oceanBlue: oceanBlueTheme,
  forestGreen: forestGreenTheme,
  sunsetRed: sunsetRedTheme,
  goldenYellow: goldenYellowTheme,
  amberOrange: amberOrangeTheme,
  lavenderViolet: lavenderVioletTheme,
  skyCyan: skyCyanTheme,
  limeGreen: limeGreenTheme,
  teal: tealTheme,
};

export const themes = [
  {
    scheme: 'light',
    color: 'blue',
    name: 'Ocean Blue',
    id: 'oceanBlue',
  },
  {
    scheme: 'light',
    color: 'green',
    name: 'Forest Green',
    id: 'forestGreen',
  },
  {
    scheme: 'light',
    color: 'yellow',
    name: 'Lemon Yellow',
    id: 'goldenYellow',
  },
  {
    scheme: 'light',
    color: 'lime',
    name: 'Lime Green',
    id: 'limeGreen',
  },
  {
    scheme: 'dark',
    color: 'red',
    name: 'Sunset Red',
    id: 'sunsetRed',
  },
  {
    scheme: 'dark',
    color: 'orange',
    name: 'Amber Orange',
    id: 'amberOrange',
  },
  {
    scheme: 'dark',
    color: 'violet',
    name: 'Lavender Violet',
    id: 'lavenderViolet',
  },

  {
    scheme: 'dark',
    color: 'cyan',
    name: 'Sky Cyan',
    id: 'skyCyan',
  },
  {
    scheme: 'dark',
    color: 'teal',
    name: 'Teal',
    id: 'teal',
  },
] as const;