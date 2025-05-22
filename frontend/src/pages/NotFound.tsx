import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

// Константы для цветов в соответствии с NavBar
const MAIN_COLOR = '#2c3e50';


const NotFound: React.FC = () => {
  const navigate = useNavigate();

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
        minHeight: 'calc(100vh - 200px)', // вычитаем высоту навбара и футера
        textAlign: 'center',
        padding: 3
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 5 },
          maxWidth: 600,
          width: '100%',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderTop: `4px solid ${MAIN_COLOR}`
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
          color: 'text.secondary'
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
      </Paper>
    </Box>
  );
};

export default NotFound; 