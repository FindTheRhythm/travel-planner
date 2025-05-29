import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';

// Цвета из Profile.tsx
const MAIN_COLOR = '#2c3e50';
const HOVER_COLOR = '#2980b9';

// Доступные валюты
const CURRENCIES = {
  RUB: {
    code: 'RUB',
    symbol: '₽',
    name: 'Российский рубль'
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Евро'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Доллар США'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'Фунт стерлингов'
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Японская иена'
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Австралийский доллар'
  },
  TRY: {
    code: 'TRY',
    symbol: '₺',
    name: 'Турецкая лира'
  },
  BRL: {
    code: 'BRL',
    symbol: 'R$',
    name: 'Бразильский реал'
  },
  ARS: {
    code: 'ARS',
    symbol: '$',
    name: 'Аргентинский песо'
  },
  SEK: {
    code: 'SEK',
    symbol: 'kr',
    name: 'Шведская крона'
  },
  DKK: {
    code: 'DKK',
    symbol: 'kr',
    name: 'Датская крона'
  },
  NOK: {
    code: 'NOK',
    symbol: 'kr',
    name: 'Норвежская крона'
  },
  SGD: {
    code: 'SGD',
    symbol: 'S$',
    name: 'Сингапурский доллар'
  }
} as const;

type CurrencyCode = keyof typeof CURRENCIES;

// Маппинг городов из travel-details.json к валютам
const CITY_CURRENCIES: Record<string, CurrencyCode> = {
  // Россия
  'Moscow, Russia': 'RUB',
  'Saint Petersburg, Russia': 'RUB',
  
  // Великобритания (GBP)
  'London, United Kingdom': 'GBP',
  'Edinburgh, Scotland': 'GBP',
  
  // Еврозона (EUR)
  'Paris, France': 'EUR',
  'Colmar, France': 'EUR',
  'Rome, Italy': 'EUR',
  'Venice, Italy': 'EUR',
  'Barcelona, Spain': 'EUR',
  'Madrid, Spain': 'EUR',
  'Valencia, Spain': 'EUR',
  'Milan, Italy': 'EUR',
  'Florence, Italy': 'EUR',
  'Naples, Italy': 'EUR',
  'Amsterdam, Netherlands': 'EUR',
  'Brussels, Belgium': 'EUR',
  'Bruges, Belgium': 'EUR',
  'Vienna, Austria': 'EUR',
  'Prague, Czech Republic': 'EUR',
  'Budapest, Hungary': 'EUR',
  'Helsinki, Finland': 'EUR',
  'Dublin, Ireland': 'EUR',
  'Lisbon, Portugal': 'EUR',
  'Athens, Greece': 'EUR',
  'Berlin, Germany': 'EUR',
  'Munich, Germany': 'EUR',
  'Hamburg, Germany': 'EUR',
  
  // Скандинавские страны (свои кроны)
  'Stockholm, Sweden': 'SEK',
  'Oslo, Norway': 'NOK',
  'Copenhagen, Denmark': 'DKK',
  
  // Другие страны
  'Istanbul, Turkey': 'TRY',
  'Kyoto, Japan': 'JPY',
  'New York, USA': 'USD',
  'Rio de Janeiro, Brazil': 'BRL',
  'Buenos Aires, Argentina': 'ARS',
  'Sydney, Australia': 'AUD',
  'Singapore': 'SGD'
};

interface CurrencyWidgetProps {
  destinationCity?: string;
}

const CurrencyWidget: React.FC<CurrencyWidgetProps> = ({
  destinationCity = ''
}) => {
  // Состояния
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('RUB');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(() => {
    return CITY_CURRENCIES[destinationCity] || 'EUR';
  });
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Получаем курс обмена при изменении валют
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (fromCurrency === toCurrency) {
        setExchangeRate(1);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/d38ae686fba51876d00aea91/latest/${fromCurrency}`
        );
        const data = await response.json();

        if (data.result === 'success' && data.conversion_rates) {
          setExchangeRate(data.conversion_rates[toCurrency]);
        } else {
          throw new Error('Не удалось получить курс обмена');
        }
      } catch (err) {
        setError('Ошибка при получении курса валют');
        console.error('Exchange rate error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  // Обновляем целевую валюту при изменении города
  useEffect(() => {
    if (destinationCity && CITY_CURRENCIES[destinationCity]) {
      setToCurrency(CITY_CURRENCIES[destinationCity]);
    }
  }, [destinationCity]);

  // Обработчики
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Форматирование для отображения
  const formatCurrency = (code: CurrencyCode) => {
    const currency = CURRENCIES[code];
    return `${currency.symbol} ${currency.code} - ${currency.name}`;
  };

  const calculateResult = () => {
    if (!exchangeRate || !amount) return '0';
    const result = parseFloat(amount) * exchangeRate;
    return result.toString();
  };

  if (error) {
    return (
      <Paper elevation={1} sx={{ p: 2, bgcolor: '#fff3f0', color: 'error.main', borderRadius: 2 }}>
        <Typography>{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        bgcolor: 'white',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
          backgroundColor: 'rgba(44, 62, 80, 0.02)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: MAIN_COLOR }}>
        <CurrencyExchangeIcon />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Конвертер валют
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '64px'
        }}>
          <TextField
            label="Сумма"
            value={amount}
            onChange={handleAmountChange}
            type="text"
            size="small"
            sx={{
              width: '150px',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: MAIN_COLOR,
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: MAIN_COLOR,
              }
            }}
          />
          <TextField
            select
            label="Из"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
            size="small"
            sx={{
              minWidth: '200px',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: MAIN_COLOR,
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: MAIN_COLOR,
              }
            }}
          >
            {Object.keys(CURRENCIES).map((code) => (
              <MenuItem key={code} value={code}>
                {formatCurrency(code as CurrencyCode)}
              </MenuItem>
            ))}
          </TextField>
          <IconButton
            onClick={handleSwapCurrencies}
            sx={{
              bgcolor: MAIN_COLOR,
              color: 'white',
              '&:hover': {
                bgcolor: HOVER_COLOR,
              }
            }}
          >
            <SwapHorizIcon />
          </IconButton>
          <TextField
            select
            label="В"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
            size="small"
            sx={{
              minWidth: '200px',
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: MAIN_COLOR,
                }
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: MAIN_COLOR,
              }
            }}
          >
            {Object.keys(CURRENCIES).map((code) => (
              <MenuItem key={code} value={code}>
                {formatCurrency(code as CurrencyCode)}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{
          mt: 1,
          p: 1.5,
          bgcolor: 'rgba(44, 62, 80, 0.02)',
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '64px'
        }}>
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: MAIN_COLOR }} />
          ) : (
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: MAIN_COLOR }}>
              {amount} {CURRENCIES[fromCurrency].symbol} = {calculateResult()} {CURRENCIES[toCurrency].symbol}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default CurrencyWidget; 