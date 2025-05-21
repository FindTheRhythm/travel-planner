// frontend/src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Grid, Paper } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import InputAdornment from '@mui/material/InputAdornment';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirm) {
      alert('Пароли не совпадают.');
      return;
    }
    fetch('http://localhost:5000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    .then(async res => {
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || 'Ошибка регистрации');
        throw new Error('Ошибка регистрации');
      }
      return res.json();
    })
    .then(data => {
      alert('Регистрация успешна. Пожалуйста, войдите в систему.');
      navigate('/login');
    })
    .catch(err => console.error(err));
  };

  return (
    <Container maxWidth="lg">
      <Grid 
        container 
        spacing={0} 
        direction="column" 
        alignItems="center" 
        justifyContent="center"
        sx={{ minHeight: '80vh' }}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Paper 
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              borderRadius: 2
            }}
          >
            <Box 
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                mb: 2
              }}
            >
              <PersonAddIcon fontSize="large" />
            </Box>

            <Typography 
              variant="h4" 
              component="h1"
              align="center" 
              gutterBottom
              sx={{
                fontSize: {
                  xs: '1.5rem',
                  sm: '1.8rem',
                  md: '2rem'
                },
                fontWeight: 600,
                mb: 3
              }}
            >
              Регистрация
            </Typography>

            <Box 
              component="form" 
              onSubmit={handleRegister}
              noValidate 
              sx={{ width: '100%' }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    label="Email" 
                    type="email"
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    fullWidth 
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    label="Имя пользователя" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    fullWidth 
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Пароль" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    fullWidth 
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    label="Подтверждение пароля" 
                    type="password" 
                    value={confirm} 
                    onChange={e => setConfirm(e.target.value)} 
                    fullWidth 
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Button 
                type="submit"
                variant="contained" 
                color="primary" 
                fullWidth
                size="large"
                sx={{ mt: 3, mb: 2 }}
              >
                Зарегистрироваться
              </Button>

              <Typography 
                align="center" 
                sx={{ 
                  fontSize: '1.1rem',
                  color: 'text.secondary'
                }}
              >
                Уже есть аккаунт?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Войти
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Register;
