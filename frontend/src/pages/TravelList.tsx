// frontend/src/pages/TravelList.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Chip from '@mui/material/Chip';

interface Travel {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

const TravelList: React.FC = () => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();
  const storedUser = localStorage.getItem('user');

  useEffect(() => {
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const { id } = JSON.parse(storedUser);

    fetch(`http://localhost:5000/travels/user/${id}`)
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Raw server response:', data);
        if (Array.isArray(data)) {
          console.log('Data is array, setting directly');
          setTravels(data);
        } else if (Array.isArray(data.travels)) {
          console.log('Data is object with travels array');
          setTravels(data.travels);
        } else {
          console.error('Unexpected response format:', data);
          setTravels([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load user travels:', err);
        setLoading(false);
      });
  }, [storedUser]);

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      alert('Пожалуйста, войдите в систему, чтобы сохранить место');
      return;
    }

    if (!window.confirm('Вы уверены, что хотите удалить это место?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/travels/user-tours/${user.id}/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        alert('Не удалось удалить место. Попробуйте позже.');
        return;
      }

      setTravels(prev => {
        const newTravels = prev.filter(t => t.id !== id);
        console.log('Обновленный список мест:', newTravels);
        return newTravels;
      });
      alert('Место успешно удалено!');
    } catch (err) {
      console.error(err);
      alert('Произошла ошибка');
    }
  };

  const handleTagClick = (tag: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем переход на страницу тура
    navigate(`/travels/explore?tag=${encodeURIComponent(tag)}`);
  };

  if (loading) return <Typography>Загрузка...</Typography>;

  if (!storedUser) {
    return (
      <Container>
        <Typography 
          variant="h3" 
          sx={{ 
            margin: '20px 0',
            fontSize: {
              xs: '1.4rem',
              sm: '1.7rem',
              md: '2rem',
              lg: '2.2rem'
            },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'center'
          }}
        >
          Здесь можно посмотреть дабавленные вами места
        </Typography>
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: 2
          }}
        >
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Для доступа к сохраненным местам необходимо войти в систему
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Войдите в существующий аккаунт или создайте новый, чтобы сохранять понравившиеся места
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            '& .MuiButton-root': {
              minWidth: 200
            }
          }}>
            <Button
              variant="contained"
              component={Link}
              to="/login"
              startIcon={<LoginIcon />}
            >
              Войти
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/register"
              startIcon={<PersonAddIcon />}
            >
              Зарегистрироваться
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container>
      <Typography 
        variant="h3" 
        sx={{ 
          margin: '20px 0',
          fontSize: {
            xs: '1.4rem',
            sm: '1.7rem',
            md: '2rem',
            lg: '2.2rem'
          },
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center'
        }}
      >
        Здесь можно посмотреть дабавленные вами места
      </Typography>
      {travels.length === 0 ? (
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            mt: 4,
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            У вас пока нет сохраненных мест
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Начните с просмотра доступных мест и добавьте понравившиеся в свой список
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            justifyContent: 'center',
            flexWrap: { xs: 'wrap', sm: 'nowrap' }
          }}>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
              size="large"
              sx={{ 
                minWidth: 200,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              🌟 Посмотреть подборку
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/travels/explore')}
              size="large"
              sx={{ 
                minWidth: 200,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              🔍 Найти самостоятельно
            </Button>
          </Box>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {travels.slice(0, visibleCount).map((travel) => (
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
                    gap: 1,
                    position: 'relative'
                  }}>
                    <Tooltip title="Удалить место" placement="left">
                      <IconButton
                        size="small"
                        onClick={(e) => handleDelete(travel.id, e)}
                        sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: 'text.secondary',
                          '&:hover': {
                            color: 'error.main'
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Typography variant="h6" component="h2" sx={{ pr: 4 }}>
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
          {visibleCount < travels.length && (
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
        </>
      )}
    </Container>
  );
};

export default TravelList;
