export type CurrencyMode = 'BRL' | 'USD' | 'EUR' | 'GBP';

export const formatCurrency = (value: number, mode: string): string => {
  // Define as configurações de moeda com base no modo
  const currencySettings: Record<string, { locale: string; currency: string }> = {
    BRL: { locale: 'pt-BR', currency: 'BRL' },
    USD: { locale: 'en-US', currency: 'USD' },
    EUR: { locale: 'de-DE', currency: 'EUR' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
  };

  const settings = currencySettings[mode || 'BRL'] || currencySettings.BRL; // Default para 'br'

  return new Intl.NumberFormat(settings.locale, {
    style: 'currency',
    currency: settings.currency,
  }).format(value);
};
