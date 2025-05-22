import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { API_BASE_URL } from '../config';

interface Travel {
  id: number;
  title: string;
  city: string;
  description: string;
}

interface TravelImage {
  photo: string;
  autor: string;
}

interface Place {
  id: number;
  name: string;
  photo: string;
  description: string;
  link: string;
}

interface Comment {
  id: number;
  userId: number | null;
  username: string;
  text: string;
  rating: number | null;
  date: string;
}

interface TravelDetail {
  id: number;
  name: string;
  images: TravelImage[];
  firstDescription: string;
  secondDescription: string;
  thirdDescription: string;
  places: Place[];
  hotels: string;
  flights: string;
  comments?: Comment[];
}

// Константы для цветов в соответствии с NavBar
const MAIN_COLOR = '#2c3e50';
const SECONDARY_COLOR = '#3498db';

const TravelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [travel, setTravel] = useState<Travel | null>(null);
  const [details, setDetails] = useState<TravelDetail | null>(null);
  const [weather, setWeather] = useState<any>(null);
  const [weatherError, setWeatherError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState<number | null>(null);
  const [commentLoading, setCommentLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Новое состояние для отображения комментариев
  const [showAllComments, setShowAllComments] = useState(false);
  const commentsPerPage = 4; // Количество комментариев для начального отображения

  // Состояние для диалогов
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let travelData: Travel | null = null;

    // Проверяем, сохранен ли тур у пользователя
    const user = getCurrentUser();
    if (user) {
      fetch(`${API_BASE_URL}/travels/user/${user.id}`)
        .then(res => res.json())
        .then(tours => {
          setIsSaved(tours.some((t: Travel) => t.id === Number(id)));
        })
        .catch(err => console.error('Error checking saved status:', err));
    }

    // Получаем данные тура из popular-tours
    fetch(`${API_BASE_URL}/popular-tours/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Tour not found');
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setTravel(data);
          travelData = data;
        } else {
          throw new Error('Tour not found');
        }
      })
      .catch(err => {
        console.error('Ошибка загрузки данных о путешествии:', err);
        setTravel(null);
        setIsLoading(false);
        navigate('/404');
        return;
      });

    // Получаем детали тура
    fetch(`${API_BASE_URL}/travel-details`)
      .then(res => res.json())
      .then((data: TravelDetail[]) => {
        const found = data.find(detail => detail.id === Number(id));
        if (found) {
          setDetails(found);
        } else {
          throw new Error('Travel details not found');
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки подробностей тура:', err);
        setDetails(null);
        setIsLoading(false);
        navigate('/404');
      });
      
    // Загрузка комментариев
    fetchComments();
  }, [id, navigate]);

  // Функция для загрузки комментариев
  const fetchComments = () => {
    fetch(`${API_BASE_URL}/travel-details/${id}/comments`)
      .then(res => {
        if (!res.ok) {
          return []; // Возвращаем пустой массив, если нет комментариев
        }
        return res.json();
      })
      .then(data => {
        setComments(Array.isArray(data) ? data : []);
      })
      .catch(err => {
        console.error('Ошибка загрузки комментариев:', err);
        setComments([]);
      });
  };

  // Получаем данные текущего пользователя
  const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user') || 'null');
  };

  // Функция для проверки авторизации
  const checkAuth = () => {
    const user = getCurrentUser();
    if (!user) {
      setAuthDialogOpen(true);
      return false;
    }
    return true;
  };

  // Добавление нового комментария
  const handleAddComment = async () => {
    // Проверяем авторизацию
    if (!checkAuth()) {
      return;
    }

    if (!newComment.trim()) {
      setSnackbar({
        open: true,
        message: 'Комментарий не может быть пустым',
        severity: 'error'
      });
      return;
    }

    setCommentLoading(true);
    const user = getCurrentUser();
    
    try {
      const res = await fetch(`${API_BASE_URL}/travel-details/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user ? user.id : null,
          username: user ? user.username : 'Гость',
          text: newComment,
          rating: rating
        }),
      });

      if (!res.ok) {
        throw new Error('Не удалось добавить комментарий');
      }

      const data = await res.json();
      // Добавляем новый комментарий в начало списка, а не в конец
      setComments(prev => [data, ...prev]);
      setNewComment('');
      setRating(null);
      setSnackbar({
        open: true,
        message: 'Комментарий успешно добавлен!',
        severity: 'success'
      });
      // Показываем все комментарии, если добавили новый (чтобы пользователь видел свой комментарий)
      setShowAllComments(true);
    } catch (error) {
      console.error('Ошибка добавления комментария:', error);
      setSnackbar({
        open: true,
        message: 'Не удалось добавить комментарий',
        severity: 'error'
      });
    } finally {
      setCommentLoading(false);
    }
  };

  // Функция для прямого удаления комментария в один клик
  const handleDeleteComment = async (commentId: number) => {
    const user = getCurrentUser();
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Необходимо авторизоваться для удаления комментариев',
        severity: 'error'
      });
      return;
    }

    // Преобразуем ID в числа для уверенности
    const numericCommentId = Number(commentId);
    const numericUserId = Number(user.id);
    const numericTravelId = Number(id);

    // Создаем URL для удаления комментария
    const deleteUrl = `${API_BASE_URL}/travel-details/${numericTravelId}/comments/${numericCommentId}?userId=${numericUserId}`;

    try {
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Ошибка сервера:', errorData);
        throw new Error(errorData.error || 'Не удалось удалить комментарий');
      }

      // Удаляем комментарий из состояния
      setComments(prev => prev.filter(comment => comment.id !== numericCommentId));
      setSnackbar({
        open: true,
        message: 'Комментарий успешно удален',
        severity: 'success'
      });
    } catch (error) {
      console.error('Ошибка удаления комментария:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Не удалось удалить комментарий',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCloseAuthDialog = () => {
    setAuthDialogOpen(false);
  };

  const handleGoToLogin = () => {
    setAuthDialogOpen(false);
    navigate('/login');
  };

  useEffect(() => {
    const API_KEY = '1da204be3fa32bb8734780b5a00f188e';
    const cityName = travel?.city || details?.name?.split(',')[0];

    if (cityName) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&units=metric&appid=${API_KEY}`)
        .then(res => res.json())
        .then(data => {
          if (data?.main && Array.isArray(data.weather)) {
            setWeather(data);
          } else {
            throw new Error('Неверная структура ответа от OpenWeather');
          }
        })
        .catch(err => {
          console.error('Ошибка загрузки погоды:', err);
          setWeatherError(true);
        });
    }
  }, [travel, details]);

  const handleSaveTrip = async () => {
    const user = getCurrentUser();
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    if (!travel) return;

    try {
      const res = await fetch(`${API_BASE_URL}/travels/user/${user.id}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ travelId: Number(id) }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save tour');
      }

      setIsSaved(true);
      setSnackbar({
        open: true,
        message: 'Тур успешно сохранен!',
        severity: 'success'
      });
    } catch (err) {
      console.error('Error saving tour:', err);
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Не удалось сохранить тур. Попробуйте позже.',
        severity: 'error'
      });
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography>Загрузка данных о туре...</Typography>
      </Container>
    );
  }

  if (!travel || !details) {
    navigate('/404');
    return null;
  }

  // Функция для форматирования даты комментария
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Функция для проверки, может ли пользователь удалить комментарий
  const canDeleteComment = (commentUserId: number | null) => {
    const user = getCurrentUser();
    return user && (
      // Пользователь может удалить свой комментарий
      (commentUserId !== null && user.id === commentUserId) ||
      // Или пользователь является админом
      user.role === 'admin'
    );
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h3" component="h1">
          {travel.title}
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: isSaved ? 'success.main' : 'text.secondary',
            fontStyle: 'italic',
            mt: 1
          }}
        >
          {isSaved ? "Место в вашем списке" : "Место не сохранено"}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Фото галерея */}
      {details.images?.length ? (
        <Box sx={{ 
          mb: 4,
          '& .slick-arrow': {
            zIndex: 1,
            width: 'auto',
            height: 'auto',
            backgroundColor: 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&:before': {
              fontSize: '32px',
              opacity: 0.6,
              color: '#fff',
              textShadow: '0 1px 3px rgba(0,0,0,0.5)'
            },
            '&:hover:before': {
              opacity: 0.9
            }
          },
          '& .slick-prev': {
            left: '20px',
          },
          '& .slick-next': {
            right: '20px',
          },
          '& .slick-dots': {
            bottom: '10px',
            '& li button:before': {
              fontSize: '8px',
              color: '#fff',
              opacity: 0.6,
            },
            '& li.slick-active button:before': {
              opacity: 0.9,
              color: '#fff',
            }
          }
        }}>
          <Slider 
            dots 
            arrows 
            autoplay 
            fade 
            speed={1000} 
            autoplaySpeed={10000}
          >
            {details.images.map((img, idx) => (
              <div key={idx}>
                <Card sx={{ maxHeight: 600 }}>
                  <CardMedia
                    component="img"
                    image={img.photo || '/default.jpg'}
                    alt={`Фото ${idx + 1}`}
                    sx={{ width: '100%', objectFit: 'contain' }}
                  />
                </Card>
              </div>
            ))}
          </Slider>
        </Box>
      ) : <Typography>Нет изображений</Typography>}

      <Typography sx={{ mt: 3 }}>{details.firstDescription}</Typography>
      <Typography sx={{ mt: 2 }}>{details.secondDescription}</Typography>
      <Typography sx={{ mt: 2 }}>{details.thirdDescription}</Typography>

      {/* Погода */}
      <Typography variant="h6" sx={{ mt: 4 }}>Погода сейчас</Typography>
      {weather ? (
        <Typography>Температура: {weather.main.temp}°C, {weather.weather[0].description}</Typography>
      ) : weatherError ? (
        <Typography color="error">Ошибка загрузки погоды</Typography>
      ) : (
        <Typography>Загрузка...</Typography>
      )}

      {/* Достопримечательности */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }} className="text-title">Популярные туристические места</Typography>
      <Grid container spacing={2}>
        {details.places.map((place, idx) => (
          <Grid item key={idx} xs={12} sm={6}>
            <Card
              sx={{
                height: 300,
                position: 'relative',
                overflow: 'hidden',
                '&:hover .place-overlay': {
                  background: 'rgba(0,0,0,0.7)',
                },
                '&:hover .place-content': {
                  transform: 'translateY(0)',
                }
              }}
            >
              <CardMedia
                component="img"
                image={place.photo || '/default.jpg'}
                alt={`Фото места ${idx + 1}`}
                sx={{ 
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <Box
                className="place-overlay"
                sx={{ 
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(transparent 30%, rgba(0,0,0,0.8))',
                  transition: 'background 0.3s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '20px',
                }}
              >
                <Box
                  className="place-content"
                  sx={{
                    color: 'white',
                    transform: 'translateY(calc(100% - 120px))',
                    transition: 'transform 0.3s ease-in-out',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2.5,
                    pt: 12.5
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      lineHeight: 1.2,
                      mt: 'auto',
                      color: '#ffffff'
                    }}
                  >
                    {place.name}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 0,
                      opacity: 0.95,
                      color: '#ffffff'
                    }}
                  >
                    {place.description}
                  </Typography>
                  <Link 
                    href={place.link} 
                    target="_blank" 
                    rel="noopener"
                    sx={{ 
                      color: 'white',
                      textDecoration: 'underline',
                      '&:hover': {
                        color: 'primary.light'
                      }
                    }}
                  >
                    Где находится?
                  </Link>
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Комментарии */}
      <Typography variant="h5" sx={{ mt: 6, mb: 3 }}>Комментарии</Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: '#f9f9f9', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Добавить комментарий</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography component="legend">Оценка:</Typography>
            <Rating
              name="rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            placeholder="Поделитесь своими впечатлениями о путешествии"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button 
            variant="contained" 
            color="primary" 
            endIcon={<SendIcon />} 
            onClick={handleAddComment}
            disabled={commentLoading}
            sx={{ 
              alignSelf: 'flex-end', 
              bgcolor: MAIN_COLOR,
              '&:hover': {
                bgcolor: SECONDARY_COLOR,
              }
            }}
          >
            Отправить
          </Button>
        </Box>
      </Paper>

      {/* Список комментариев */}
      {comments.length > 0 ? (
        <Box>
          {/* Отображаем либо все комментарии, либо только первые commentsPerPage */}
          {(showAllComments ? comments : comments.slice(0, commentsPerPage)).map((comment) => (
            <Paper 
              key={comment.id} 
              elevation={1} 
              sx={{ 
                p: 2, 
                mb: 2, 
                borderRadius: 2,
                border: '1px solid #f0f0f0',
                position: 'relative'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: SECONDARY_COLOR, mr: 1 }}>
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {comment.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(comment.date)}
                  </Typography>
                </Box>
                {comment.rating !== null && (
                  <Box sx={{ ml: 'auto' }}>
                    <Rating value={comment.rating} readOnly size="small" />
                  </Box>
                )}

                {/* Кнопка удаления комментария (видна автору или админу) */}
                {canDeleteComment(comment.userId) && (
                  <Tooltip 
                    title={getCurrentUser()?.role === 'admin' ? 'Удалить комментарий (админ)' : 'Удалить комментарий'}
                    arrow
                  >
                    <IconButton 
                      size="small"
                      onClick={() => handleDeleteComment(comment.id)}
                      sx={{ 
                        ml: 1,
                        color: getCurrentUser()?.role === 'admin' ? 'error.main' : 'text.secondary',
                        '&:hover': {
                          color: 'error.main',
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', ml: 1 }}>
                {comment.text}
              </Typography>
            </Paper>
          ))}
          
          {/* Кнопка "Показать больше", если комментариев больше чем commentsPerPage */}
          {comments.length > commentsPerPage && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowAllComments(!showAllComments)}
                sx={{ 
                  minWidth: 200,
                  borderColor: MAIN_COLOR,
                  color: MAIN_COLOR,
                  '&:hover': {
                    borderColor: SECONDARY_COLOR,
                    backgroundColor: 'rgba(52, 152, 219, 0.08)'
                  }
                }}
              >
                {showAllComments ? 'Скрыть' : `Показать все (${comments.length})`}
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            textAlign: 'center',
            bgcolor: '#f5f5f5',
            borderRadius: 2
          }}
        >
          <Typography color="text.secondary">
            Пока нет комментариев. Будьте первым, кто оставит отзыв!
          </Typography>
        </Paper>
      )}

      {/* Диалоговое окно авторизации */}
      <Dialog
        open={authDialogOpen}
        onClose={handleCloseAuthDialog}
        aria-labelledby="auth-dialog-title"
        aria-describedby="auth-dialog-description"
      >
        <DialogTitle id="auth-dialog-title" sx={{ color: MAIN_COLOR }}>
          {"Требуется авторизация"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="auth-dialog-description">
            Для сохранения мест и добавления комментариев необходимо войти в систему. Хотите перейти на страницу входа?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAuthDialog} color="primary">
            Отмена
          </Button>
          <Button 
            onClick={handleGoToLogin} 
            variant="contained" 
            sx={{ 
              bgcolor: MAIN_COLOR,
              '&:hover': {
                bgcolor: '#2980b9',
              }
            }}
            autoFocus
          >
            Войти
          </Button>
        </DialogActions>
      </Dialog>

      {/* Снэкбар для уведомлений */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1500,
          position: 'fixed'
        }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          elevation={6}
          sx={{ 
            width: '100%',
            boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.2)',
            '& .MuiAlert-message': {
              fontSize: '1rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ 
        mt: 5, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        gap: 2
      }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            href={details.hotels} 
            target="_blank"
            rel="noopener"
            sx={{ 
              fontSize: '1.1em',
              padding: '6px 20px'
            }}
          >
            🏨 Отели и гостинницы
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            href={details.flights} 
            target="_blank"
            rel="noopener"
            sx={{ 
              fontSize: '1.1em',
              padding: '6px 20px'
            }}
          >
            ✈️ Авиабилеты
          </Button>
        </Box>
        <Button 
          variant="outlined"
          color={isSaved ? "success" : "primary"}
          onClick={handleSaveTrip}
          disabled={isSaved}
          sx={{ 
            fontSize: '1.1em',
            padding: '6px 20px'
          }}
        >
          {isSaved ? "💚 Место сохранено" : "❤️ Сохранить место"}
        </Button>
      </Box>
    </Container>
  );
};

export default TravelDetails;