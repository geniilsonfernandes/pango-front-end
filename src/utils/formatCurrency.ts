export type CurrencyMode = 'br' | 'eua' | 'eur' | 'uk';

export const formatCurrency = (value: number, mode: CurrencyMode): string => {
  // Define as configurações de moeda com base no modo
  const currencySettings: Record<string, { locale: string; currency: string }> = {
    br: { locale: 'pt-BR', currency: 'BRL' },
    eua: { locale: 'en-US', currency: 'USD' },
    eur: { locale: 'de-DE', currency: 'EUR' },
    uk: { locale: 'en-GB', currency: 'GBP' },
  };

  const settings = currencySettings[mode] || currencySettings.br; // Default para 'br'

  return new Intl.NumberFormat(settings.locale, {
    style: 'currency',
    currency: settings.currency,
  }).format(value);
};
