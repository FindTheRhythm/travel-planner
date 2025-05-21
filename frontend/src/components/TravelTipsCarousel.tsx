// frontend/src/components/TravelTipsCarousel.tsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Fade } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Tip {
  id: number;
  title: string;
  text: string;
}

interface TravelTipsCarouselProps {
  tips: Tip[];
}

const TravelTipsCarousel: React.FC<TravelTipsCarouselProps> = ({ tips }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Автоматическая прокрутка каждые 10 секунд
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        handleNext();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % tips.length);
      setFade(true);
    }, 300);
  };

  const handlePrev = () => {
    setFade(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + tips.length) % tips.length);
      setFade(true);
    }, 300);
  };

  const tip = tips[currentIndex];

  return (
    <Box
      component="section"
      role="region"
      aria-roledescription="карусель"
      aria-label="Советы путешественникам"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 900,
        mx: 'auto',
        my: 4,
        p: 4,
        bgcolor: '#f2f2f2',
        borderRadius: 2,
        boxShadow: 2,
        minHeight: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconButton
        onClick={handlePrev}
        aria-label="Предыдущий совет"
        sx={{
          position: 'absolute',
          left: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'rgba(0,0,0,0.4)',
          color: '#fff',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.6)',
          },
        }}
      >
        <ArrowBackIcon aria-hidden="true" />
      </IconButton>

      <Fade in={fade} timeout={300}>
        <Box 
          sx={{ textAlign: 'center', px: 4 }}
          role="tabpanel"
          aria-live="polite"
          aria-atomic="true"
        >
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ fontWeight: 'bold', mb: 1 }}
          >
            {tip.title}
          </Typography>
          <Typography variant="body1" component="p">
            {tip.text}
          </Typography>
          <Box 
            component="div" 
            role="status" 
            aria-label="Позиция в карусели"
            sx={{ mt: 2 }}
          >
            {currentIndex + 1} из {tips.length}
          </Box>
        </Box>
      </Fade>

      <IconButton
        onClick={handleNext}
        aria-label="Следующий совет"
        sx={{
          position: 'absolute',
          right: 16,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          bgcolor: 'rgba(0,0,0,0.4)',
          color: '#fff',
          '&:hover': {
            bgcolor: 'rgba(0,0,0,0.6)',
          },
        }}
      >
        <ArrowForwardIcon aria-hidden="true" />
      </IconButton>
    </Box>
  );
};

export default TravelTipsCarousel;
