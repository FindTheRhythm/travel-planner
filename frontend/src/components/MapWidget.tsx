import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Цвета из Profile.tsx
const MAIN_COLOR = '#2c3e50';

interface MapWidgetProps {
  cityName: string;
}

declare global {
  interface Window {
    ymaps: any;
  }
}

const MapWidget: React.FC<MapWidgetProps> = ({ cityName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let map: any = null;

    const cleanup = () => {
      if (map) {
        map.destroy();
      }
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('api-maps.yandex.ru')) {
          scripts[i].remove();
          break;
        }
      }
    };

    const initMap = () => {
      if (!isMounted) return;
      
      try {
        // Геокодируем название города
        window.ymaps.geocode(cityName, {
          results: 1
        }).then((res: any) => {
          if (!isMounted) return;

          const coordinates = res.geoObjects.get(0).geometry.getCoordinates();
          
          // Создаем карту
          map = new window.ymaps.Map('map', {
            center: coordinates,
            zoom: 12,
            controls: ['zoomControl', 'fullscreenControl']
          });

          // Добавляем метку
          const placemark = new window.ymaps.Placemark(coordinates, {
            balloonContent: cityName
          }, {
            preset: 'islands#redDotIcon'
          });

          map.geoObjects.add(placemark);
          
          // Добавляем поведение для карты
          map.behaviors.enable(['drag', 'dblClickZoom', 'multiTouch']);
          
          setIsLoading(false);
        }).catch((error: Error) => {
          if (isMounted) {
            console.error('Error geocoding city:', error);
            setError('Не удалось загрузить карту');
            setIsLoading(false);
          }
        });
      } catch (error) {
        if (isMounted) {
          console.error('Error initializing map:', error);
          setError('Не удалось инициализировать карту');
          setIsLoading(false);
        }
      }
    };

    // Загружаем API Яндекс Карт
    const loadYandexMaps = () => {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=355bc65f-4010-4cbb-a73f-61ea5fb1d3e2&lang=ru_RU';
      script.async = true;
      
      script.onerror = () => {
        if (isMounted) {
          setError('Не удалось загрузить карту');
          setIsLoading(false);
        }
      };

      script.onload = () => {
        if (!isMounted) return;
        window.ymaps.ready(initMap);
      };

      document.body.appendChild(script);
    };

    loadYandexMaps();

    return () => {
      isMounted = false;
      cleanup();
    };
  }, [cityName]);

  if (error) {
    return (
      <Paper 
        elevation={1} 
        sx={{ 
          p: 2, 
          bgcolor: '#fff3f0', 
          color: 'error.main',
          borderRadius: 2
        }}
      >
        <Typography>{error}</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: '12px',
        borderRadius: 2,
        bgcolor: 'white',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: 3,
          backgroundColor: 'rgba(44, 62, 80, 0.02)'
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, color: MAIN_COLOR }}>
        <LocationOnIcon />
        <Typography variant="h6" sx={{ fontWeight: 500 }}>
          Карта
        </Typography>
      </Box>

      <Box
        id="map"
        sx={{
          width: '100%',
          height: 600,
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1
            }}
          >
            <CircularProgress sx={{ color: MAIN_COLOR }} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default MapWidget; 