// frontend/src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TravelTipsCarousel from '../components/TravelTipsCarousel';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

interface Travel {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

interface Tip {
  id: number;
  title: string;
  text: string;
}

const Home: React.FC = () => {
  const [popularTravels, setPopularTravels] = useState<Travel[]>([]);
  const [tips, setTips] = useState<Tip[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();

  const handleTagClick = (tag: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем переход на страницу тура
    navigate(`/travels/explore?tag=${encodeURIComponent(tag)}`);
  };

  const renderTourTags = (tourTags: string[]) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {tourTags.map((tag) => (
        <Chip
          key={tag}
          label={tag}
          size="small"
          onClick={(e) => handleTagClick(tag, e)}
          sx={{
            backgroundColor: 'grey.100',
            color: 'text.primary',
            borderRadius: 1.5,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: 'grey.200',
            },
            '&:active': {
              transform: 'scale(0.95)',
            }
          }}
        />
      ))}
    </Box>
  );

  // Подгружаем популярные туры с сервера
  useEffect(() => {
    fetch('http://localhost:5000/popularTours')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setPopularTravels(data);
        } else if (Array.isArray(data.popularTravels)) {
          setPopularTravels(data.popularTravels);
        } else {
          console.error('Unexpected response format:', data);
          setPopularTravels([]);
        }
      })
      .catch(err => console.error('Failed to load popular tours:', err));
  }, []);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  // Подгружаем советы с сервера
  useEffect(() => {
    fetch('http://localhost:5000/tips')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setTips(data);
        } else {
          console.error('Unexpected response format for tips:', data);
          setTips([]);
        }
      })
      .catch(err => console.error('Failed to load tips:', err));
  }, []);

  return (
    <Container>
      <Typography 
        variant="h3" 
        sx={{ 
          margin: '20px 0',
          fontSize: {
            xs: '1.3rem',
            sm: '1.8rem',
            md: '2.2rem',
            lg: '2.0rem'
          },
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center'
        }}
      >
        Здесь располагается случайная подборка популярных мест со всего мира
      </Typography>
      <Grid container spacing={3}>
        {popularTravels.slice(0, visibleCount).map((travel) => (
          <Grid item xs={12} key={travel.id}>
            <Card sx={{ 
              width: '100%',
              display: 'flex', 
              flexDirection: 'row',
              cursor: 'pointer',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: 2,
              height: '150px',
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)',
                transition: 'all 0.2s ease-in-out',
                borderColor: 'primary.main'
              }
            }}
            onClick={() => navigate(`/travels/${travel.id}`)}
            >
              <Box 
                sx={{ 
                  width: 'auto',
                  height: '94%',
                  position: 'relative',
                  aspectRatio: '4/3',
                  alignSelf: 'center',
                  ml: '4.5px'
                }}
              >
                <Box
                  component="img"
                  src={travel.image}
                  alt={travel.title}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </Box>
              <CardContent sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                gap: 1
              }}>
                <Typography variant="h6" component="h2">
                  {travel.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {travel.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(travel.tags || []).map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      onClick={(e) => handleTagClick(tag, e)}
                      sx={{
                        backgroundColor: 'grey.100',
                        color: 'text.primary',
                        borderRadius: 1.5,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          backgroundColor: 'grey.200',
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        }
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {visibleCount < popularTravels.length && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
          <Button 
            variant="outlined" 
            onClick={handleShowMore}
            size="large"
          >
            Показать еще
          </Button>
        </Box>
      )}

      <Typography variant="h4" style={{ margin: '40px 0', textAlign: 'center' }}>А здесь вы можете посмотреть советы для путешественников</Typography>
      {tips.length > 0 && <TravelTipsCarousel tips={tips} />}
    </Container>
  );
};

export default Home;
