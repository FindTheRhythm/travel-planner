import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, Pagination, TextField, FormControl, Container, Typography, Card, CardContent, Button, Chip, Autocomplete, useMediaQuery, useTheme, Divider, CardMedia, CircularProgress } from '@mui/material';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import SearchIcon from '@mui/icons-material/Search';
import TagChip from '../components/TagChip';
import { API_BASE_URL } from '../config';

// Константы для цветов в соответствии с NavBar
const MAIN_COLOR = '#2c3e50';

interface Tour {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const TourExplorer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const toursPerPage = 6;
  
  // Используем useRef для отслеживания первоначальной загрузки
  const initialLoadDone = useRef(false);

  // Получаем данные туров
  useEffect(() => {
    fetch(`${API_BASE_URL}/all-tours`)
      .then(response => response.json())
      .then(data => {
        setTours(data);
        setFilteredTours(data);
        
        // После загрузки туров обрабатываем URL параметры
        const params = new URLSearchParams(location.search);
        const tagFromUrl = params.get('tag');
        
        if (tagFromUrl) {
          const decodedTag = decodeURIComponent(tagFromUrl);
          
          // Добавляем тег из URL к выбранным тегам
          setSelectedTags(prev => {
            // Если тег уже есть в списке, не добавляем его повторно
            if (!prev.includes(decodedTag)) {
              return [...prev, decodedTag];
            }
            return prev;
          });
          
          // Больше не очищаем URL от параметров тега
          // Оставляем URL с параметром tag как есть
        }
      })
      .catch(error => console.error('Error fetching tours:', error));
  }, []); // Выполняем только при монтировании компонента

  useEffect(() => {
    let result = tours;

    // Фильтрация по поисковому запросу
    if (searchQuery) {
      result = result.filter(tour =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Фильтрация по тегам
    if (selectedTags.length > 0) {
      result = result.filter(tour => 
        selectedTags.every(tag => tour.tags?.includes(tag))
      );
    }

    setFilteredTours(result);
    setPage(1); // Сброс на первую страницу при изменении фильтров
  }, [searchQuery, selectedTags, tours]);

  // Получение уникальных тегов из всех туров
  const allTags = Array.from(new Set(tours.flatMap(tour => tour.tags || [])));

  // Пагинация
  const pageCount = Math.ceil(filteredTours.length / toursPerPage);
  const displayedTours = filteredTours.slice(
    (page - 1) * toursPerPage,
    page * toursPerPage
  );

  const handleTagClick = (tag: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем переход на страницу тура
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const renderTourTags = (tourTags: string[]) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {tourTags.map((tag) => (
        <TagChip
          key={tag}
          tag={tag}
          onClick={handleTagClick}
          isActive={selectedTags.includes(tag)}
        />
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: { xs: 3, sm: 4 }
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
          <SearchIcon 
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
            Поиск туристических мест
          </Typography>
        </Box>
      </Box>

      <Box 
        sx={{ 
          mb: { xs: 2, sm: 3, md: 4 }, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: { xs: 1.5, sm: 2 },
          px: { xs: 2, sm: 0 }
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 1, sm: 0.5 },
            mx: { xs: 0, sm: 1 },
            fontSize: {
              xs: '0.875rem',
              sm: '0.9rem'
            }
          }}
        >
          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            Найдено мест: <Box component="span" sx={{ fontWeight: 600, color: MAIN_COLOR }}>{filteredTours.length}</Box>
          </Box>
          {selectedTags.length > 0 && (
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="span" sx={{ mx: { xs: 0, sm: 1 }}}>•</Box>
              Выбрано тегов: <Box component="span" sx={{ fontWeight: 600, color: MAIN_COLOR }}>{selectedTags.length}</Box>
            </Box>
          )}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
          <TextField
            label="Поиск по названию или описанию места"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: { xs: 1, sm: 2 }
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: MAIN_COLOR
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: MAIN_COLOR
              }
            }}
          />
          <Autocomplete
            multiple
            options={allTags}
            value={selectedTags}
            onChange={(_, newValue) => setSelectedTags(newValue)}
            disableCloseOnSelect
            sx={{
              minWidth: { xs: '100%', md: '40%' },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: MAIN_COLOR
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: MAIN_COLOR
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Фильтр по тегам"
                placeholder="Введите или выберите теги"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: { xs: 1, sm: 2 }
                  }
                }}
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((tag, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    backgroundColor: MAIN_COLOR,
                    color: 'white',
                    borderRadius: 1.5,
                    fontSize: {
                      xs: '0.8rem',
                      sm: '0.875rem'
                    },
                    height: {
                      xs: '24px',
                      sm: '28px'
                    },
                    fontWeight: 500,
                    '& .MuiChip-deleteIcon': {
                      color: 'white',
                      fontSize: {
                        xs: '1rem',
                        sm: '1.1rem'
                      },
                      '&:hover': {
                        color: 'rgba(255, 255, 255, 0.7)'
                      }
                    },
                    '&:hover': {
                      backgroundColor: '#2980b9'
                    }
                  }}
                />
              ))
            }
          />
        </Box>
      </Box>

      {filteredTours.length === 0 ? (
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            my: { xs: 3, sm: 4 },
            px: { xs: 2, sm: 0 },
            fontSize: {
              xs: '1.1rem',
              sm: '1.25rem'
            },
            color: MAIN_COLOR
          }}
        >
          Места не найдены. Попробуйте изменить параметры поиска.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(280px, 1fr))',
              md: 'repeat(auto-fill, minmax(320px, 1fr))',
              lg: 'repeat(auto-fill, minmax(360px, 1fr))'
            },
            gap: { xs: 2, sm: 3 },
            alignItems: 'stretch',
            mb: { xs: 3, sm: 4 },
            px: { xs: 2, sm: 0 }
          }}
        >
          {displayedTours.map((tour) => (
            <Card 
              key={tour.id}
              onClick={() => navigate(`/travels/${tour.id}`)}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                border: '1px solid rgba(0, 0, 0, 0.12)',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  borderColor: MAIN_COLOR
                }
              }}
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  paddingTop: '56.25%', // 16:9 aspect ratio
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                <Box
                  component="img"
                  src={tour.image}
                  alt={tour.title}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <CardContent sx={{ 
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}>
                <Typography 
                  variant="h6" 
                  component="h2"
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    mb: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: 1.3,
                    color: MAIN_COLOR
                  }}
                >
                  {tour.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    mb: 'auto'
                  }}
                >
                  {tour.description}
                </Typography>
                {renderTourTags(tour.tags)}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {pageCount > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 0 }
        }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size={isMobile ? "small" : "large"}
            sx={{
              '& .MuiPaginationItem-root': {
                fontSize: {
                  xs: '0.875rem',
                  sm: '1rem'
                }
              },
              '& .MuiPaginationItem-root.Mui-selected': {
                backgroundColor: MAIN_COLOR,
                color: 'white',
                '&:hover': {
                  backgroundColor: '#2980b9'
                }
              }
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default TourExplorer; 