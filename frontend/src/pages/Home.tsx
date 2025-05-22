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
import Divider from '@mui/material/Divider';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import TagChip from '../components/TagChip';
import { API_BASE_URL } from '../config';

// Константы для цветов в соответствии с NavBar
const MAIN_COLOR = '#2c3e50';

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

  // Подгружаем популярные туры с сервера
  useEffect(() => {
    fetch(`${API_BASE_URL}/popular-tours`)
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
    fetch(`${API_BASE_URL}/tips`)
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
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
          mt: 3
        }}
      >
        <Divider sx={{ 
          position: 'absolute', 
          width: '100%', 
          borderColor: `rgba(52, 152, 219, 0.3)`
        }} />
        
        <Box sx={{ 
          backgroundColor: '#fff',
          px: 3,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <TravelExploreIcon 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem' }, 
              color: MAIN_COLOR 
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontSize: {
                xs: '1.3rem',
                sm: '1.8rem',
                md: '2.2rem',
                lg: '2.4rem'
              },
              textAlign: 'center',
              fontWeight: 600,
              color: MAIN_COLOR
            }}
          >
            Популярные туристические места
          </Typography>
        </Box>
      </Box>

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
                borderColor: MAIN_COLOR
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
                <Typography variant="h6" component="h2" sx={{ color: MAIN_COLOR }}>
                  {travel.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {travel.description}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(travel.tags || []).map((tag) => (
                    <TagChip
                      key={tag}
                      tag={tag}
                      onClick={handleTagClick}
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
            sx={{
              borderColor: MAIN_COLOR,
              color: MAIN_COLOR,
              '&:hover': {
                borderColor: '#2980b9',
                backgroundColor: 'rgba(52, 152, 219, 0.08)'
              }
            }}
          >
            Показать еще
          </Button>
        </Box>
      )}

      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 4,
          mt: 5
        }}
      >
        <Divider sx={{ 
          position: 'absolute', 
          width: '100%', 
          borderColor: `rgba(52, 152, 219, 0.3)`
        }} />
        
        <Box sx={{ 
          backgroundColor: '#fff',
          px: 3,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <TipsAndUpdatesIcon 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem' }, 
              color: MAIN_COLOR 
            }} 
          />
          <Typography 
            variant="h4" 
            component="h2"
            sx={{ 
              fontSize: {
                xs: '1.3rem',
                sm: '1.8rem',
                md: '2.2rem',
                lg: '2.4rem'
              },
              textAlign: 'center',
              fontWeight: 600,
              color: MAIN_COLOR
            }}
          >
            Советы для путешественников
          </Typography>
        </Box>
      </Box>
      
      {tips.length > 0 && <TravelTipsCarousel tips={tips} />}
    </Container>
  );
};

export default Home;
