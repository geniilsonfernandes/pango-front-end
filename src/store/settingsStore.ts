import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const currencies = [
  { value: 'BRL', label: 'Brazilian Real (BRL)' },
  { value: 'USD', label: 'United States Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'GBP', label: 'British Pound (GBP)' },
];

export type Theme = {
  name: string;
  scheme: string;
  color: string;

  id:
    | 'oceanBlue'
    | 'forestGreen'
    | 'sunsetRed'
    | 'goldenYellow'
    | 'amberOrange'
    | 'lavenderViolet'
    | 'skyCyan'
    | 'limeGreen'
    | 'teal';
};

interface settingsState {
  selectedTheme: Theme;
  setTheme: (theme: Theme) => void;

  currency: string;
  setCurrency: (currency: string) => void;

  showPrice: boolean;
  setShowPrice: (showPrice: boolean) => void;
  showCategories: boolean;
  setShowCategories: (showCategories: boolean) => void;
  showQuantities: boolean;
  setShowQuantities: (showQuantities: boolean) => void;
  showSuggestions: boolean;
  setShowSuggestions: (showSuggestions: boolean) => void;
}

export const useSettingsStore = create<settingsState>()(
  persist(
    (set) => ({
      selectedTheme: {
        scheme: 'dark',
        color: 'violet',
        name: 'Lavender Violet',
        id: 'lavenderViolet',
      },
      setTheme: (selectedTheme: Theme) => set({ selectedTheme }),

      currency: currencies[0].value,
      setCurrency: (currency: string) => set({ currency }),

      showPrice: true,
      setShowPrice: (showPrice: boolean) => set({ showPrice }),
      showCategories: true,
      setShowCategories: (showCategories: boolean) => set({ showCategories }),
      showQuantities: true,
      setShowQuantities: (showQuantities: boolean) => set({ showQuantities }),
      showSuggestions: true,
      setShowSuggestions: (showSuggestions: boolean) => set({ showSuggestions }),
    }),
    {
      name: '@pango:settings',
    }
  )
);