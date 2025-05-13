// frontend/src/pages/About.tsx
import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const About: React.FC = () => (
  <Container>
    <Typography 
      variant="h4" 
      sx={{ 
        margin: '20px 0',
        fontSize: {
          xs: '1.3rem',
          sm: '1.8rem',
          md: '2.2rem',
          lg: '2.0rem'
        },
        textAlign: 'center'
      }}
    >
      Здесь располагается инструкция к использованию приложения и информация о нём
    </Typography>
    <Typography variant="body1">
      Это приложение для планирования путешествий, разработанное с использованием React, Node.js, Material UI и тд. 
      Здесь вы можете искать интересные места для посещения, сохранять понравившиеся туры и планировать свои путешествия.
      </Typography>
      <Typography variant="body1">За авторством проекта стоит студент 2 курса университета РТУ МИРЭА.</Typography>
      <Typography variant="body1">Автор сия творения: <a href="https://github.com/FindTheRhythm">Данила Шурупов</a></Typography>
  </Container>
);

export default About;
