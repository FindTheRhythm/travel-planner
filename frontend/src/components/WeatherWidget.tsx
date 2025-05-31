import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import OpacityIcon from '@mui/icons-material/Opacity';
import AirIcon from '@mui/icons-material/Air';
import CompressIcon from '@mui/icons-material/Compress';
import CircularProgress from '@mui/material/CircularProgress';
import WbSunnyIcon from '@mui/icons-material/WbSunny';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    description: string;
    icon: string;
    id: number;
  }>;
  wind: {
    speed: number;
  };
}

interface WeatherWidgetProps {
  weather: WeatherData | null;
  isLoading: boolean;
  error: boolean;
}

const getWeatherTheme = (weatherData: WeatherData) => {
  try {
    if (!weatherData?.main?.temp || !weatherData?.weather?.[0]?.id || !Array.isArray(weatherData.weather)) {
      return 'linear-gradient(135deg, #4CA1AF 0%, #C4E0E5 100%)'; // дефолтный градиент
    }

    const temp = weatherData.main.temp;
    const weatherId = weatherData.weather[0].id;
    
    const themes = {
      // Чистое небо (800)
      clear: {
        hot: 'linear-gradient(135deg,rgb(219, 143, 1) 0%,rgb(216, 198, 35) 100%)',     // Жарко
        warm: 'linear-gradient(135deg, #4CA1AF 0%, #C4E0E5 100%)',    // Тепло
        cold: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)'     // Прохладно
      },
      // Облачно (801-804)
      clouds: {
        light: 'linear-gradient(135deg,rgb(145, 151, 168) 0%,rgb(113, 154, 231) 100%)',   // Легкая облачность
        heavy: 'linear-gradient(135deg,rgb(122, 141, 180) 0%,rgb(36, 46, 70) 100%)'    // Сильная облачность
      },
      // Дождь (500-531)
      rain: {
        light: 'linear-gradient(135deg, #616161 0%, #9bc5c3 100%)',   // Легкий дождь
        heavy: 'linear-gradient(135deg,rgb(87, 91, 100) 0%,rgb(36, 96, 194) 100%)'    // Сильный дождь
      },
      // Снег (600-622)
      snow: 'linear-gradient(135deg, #E6DADA 0%, #274046 100%)',
      // Гроза (200-232)
      thunderstorm: 'linear-gradient(135deg, #283E51 0%, #4B79A1 100%)',
      // Туман, дымка (701-781)
      atmosphere: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)'
    };

    if (weatherId === 800) {
      if (temp >= 25) return themes.clear.hot;
      if (temp >= 15) return themes.clear.warm;
      return themes.clear.cold;
    }
    
    if (weatherId > 800 && weatherId <= 804) {
      return weatherId <= 802 ? themes.clouds.light : themes.clouds.heavy;
    }
    
    if (weatherId >= 500 && weatherId <= 531) {
      return weatherId < 502 ? themes.rain.light : themes.rain.heavy;
    }
    
    if (weatherId >= 600 && weatherId <= 622) return themes.snow;
    if (weatherId >= 200 && weatherId <= 232) return themes.thunderstorm;
    if (weatherId >= 701 && weatherId <= 781) return themes.atmosphere;

    return themes.clear.warm; // дефолтный градиент
  } catch (error) {
    console.error('Error in getWeatherTheme:', error);
    return 'linear-gradient(135deg, #4CA1AF 0%, #C4E0E5 100%)'; // дефолтный градиент при ошибке
  }
};

// Функция для определения яркости цвета
const getBrightness = (color: string): number => {
  try {
    // Для rgb цветов
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [_, r, g, b] = rgbMatch.map(Number);
      return (r * 299 + g * 587 + b * 114) / 1000;
    }
    
    // Для hex цветов
    const hexMatch = color.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
    if (hexMatch) {
      let hex = hexMatch[1];
      if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
      }
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return (r * 299 + g * 587 + b * 114) / 1000;
    }

    return 128; // Значение по умолчанию
  } catch (error) {
    console.error('Error in getBrightness:', error);
    return 128; // Значение по умолчанию при ошибке
  }
};

