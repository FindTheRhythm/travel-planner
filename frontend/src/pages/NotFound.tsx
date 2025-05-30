import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper, keyframes } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

// Константы для цветов в соответствии с NavBar
const MAIN_COLOR = '#2c3e50';

// Анимация для ОКАК
const flyAcross = keyframes`
  0% {
    transform: translateX(120vw);
  }
  100% {
    transform: translateX(-120vw);
  }
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const phrases = ['ОКАК', 'А КАК??', 'ВОТ ТАК.'];

  // Создаем массив случайных позиций и размеров при первом рендере
  const items = useMemo(() => [...Array(45)].map(() => ({
    top: Math.random() * 100,
    size: Math.floor(Math.random() * 41 + 30), // от 30 до 70
    offset: Math.random() * 100,
    phrase: phrases[Math.floor(Math.random() * phrases.length)]
  })), []); // Пустой массив зависимостей означает, что значения создаются только один раз

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 200px)',
        padding: 3,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
        }}
      >
        {items.map((item, index) => (
          <Typography
            key={index}
            sx={{
              position: 'fixed',
              fontSize: `${item.size}px`,
              color: MAIN_COLOR,
              pointerEvents: 'none',
              animation: `${flyAcross} 8s linear infinite`,
              animationDelay: `-${item.offset}s`,
              top: `${item.top}vh`,
              fontWeight: 'bold',
              zIndex: 0,
              whiteSpace: 'nowrap',
              opacity: isHovered ? 0.4 : 0,
              transition: 'opacity 0.5s ease-out',
              willChange: 'transform'
            }}
          >
            {item.phrase}
          </Typography>
        ))}
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 900,
          width: '100%',
          borderRadius: 2,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 4, md: 0 },
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderTop: `4px solid ${MAIN_COLOR}`,
          position: 'relative',
          zIndex: 1
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            flex: '0 1 50%',
            pr: { md: 4 }
          }}
        >
          <SentimentDissatisfiedIcon sx={{ 
            fontSize: '5rem', 
            mb: 2, 
            color: MAIN_COLOR 
          }} />
          
          <Typography variant="h1" sx={{ 
            fontSize: { xs: '4rem', sm: '6rem' }, 
            fontWeight: 'bold', 
            mb: 1,
            color: MAIN_COLOR,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            404
          </Typography>
          
          <Typography variant="h4" sx={{ 
            mb: 3, 
            color: MAIN_COLOR,
            fontSize: { xs: '1.5rem', sm: '2rem' }
          }}>
            Страница не найдена
          </Typography>
          
          <Typography variant="body1" sx={{ 
            mb: 4,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            color: 'text.secondary',
            maxWidth: '80%'
          }}>
            К сожалению, запрашиваемая страница не существует
          </Typography>
          
          <Button
            variant="contained"
            onClick={handleGoHome}
            size="large"
            sx={{ 
              bgcolor: MAIN_COLOR,
              '&:hover': {
                bgcolor: '#2980b9'
              },
              px: 3,
              py: 1,
              fontWeight: 500
            }}
          >
            Вернуться на главную
          </Button>
        </Box>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: { xs: '100%', md: '50%' }
          }}
        >
          <Box
            component="img"
            src="/images/notfoundvector.png"
            alt="404 Not Found"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
              width: '100%',
              maxWidth: 500,
              objectFit: 'contain',
              border: `2px solid ${MAIN_COLOR}`,
              borderRadius: '12px',
              padding: 0,
              backgroundColor: 'rgba(44, 62, 80, 0.02)',
              boxSizing: 'border-box',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)'
              }
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFound; 