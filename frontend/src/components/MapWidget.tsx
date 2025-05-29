import React, { useEffect } from 'react';
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
  useEffect(() => {
    // Загружаем API Яндекс Карт
    const loadYandexMaps = () => {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=355bc65f-4010-4cbb-a73f-61ea5fb1d3e2&lang=ru_RU';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        window.ymaps.ready(() => {
          // Геокодируем название города
          window.ymaps.geocode(cityName, {
            results: 1
          }).then((res: any) => {
            const coordinates = res.geoObjects.get(0).geometry.getCoordinates();
            
            // Создаем карту
            const map = new window.ymaps.Map('map', {
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
          });
        });
      };
    };

    loadYandexMaps();

    // Очистка при размонтировании
    return () => {
      const scripts = document.getElementsByTagName('script');
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes('api-maps.yandex.ru')) {
          scripts[i].remove();
          break;
        }
      }
    };
  }, [cityName]);

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
          overflow: 'hidden'
        }}
      />
    </Paper>
  );
};

export default MapWidget; 