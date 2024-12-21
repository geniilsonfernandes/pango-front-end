// types.d.ts ou global.d.ts
import { DefaultMantineColor, MantineColorsTuple } from '@mantine/core';

// Definindo tipos estendidos
type ExtendedCustomColors = 'estimou' | 'base' | DefaultMantineColor;

type ExtendedSpacings = 'xxxs' | 'xxl' | MantineSpacing;

declare module '@mantine/core' {
  // Sobrescrevendo o tema para incluir novas cores personalizadas
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, MantineColorsTuple>;
  }

  export type MantineSpacing = 'xss' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}
