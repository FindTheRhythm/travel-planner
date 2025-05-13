import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Grid, Pagination, TextField, FormControl, Container, Typography, Card, CardContent, Button, Chip, Autocomplete } from '@mui/material';

interface Tour {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const TourExplorer: React.FC = () => {
  const navigate = useNavigate();
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
    fetch('http://localhost:5000/allTours')
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          mb: 3,
          textAlign: 'center'
        }}
      >
        Здесь вы можете искать интересующие вас места
      </Typography>

      <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            mx: 1
          }}
        >
          Найдено мест: <Box component="span" sx={{ fontWeight: 600 }}>{filteredTours.length}</Box>
          {selectedTags.length > 0 && (
            <>
              {' '}• Выбрано тегов: <Box component="span" sx={{ fontWeight: 600 }}>{selectedTags.length}</Box>
            </>
          )}
        </Typography>
        <TextField
          label="Поиск по названию или описанию места"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
        <Autocomplete
          multiple
          options={allTags}
          value={selectedTags}
          onChange={(_, newValue) => setSelectedTags(newValue)}
          disableCloseOnSelect
          renderInput={(params) => (
            <TextField
              {...params}
              label="Фильтр по тегам"
              placeholder="Введите или выберите теги"
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
                  fontSize: '0.935rem',
                  fontWeight: 500,
                  '& .MuiChip-deleteIcon': {
                    color: 'white',
                    fontSize: '1.1rem',
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

      {filteredTours.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', my: 4 }}>
          Места не найдены. Попробуйте изменить параметры поиска.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {displayedTours.map((tour) => (
            <Grid item xs={12} key={tour.id}>
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
              onClick={() => navigate(`/travels/${tour.id}`)}
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
                    src={tour.image}
                    alt={tour.title}
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
                    {tour.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tour.description}
                  </Typography>
                  {renderTourTags(tour.tags)}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Container>
  );
};

export default TourExplorer; 