import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const EXCHANGE_API_URL =
  import.meta.env.VITE_EXCHANGE_RATE_API_URL ||
  'https://v6.exchangerate-api.com/v6/10ebdb74b1b1eb396d1694c7/latest/USD';
const FLAG_CDN_BASE_URL = (import.meta.env.VITE_FLAG_CDN_BASE_URL || 'https://flagcdn.com').replace(/\/$/, '');
const FLAG_CDN_SIZE = import.meta.env.VITE_FLAG_CDN_SIZE || '48x36';
const CURRENCY_STORAGE_KEY = 'corebuy_selected_country';
const RATES_STORAGE_KEY = 'corebuy_exchange_rates';

const getFlagUrl = (countryCode) =>
  `${FLAG_CDN_BASE_URL}/${FLAG_CDN_SIZE}/${String(countryCode || '').toLowerCase()}.png`;

const defaultCountry = {
  code: 'MY',
  name: 'Malaysia',
  flag: getFlagUrl('MY'),
  currency: 'MYR',
};

const countries = [
  defaultCountry,
  { code: 'QA', name: 'Qatar', flag: getFlagUrl('QA'), currency: 'QAR' },
  { code: 'AE', name: 'UAE', flag: getFlagUrl('AE'), currency: 'AED' },
  { code: 'BH', name: 'Bahrain', flag: getFlagUrl('BH'), currency: 'BHD' },
  { code: 'OM', name: 'Oman', flag: getFlagUrl('OM'), currency: 'OMR' },
];

const CurrencyContext = createContext(null);

const parseAmount = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const convertFromMYRWithRates = (amount, targetCurrency, rates) => {
  const safeAmount = parseAmount(amount);
  const myrRate = parseAmount(rates?.MYR);
  const targetRate = parseAmount(rates?.[targetCurrency]);

  if (!myrRate || !targetRate) {
    return safeAmount;
  }

  return (safeAmount / myrRate) * targetRate;
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountryState] = useState(defaultCountry);
  const [conversionRates, setConversionRates] = useState({ MYR: 1, USD: 1 });

  useEffect(() => {
    try {
      const storedCountryRaw = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (storedCountryRaw) {
        const storedCountry = JSON.parse(storedCountryRaw);
        if (storedCountry?.currency) {
          setSelectedCountryState(storedCountry);
        }
      }
    } catch (error) {
      console.error('Failed to load selected country from storage:', error);
    }
  }, []);

  useEffect(() => {
    try {
      const cachedRatesRaw = localStorage.getItem(RATES_STORAGE_KEY);
      if (!cachedRatesRaw) {
        return;
      }

      const cachedRates = JSON.parse(cachedRatesRaw);
      if (cachedRates?.conversion_rates) {
        setConversionRates(cachedRates.conversion_rates);
      }
    } catch (error) {
      console.error('Failed to load cached exchange rates:', error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchRates = async () => {
      try {
        const response = await fetch(EXCHANGE_API_URL);
        const data = await response.json();

        if (!isMounted || data?.result !== 'success' || !data?.conversion_rates) {
          return;
        }

        setConversionRates(data.conversion_rates);
        localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Failed to fetch exchange rates:', error);
      }
    };

    fetchRates();

    return () => {
      isMounted = false;
    };
  }, []);

  const setSelectedCountry = useCallback((country) => {
    setSelectedCountryState(country);
    localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(country));
  }, []);

  const convertFromMYR = useCallback(
    (amount, targetCurrency = selectedCountry.currency) =>
      convertFromMYRWithRates(amount, targetCurrency, conversionRates),
    [conversionRates, selectedCountry.currency],
  );

  const formatCurrencyFromMYR = useCallback(
    (amount, options = {}) => {
      const convertedAmount = convertFromMYR(amount, options.currency || selectedCountry.currency);
      const currency = options.currency || selectedCountry.currency;
      const minimumFractionDigits = options.minimumFractionDigits ?? 2;
      const maximumFractionDigits = options.maximumFractionDigits ?? 2;

      try {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency,
          minimumFractionDigits,
          maximumFractionDigits,
        }).format(convertedAmount);
      } catch (error) {
        return `${currency} ${convertedAmount.toFixed(maximumFractionDigits)}`;
      }
    },
    [convertFromMYR, selectedCountry.currency],
  );

  const value = useMemo(
    () => ({
      countries,
      selectedCountry,
      setSelectedCountry,
      conversionRates,
      convertFromMYR,
      formatCurrencyFromMYR,
    }),
    [selectedCountry, setSelectedCountry, conversionRates, convertFromMYR, formatCurrencyFromMYR],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
