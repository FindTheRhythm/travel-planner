import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Pagination, TextField, FormControl, Container, Typography, Card, CardContent, Button, Chip, Autocomplete, useMediaQuery, useTheme } from '@mui/material';
import { API_BASE_URL } from '../config';

interface Tour {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const TourExplorer: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const toursPerPage = 6;

  // Получаем тег из URL при загрузке и при изменении URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tagFromUrl = params.get('tag');
    if (tagFromUrl) {
      const decodedTag = decodeURIComponent(tagFromUrl);
      if (!selectedTags.includes(decodedTag)) {
        setSelectedTags(prev => [...prev, decodedTag]);
      }
    }
  }, [window.location.search]); // Реагируем на изменения URL

  useEffect(() => {
    fetch(`${API_BASE_URL}/all-tours`)
      .then(response => response.json())
      .then(data => {
        setTours(data);
        setFilteredTours(data);
      })
      .catch(error => console.error('Error fetching tours:', error));
  }, []);

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
        <Chip
          key={tag}
          label={tag}
          size="small"
          onClick={(e) => handleTagClick(tag, e)}
          sx={{
            backgroundColor: selectedTags.includes(tag) ? 'primary.main' : 'grey.100',
            color: selectedTags.includes(tag) ? 'white' : 'text.primary',
            borderRadius: 1.5,
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: selectedTags.includes(tag) ? 'primary.dark' : 'grey.200',
            },
            '&:active': {
              transform: 'scale(0.95)',
            }
          }}
        />
      ))}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          fontSize: {
            xs: '1.4rem',
            sm: '1.7rem',
            md: '2rem',
            lg: '2.2rem'
          },
          whiteSpace: { xs: 'normal', md: 'nowrap' },
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          mb: { xs: 2, sm: 3 },
          textAlign: 'center',
          px: { xs: 2, sm: 0 }
        }}
      >
        Здесь вы можете искать интересующие вас места
      </Typography>

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
            Найдено мест: <Box component="span" sx={{ fontWeight: 600 }}>{filteredTours.length}</Box>
          </Box>
          {selectedTags.length > 0 && (
            <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box component="span" sx={{ mx: { xs: 0, sm: 1 }}}>•</Box>
              Выбрано тегов: <Box component="span" sx={{ fontWeight: 600 }}>{selectedTags.length}</Box>
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
              minWidth: { xs: '100%', md: '40%' }
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
                    backgroundColor: 'primary.main',
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
                      backgroundColor: 'primary.dark'
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
            }
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
                  borderColor: 'primary.main'
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
                    lineHeight: 1.3
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
              }
            }}
          />
        </Box>
      )}
    </Container>
  );
};

export default TourExplorer; 