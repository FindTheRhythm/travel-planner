import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';

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
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Страница не найдена
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        К сожалению, запрашиваемая страница не существует
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoHome}
        size="large"
      >
        Вернуться на главную
      </Button>
    </Box>
  );
};

export default NotFound; 