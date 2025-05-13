import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Travel {
  id: number;
  title: string;
  city: string;
  description: string;
}

interface TravelImage {
  photo: string;
  autor: string;
}

interface Place {
  id: number;
  name: string;
  photo: string;
  description: string;
  link: string;
}

interface TravelDetail {
  id: number;
  name: string;
  images: TravelImage[];
  firstDescription: string;
  secondDescription: string;
  thirdDescription: string;
  places: Place[];
  hotels: string;
  flights: string;
}

const TravelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [travel, setTravel] = useState<Travel | null>(null);
  const [details, setDetails] = useState<TravelDetail | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    // Проверяем, сохранен ли тур у пользователя
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
      fetch(`http://localhost:5000/travels/user/${user.id}`)
        .then(res => res.json())
        .then(tours => {
          setIsSaved(tours.some((t: Travel) => t.id === Number(id)));
        })
        .catch(err => console.error('Error checking saved status:', err));
    }

    // Получаем данные тура из popular-tours
    fetch(`http://localhost:5000/popularTours/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setTravel(data);
        } else {
          throw new Error('Tour not found');
        }
      })
      .catch(err => {
        console.error('Ошибка загрузки данных о путешествии:', err);
        setTravel(null);
      });

    // Получаем детали тура
    fetch('http://localhost:5000/travel-details')
      .then(res => res.json())
      .then((data: TravelDetail[]) => {
        const found = data.find(detail => detail.id === Number(id));
        if (found) {
          setDetails(found);
        }
      })
      .catch(err => {
        console.error('Ошибка загрузки подробностей тура:', err);
        setDetails(null);
      });
  }, [id]);

  useEffect(() => {
    const API_KEY = '1da204be3fa32bb8734780b5a00f188e';
    const cityName = travel?.city || details?.name?.split(',')[0];

    if (cityName) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          if (data?.main && Array.isArray(data.weather)) {
            setWeather(data);
          } else {
            throw new Error('Неверная структура ответа от OpenWeather');
          }
        })
        .catch(err => {
          console.error('Ошибка загрузки погоды:', err);
          setWeatherError(true);
        });
    }
  }, [travel, details]);

  const handleSaveTrip = async () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы сохранить тур');
      return;
    }

    if (!travel) return;

    try {
      const res = await fetch(`http://localhost:5000/travels/user/${user.id}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ travelId: Number(id) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save tour');
      }

      setIsSaved(true);
      alert('Тур успешно сохранен!');
    } catch (err) {
      console.error('Error saving tour:', err);
      alert(err instanceof Error ? err.message : 'Не удалось сохранить тур. Попробуйте позже.');
    }
  };

  if (!travel || !details) {
    return <Container><Typography>Загрузка данных о туре...</Typography></Container>;
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h3" component="h1">
          {travel.title}
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: isSaved ? 'success.main' : 'text.secondary',
            fontStyle: 'italic',
            mt: 1
          }}
        >
          {isSaved ? "Место в вашем списке" : "Место не сохранено"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Фото галерея */}
      {details.images?.length ? (
        <Box sx={{ mb: 4 }}>
          <Slider dots arrows autoplay fade speed={1000} autoplaySpeed={10000}>
            {details.images.map((img, idx) => (
              <div key={idx}>
                <Card sx={{ maxHeight: 600 }}>
                  <CardMedia
                    component="img"
                    image={img.photo || '/default.jpg'}
                    alt={`Фото ${idx + 1}`}
                    sx={{ width: '100%', objectFit: 'contain' }}
                  />
                </Card>
              </div>
            ))}
          </Slider>
        </Box>
      ) : <Typography>Нет изображений</Typography>}

      <Typography sx={{ mt: 3 }}>{details.firstDescription}</Typography>
      <Typography sx={{ mt: 2 }}>{details.secondDescription}</Typography>
      <Typography sx={{ mt: 2 }}>{details.thirdDescription}</Typography>

      {/* Погода */}
      <Typography variant="h6" sx={{ mt: 4 }}>Погода сейчас</Typography>
      {weather ? (
        <Typography>Температура: {weather.main.temp}°C, {weather.weather[0].description}</Typography>
      ) : weatherError ? (
        <Typography color="error">Ошибка загрузки погоды</Typography>
      ) : (
        <Typography>Загрузка...</Typography>
      )}

      {/* Достопримечательности */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Популярные туристические места</Typography>
      <Grid container spacing={2}>
        {details.places.map((place, idx) => (
          <Grid item key={idx} xs={12} sm={6}>
            <Card
              sx={{
                height: 300,
                position: 'relative',
                overflow: 'hidden',
                '&:hover .place-overlay': {
                  background: 'rgba(0,0,0,0.7)',
                },
                '&:hover .place-content': {
                  transform: 'translateY(0)',
                }
              }}
            >
              <CardMedia
                component="img"
                image={place.photo || '/default.jpg'}
                alt={`Фото места ${idx + 1}`}
                sx={{ 
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <Box
                className="place-overlay"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.8))',
                  transition: 'background 0.3s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px',
                }}
              >
                <Box
                  className="place-content"
                  sx={{
                    color: 'white',
                    transform: 'translateY(calc(100% - 120px))',
                    transition: 'transform 0.3s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    pt: 12.5
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      lineHeight: 1.2,
                      mt: 'auto'
                    }}
                  >
                    {place.name}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 0,
                      opacity: 0.95
                    }}
                  >
                    {place.description}
                  </Typography>
                  <Link 
                    href={place.link} 
                    target="_blank" 
                    rel="noopener"
                    sx={{ 
                      color: 'white',
                      textDecoration: 'underline',
                      '&:hover': {
                        color: 'primary.light'
                      }
                    }}
                  >
                    Где находится?
                  </Link>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ 
        mt: 5, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            href={details.hotels}
            target="_blank"
            rel="noopener"
            sx={{ 
              fontSize: '1.1em',
              padding: '6px 20px'
            }}
          >
            🏨 Отели и гостинницы
          </Button>
          <Button
            variant="outlined"
            color="primary"
            href={details.flights}
            target="_blank"
            rel="noopener"
            sx={{ 
              fontSize: '1.1em',
              padding: '6px 20px'
            }}
          >
            ✈️ Авиабилеты
          </Button>
        </Box>
        <Button
          variant="outlined"
          color={isSaved ? "success" : "primary"}
          onClick={handleSaveTrip}
          disabled={isSaved}
          sx={{ 
            fontSize: '1.1em',
            padding: '6px 20px'
          }}
        >
          {isSaved ? "💚 Место сохранено" : "❤️ Сохранить место"}
        </Button>
      </Box>
    </Container>
  );
};

export default TravelDetails;