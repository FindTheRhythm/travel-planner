import React, { useState, useRef } from 'react';
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
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

interface ProfileProps {
  user: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  };
  onUpdateUser: (userData: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: user.username,
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatar, setAvatar] = useState<string>(user.avatar || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    try {
      const response = await fetch('http://localhost:5000/updateAvatar', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Ошибка загрузки аватара');

      const result = await response.json();
      setAvatar(result.avatarUrl);
      setMessage({ type: 'success', text: 'Аватар успешно обновлен' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при загрузке аватара' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userData.newPassword !== userData.confirmPassword) {
      setMessage({ type: 'error', text: 'Пароли не совпадают' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword
        }),
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Ошибка обновления профиля');

      const result = await response.json();
      onUpdateUser(result);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Профиль успешно обновлен' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при обновлении профиля' });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, position: 'relative' }}>
        <IconButton 
          sx={{ position: 'absolute', top: 16, right: 16 }}
          onClick={() => setIsEditing(!isEditing)}
        >
          <EditIcon />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={avatar}
              sx={{ 
                width: 120, 
                height: 120, 
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
        </Box>

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            {isEditing && (
              <Button 
                type="submit" 
                variant="contained" 
                sx={{ mt: 2 }}
              >
                Сохранить изменения
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {message && (
        <Snackbar 
          open={true} 
          autoHideDuration={6000} 
          onClose={() => setMessage(null)}
        >
          <Alert severity={message.type} onClose={() => setMessage(null)}>
            {message.text}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default Profile; 