// Функция для определения контрастного цвета текста
const getContrastColor = (background: string): string => {
  try {
    // Для градиентов берем первый цвет
    const colorMatch = background.match(/(#[A-Fa-f0-9]{6}|#[A-Fa-f0-9]{3}|rgb\(\d+,\s*\d+,\s*\d+\))/);
    if (!colorMatch) return '#ffffff'; // По умолчанию белый текст
    
    const firstColor = colorMatch[1];
    const brightness = getBrightness(firstColor);
    
    // Для пасмурной погоды всегда используем белый текст
    if (background.includes('rgb(122, 141, 180)')) {
      return '#ffffff';
    }
    
    return brightness > 128 ? '#1a1a1a' : '#ffffff';
  } catch (error) {
    console.error('Error in getContrastColor:', error);
    return '#ffffff'; // По умолчанию белый текст при ошибке
  }
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather, isLoading, error }) => {
  // Дополнительная проверка на валидность данных
  const isValidWeather = weather && 
    weather.main && 
    weather.weather && 
    Array.isArray(weather.weather) && 
    weather.weather.length > 0 &&
    weather.wind;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
        <CircularProgress size={20} />
        <Typography>Загрузка погоды...</Typography>
      </Box>
    );
  }

  if (error || !isValidWeather) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          mt: 2, 
          bgcolor: '#fff3f0', 
          color: 'error.main',
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Typography>
          {error ? 'Не удалось загрузить данные о погоде' : 'Некорректные данные о погоде'}
        </Typography>
      </Paper>
    );
  }

  if (!weather) return null;

  // Получаем цвета только если есть данные о погоде
  const background = getWeatherTheme(weather);
  const textColor = getContrastColor(background);

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 2,
        borderRadius: 2,
        background,
        color: textColor,
        transition: 'background 0.3s ease-in-out'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <WbSunnyIcon sx={{ color: textColor }} />
        <Typography variant="h6" sx={{ 
          fontWeight: 500,
          color: textColor,
          textShadow: textColor === '#ffffff' ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none'
        }}>
          Погода сейчас
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ alignItems: 'center' }}>
        {/* Основная информация */}
        <Grid item xs={12} md={6} sx={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%'
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            width: '100%',
            justifyContent: 'center'
          }}>
            <img 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Weather icon"
              style={{ width: 80, height: 80 }}
            />
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              height: 80
            }}>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold',
                textShadow: textColor === '#ffffff' ? '2px 2px 4px rgba(0,0,0,0.3)' : 'none',
                lineHeight: 1,
                color: textColor
              }}>
                {Math.round(weather.main.temp)}°C
              </Typography>
              <Typography variant="subtitle1" sx={{ 
                textTransform: 'capitalize',
                textShadow: textColor === '#ffffff' ? '1px 1px 2px rgba(0,0,0,0.3)' : 'none',
                lineHeight: 1.2,
                color: textColor
              }}>
                {weather.weather[0].description}
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Дополнительная информация */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ThermostatIcon sx={{ color: textColor }} />
                <Box>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.8,
                    fontSize: '0.9rem',
                    textShadow: textColor === '#ffffff' ? '1px 1px 2px rgba(0,0,0,0.2)' : 'none',
                    color: textColor
                  }}>
                    Ощущается как
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', color: textColor }}>
                    {Math.round(weather.main.feels_like)}°C
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <OpacityIcon sx={{ color: textColor }} />
                <Box>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.8,
                    fontSize: '0.9rem',
                    textShadow: textColor === '#ffffff' ? '1px 1px 2px rgba(0,0,0,0.2)' : 'none',
                    color: textColor
                  }}>
                    Влажность
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', color: textColor }}>
                    {weather.main.humidity}%
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AirIcon sx={{ color: textColor }} />
                <Box>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.8,
                    fontSize: '0.9rem',
                    textShadow: textColor === '#ffffff' ? '1px 1px 2px rgba(0,0,0,0.2)' : 'none',
                    color: textColor
                  }}>
                    Ветер
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', color: textColor }}>
                    {Math.round(weather.wind.speed)} м/с
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CompressIcon sx={{ color: textColor }} />
                <Box>
                  <Typography variant="body2" sx={{ 
                    opacity: 0.8,
                    fontSize: '0.9rem',
                    textShadow: textColor === '#ffffff' ? '1px 1px 2px rgba(0,0,0,0.2)' : 'none',
                    color: textColor
                  }}>
                    Давление
                  </Typography>
                  <Typography variant="body1" sx={{ fontSize: '1.1rem', color: textColor }}>
                    {Math.round(weather.main.pressure * 0.750062)} мм
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default WeatherWidget; 