import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import TagChip from '../components/TagChip';

// Константы для цветов в соответствии с NavBar
const MAIN_COLOR = '#2c3e50';


interface Travel {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

interface ProfileProps {
  user: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
  onUpdateUser: (userData: any) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const API_BASE_URL = 'http://localhost:5000'; // Выносим базовый URL в константу

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState<string>(
    user.avatar ? `${API_BASE_URL}/uploads/avatars/${user.avatar}` : ''
  );
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info' | 'warning', text: string } | null>(null);
  const [savedTravels, setSavedTravels] = useState<Travel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSavedTravels();
  }, []);

  const fetchSavedTravels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/travels/user/${user.id}`, {
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки путешествий');
      }
      const data = await response.json();
      setSavedTravels(data);
    } catch (error) {
      console.error('Error fetching travels:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error 
          ? error.message 
          : 'Ошибка при загрузке сохраненных путешествий'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для установки сообщения с предварительной очисткой предыдущего
  const showMessage = (type: 'success' | 'error' | 'info' | 'warning', text: string) => {
    // Сначала очищаем предыдущее сообщение
    setMessage(null);
    
    // Затем через небольшую задержку устанавливаем новое
    setTimeout(() => {
      setMessage({ type, text });
    }, 100);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Проверяем размер файла (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Размер файла не должен превышать 5MB');
      return;
    }

    // Проверяем тип файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Поддерживаются только форматы JPG, PNG, GIF и WebP');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', user.id.toString());

    try {
      const response = await fetch(`${API_BASE_URL}/updateAvatar`, {
        method: 'POST',
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Ошибка загрузки аватара');
      }

      const result = await response.json();
      setAvatar(`${API_BASE_URL}/uploads/avatars/${result.avatar}`);
      showMessage('success', 'Аватар успешно обновлен');

      // Обновляем данные пользователя в родительском компоненте
      onUpdateUser({
        ...user,
        avatar: result.avatar
      });
      
      // Обновляем страницу, чтобы все элементы интерфейса корректно отобразились
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showMessage('error', error instanceof Error 
        ? error.message 
        : 'Ошибка при загрузке аватара');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Проверка, были ли внесены изменения
    if (userData.username === user.username && 
        userData.email === user.email && 
        !userData.currentPassword && 
        !userData.newPassword && 
        !userData.confirmPassword) {
      showMessage('info', 'Нет изменений для сохранения');
      return;
    }
    
    // Базовая валидация
    if (!userData.username.trim()) {
      showMessage('error', 'Имя пользователя не может быть пустым');
      return;
    }
    if (!userData.email.trim()) {
      showMessage('error', 'Email не может быть пустым');
      return;
    }
    
    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      showMessage('error', 'Введите корректный email');
      return;
    }
    
    // Проверка паролей только если пользователь пытается их изменить
    if (userData.newPassword || userData.currentPassword) {
      if (!userData.currentPassword) {
        showMessage('error', 'Введите текущий пароль');
        return;
      }
      if (userData.newPassword && userData.newPassword.length < 6) {
        showMessage('error', 'Новый пароль должен быть не менее 6 символов');
        return;
      }
      if (userData.newPassword !== userData.confirmPassword) {
        showMessage('error', 'Пароли не совпадают');
        return;
      }
    }

    try {
      // Если пользователь ввел текущий пароль, проверяем его перед обновлением профиля
      if (userData.currentPassword) {
        try {
          const verifyPasswordResponse = await fetch(`${API_BASE_URL}/verifyPassword`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              userId: user.id,
              password: userData.currentPassword
            })
          });

          if (!verifyPasswordResponse.ok) {
            // Если сервер вернул ошибку 401 - неверный пароль
            if (verifyPasswordResponse.status === 401) {
              showMessage('error', 'Неверный текущий пароль');
              return;
            } 
            // Другие ошибки сервера
            const errorData = await verifyPasswordResponse.json().catch(() => null);
            throw new Error(
              errorData?.message || 
              `Ошибка проверки пароля: ${verifyPasswordResponse.status} ${verifyPasswordResponse.statusText}`
            );
          }
        } catch (error) {
          // Если эндпоинт не существует или другая ошибка сети, продолжаем без проверки
          console.warn('Не удалось проверить пароль, продолжаем без проверки:', error);
          // Не показываем ошибку пользователю, так как это может быть связано с отсутствием эндпоинта
        }
      }

      const response = await fetch(`${API_BASE_URL}/updateProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          userId: user.id,
          username: userData.username,
          email: userData.email,
          ...(userData.currentPassword && {
            currentPassword: userData.currentPassword,
            newPassword: userData.newPassword
          })
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || 
          `Ошибка сервера: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Обновляем данные пользователя
      onUpdateUser({
        ...user,
        username: userData.username,
        email: userData.email
      });

      // Сбрасываем поля пароля
      setUserData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setIsEditing(false);
      showMessage('success', 'Профиль успешно обновлен');
      
      // Обновляем страницу для актуализации всех элементов интерфейса
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Произошла ошибка при обновлении профиля';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      showMessage('error', errorMessage);
    }
  };

  const handleDeleteAccount = async () => {
    // Открываем диалог подтверждения вместо window.confirm
    setConfirmDeleteOpen(true);
  };
  
  const confirmDelete = async () => {
    // Закрываем диалог
    setConfirmDeleteOpen(false);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/delete-account/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      if (response.ok) {
        // Очищаем все данные пользователя
        localStorage.clear();
        sessionStorage.clear();
        
        // Показываем сообщение об успехе
        showMessage('success', 'Аккаунт успешно удален');

        // Делаем небольшую задержку, чтобы пользователь увидел сообщение, затем перенаправляем
        // Используем прямой редирект вместо React Router для полной перезагрузки страницы
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Ошибка удаления аккаунта' }));
        throw new Error(errorData.error || 'Ошибка удаления аккаунта');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      showMessage('error', error instanceof Error 
        ? error.message 
        : 'Ошибка при удалении аккаунта');
    }
  };

  const handleDeleteTravel = async (travelId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем переход на страницу деталей
    try {
      const response = await fetch(`${API_BASE_URL}/travels/user-tours/${user.id}/${travelId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка удаления тура');
      }

      // Обновляем состояние, удаляя тур из списка
      setSavedTravels(prev => prev.filter(travel => travel.id !== travelId));
      
      showMessage('success', 'Тур успешно удален из сохраненных');
    } catch (error) {
      console.error('Error deleting travel:', error);
      showMessage('error', error instanceof Error ? error.message : 'Ошибка при удалении тура');
    }
  };

  const handleTagClick = (tag: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем переход на страницу тура
    navigate(`/travels/explore?tag=${encodeURIComponent(tag)}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Левая колонка с информацией профиля */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 3, 
            display: 'flex',
            flexDirection: 'column',
            height: 'fit-content',
            minHeight: '350px',
            borderTop: `3px solid ${MAIN_COLOR}`,
            borderRadius: 2
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={avatar}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mb: 2,
                    cursor: 'pointer',
                    border: `3px solid ${MAIN_COLOR}`,
                    '&:hover': {
                      opacity: 0.9
                    }
                  }}
                  onClick={handleAvatarClick}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: -8,
                    backgroundColor: MAIN_COLOR,
                    '&:hover': { backgroundColor: '#2980b9' }
                  }}
                  onClick={handleAvatarClick}
                >
                  <PhotoCameraIcon sx={{ color: 'white' }} />
                </IconButton>
              </Box>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <Typography variant="h5" gutterBottom sx={{ color: MAIN_COLOR }}>
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Chip 
                  icon={<LocationOnIcon />} 
                  label={`${savedTravels.length} мест`}
                  sx={{ 
                    bgcolor: 'rgba(52, 152, 219, 0.1)',
                    color: MAIN_COLOR,
                    '& .MuiChip-icon': {
                      color: MAIN_COLOR
                    }
                  }}
                />
                <Chip 
                  icon={<FavoriteIcon />} 
                  label="Путешественник" 
                  sx={{ 
                    bgcolor: MAIN_COLOR,
                    color: 'white',
                    '& .MuiChip-icon': {
                      color: 'white'
                    }
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Правая колонка с табами */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            width: '100%',
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: MAIN_COLOR
                },
                '& .MuiTab-root': {
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: MAIN_COLOR
                  }
                }
              }}
            >
              <Tab 
                icon={<FavoriteIcon />} 
                label="Сохраненные места"
                sx={{ 
                  '&.Mui-selected': {
                    color: MAIN_COLOR
                  }
                }}
              />
              <Tab 
                icon={<SettingsIcon />} 
                label="Настройки"
                sx={{ 
                  '&.Mui-selected': {
                    color: MAIN_COLOR
                  }
                }}
              />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress sx={{ color: MAIN_COLOR }} />
                </Box>
              ) : savedTravels.length > 0 ? (
                <Grid container spacing={2} sx={{ px: 2, py: 1 }}>
                  {savedTravels.map((travel) => (
                    <Grid item xs={12} sm={6} key={travel.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          borderRadius: 2,
                          transition: 'all 0.2s ease-in-out',
                          mx: { xs: 0.5, sm: 1 },
                          '&:hover': {
                            boxShadow: 3,
                            backgroundColor: 'rgba(44, 62, 80, 0.02)'
                          }
                        }}
                        onClick={() => navigate(`/travels/${travel.id}`)}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <img
                            src={travel.image}
                            alt={travel.title}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover'
                            }}
                          />
                          <IconButton
                            sx={{
                              position: 'absolute',
                              right: 8,
                              top: 8,
                              color: 'white',
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              '&:hover': {
                                backgroundColor: 'rgba(244, 67, 54, 0.8)',
                                transform: 'scale(1.1)',
                                transition: 'all 0.2s ease-in-out'
                              },
                            }}
                            onClick={(e) => handleDeleteTravel(travel.id, e)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <CardContent>
                          <Typography variant="h6" gutterBottom sx={{ color: MAIN_COLOR }}>
                            {travel.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {travel.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
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
              ) : (
                <Box 
                  sx={{
                    p: 4,
                    mt: 2,
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ color: MAIN_COLOR }}>
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
                        gap: 1,
                        bgcolor: MAIN_COLOR,
                        '&:hover': {
                          bgcolor: '#2980b9'
                        }
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
                        gap: 1,
                        borderColor: MAIN_COLOR,
                        color: MAIN_COLOR,
                        '&:hover': {
                          borderColor: '#2980b9',
                          bgcolor: 'rgba(52, 152, 219, 0.08)'
                        }
                      }}
                    >
                      🔍 Найти самостоятельно
                    </Button>
                  </Box>
                </Box>
              )}
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Имя пользователя"
                  name="username"
                  value={userData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: MAIN_COLOR
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: MAIN_COLOR
                    }
                  }}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: MAIN_COLOR
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: MAIN_COLOR
                    }
                  }}
                />
                {isEditing && (
                  <>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Изменение пароля
                      </Typography>
                    </Divider>
                    <TextField
                      label="Текущий пароль"
                      name="currentPassword"
                      type="password"
                      value={userData.currentPassword}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: MAIN_COLOR
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: MAIN_COLOR
                        }
                      }}
                    />
                    <TextField
                      label="Новый пароль"
                      name="newPassword"
                      type="password"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: MAIN_COLOR
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: MAIN_COLOR
                        }
                      }}
                    />
                    <TextField
                      label="Подтвердите новый пароль"
                      name="confirmPassword"
                      type="password"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: MAIN_COLOR
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: MAIN_COLOR
                        }
                      }}
                    />
                  </>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(!isEditing)}
                    startIcon={<EditIcon />}
                    sx={{
                      borderColor: MAIN_COLOR,
                      color: MAIN_COLOR,
                      '&:hover': {
                        borderColor: '#2980b9',
                        bgcolor: 'rgba(52, 152, 219, 0.08)'
                      }
                    }}
                  >
                    {isEditing ? 'Отменить' : 'Редактировать'}
                  </Button>
                  {isEditing && (
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        bgcolor: MAIN_COLOR,
                        '&:hover': {
                          bgcolor: '#2980b9'
                        }
                      }}
                    >
                      Сохранить изменения
                    </Button>
                  )}
                </Box>

                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="error">
                    Опасная зона
                  </Typography>
                </Divider>

                <Box sx={{ 
                  p: 2, 
                  border: '1px solid',
                  borderColor: 'error.main',
                  borderRadius: 1
                }}>
                  <Typography variant="subtitle1" color="error" gutterBottom>
                    Удаление аккаунта
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Это действие необратимо. Все ваши данные будут удалены.
                  </Typography>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleDeleteAccount}
                  >
                    Удалить аккаунт
                  </Button>
                </Box>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Диалог подтверждения удаления аккаунта */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ color: 'error.main' }}>
          Подтверждение удаления
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо. 
            Все ваши данные будут полностью удалены из системы.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} sx={{ color: MAIN_COLOR }}>
            Отмена
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
            Удалить аккаунт
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1500,
          position: 'fixed'
        }}
      >
        <Alert
          onClose={() => setMessage(null)}
          severity={message?.type}
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
          {message?.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 