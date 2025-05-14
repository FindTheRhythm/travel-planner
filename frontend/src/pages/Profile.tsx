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
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

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
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [savedTravels, setSavedTravels] = useState<Travel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
        throw new Error(errorData?.message || 'Ошибка загрузки аватара');
      }

      const result = await response.json();
      setAvatar(`${API_BASE_URL}/uploads/avatars/${result.avatar}`);
      setMessage({ type: 'success', text: 'Аватар успешно обновлен' });

      // Обновляем данные пользователя в родительском компоненте
      onUpdateUser({
        ...user,
        avatar: result.avatar
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error 
          ? error.message 
          : 'Ошибка при загрузке аватара'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Базовая валидация
    if (!userData.username.trim()) {
      setMessage({ type: 'error', text: 'Имя пользователя не может быть пустым' });
      return;
    }

    if (!userData.email.trim()) {
      setMessage({ type: 'error', text: 'Email не может быть пустым' });
      return;
    }

    // Проверка email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      setMessage({ type: 'error', text: 'Введите корректный email' });
      return;
    }

    // Проверка паролей только если пользователь пытается их изменить
    if (userData.newPassword || userData.currentPassword) {
      if (!userData.currentPassword) {
        setMessage({ type: 'error', text: 'Введите текущий пароль' });
        return;
      }
      if (userData.newPassword && userData.newPassword.length < 6) {
        setMessage({ type: 'error', text: 'Новый пароль должен быть не менее 6 символов' });
        return;
      }
      if (userData.newPassword !== userData.confirmPassword) {
        setMessage({ type: 'error', text: 'Пароли не совпадают' });
        return;
      }
    }

    try {
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
      setMessage({ type: 'success', text: 'Профиль успешно обновлен' });
    } catch (error) {
      console.error('Error updating profile:', error);
      
      let errorMessage = 'Произошла ошибка при обновлении профиля';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setMessage({ 
        type: 'error', 
        text: errorMessage
      });
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие нельзя отменить.');
    if (!confirmed) return;

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
        setMessage({
          type: 'success',
          text: 'Аккаунт успешно удален'
        });

        // Делаем небольшую задержку, чтобы пользователь увидел сообщение
        setTimeout(() => {
          // Перенаправляем на страницу входа
          navigate('/login', { replace: true });
        }, 1500);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Ошибка удаления аккаунта' }));
        throw new Error(errorData.error || 'Ошибка удаления аккаунта');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error 
          ? error.message 
          : 'Ошибка при удалении аккаунта'
      });
    }
  };

  const handleRemoveTravel = async (travelId: number, event: React.MouseEvent) => {
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
        throw new Error(errorData.error || 'Ошибка удаления путешествия');
      }

      setSavedTravels(prev => prev.filter(travel => travel.id !== travelId));
      setMessage({ type: 'success', text: 'Путешествие удалено из сохраненных' });
    } catch (error) {
      console.error('Error removing travel:', error);
      setMessage({ 
        type: 'error', 
        text: error instanceof Error 
          ? error.message 
          : 'Ошибка при удалении путешествия'
      });
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
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={avatar}
                  sx={{ 
                    width: 150, 
                    height: 150, 
                    mb: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  onClick={handleAvatarClick}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: -8,
                    backgroundColor: 'primary.main',
                    '&:hover': { backgroundColor: 'primary.dark' }
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
              <Typography variant="h5" gutterBottom>
                {user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                <Chip icon={<LocationOnIcon />} label={`${savedTravels.length} мест`} />
                <Chip icon={<FavoriteIcon />} label="Путешественник" color="primary" />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Правая колонка с табами */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => setActiveTab(newValue)}
              variant="fullWidth"
            >
              <Tab icon={<FavoriteIcon />} label="Сохраненные места" />
              <Tab icon={<SettingsIcon />} label="Настройки" />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : savedTravels.length > 0 ? (
                <Grid container spacing={2}>
                  {savedTravels.map((travel) => (
                    <Grid item xs={12} sm={6} key={travel.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            boxShadow: 6,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s ease-in-out'
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
                              top: 8,
                              right: 8,
                              backgroundColor: 'rgba(255, 255, 255, 0.9)',
                              '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 1)',
                                color: 'error.main'
                              }
                            }}
                            onClick={(e) => handleRemoveTravel(travel.id, e)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {travel.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {travel.description}
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
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
              ) : (
                <Box 
                  sx={{
                    p: 4,
                    mt: 2,
                    textAlign: 'center'
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
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  fullWidth
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
                    />
                    <TextField
                      label="Новый пароль"
                      name="newPassword"
                      type="password"
                      value={userData.newPassword}
                      onChange={handleInputChange}
                      fullWidth
                    />
                    <TextField
                      label="Подтвердите новый пароль"
                      name="confirmPassword"
                      type="password"
                      value={userData.confirmPassword}
                      onChange={handleInputChange}
                      fullWidth
                    />
                  </>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => setIsEditing(!isEditing)}
                    startIcon={<EditIcon />}
                  >
                    {isEditing ? 'Отменить' : 'Редактировать'}
                  </Button>
                  {isEditing && (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
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

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage(null)}
      >
        <Alert
          onClose={() => setMessage(null)}
          severity={message?.type}
          sx={{ width: '100%' }}
        >
          {message?.text}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 