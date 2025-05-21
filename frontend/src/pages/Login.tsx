// frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Grid, Paper } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import InputAdornment from '@mui/material/InputAdornment';

interface LoginProps {
  setUser: (user: { id: number; username: string; email: string; avatar?: string } | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    fetch('http://localhost:5000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    .then(async res => {
      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || 'Ошибка входа');
        throw new Error('Ошибка входа');
      }
      return res.json();
    })
    .then(data => {
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/travels');
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
              <LockOutlinedIcon fontSize="large" />
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
              Вход в систему
            </Typography>

            <Box 
              component="form" 
              onSubmit={handleLogin}
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
              </Grid>

              <Button 
                type="submit"
                variant="contained" 
                color="primary" 
                fullWidth
                size="large"
                sx={{ mt: 3, mb: 2 }}
              >
                Войти
              </Button>

              <Typography 
                align="center" 
                sx={{ 
                  fontSize: '1.1rem',
                  color: 'text.secondary'
                }}
              >
                Нет аккаунта?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#1976d2',
                    textDecoration: 'none',
                    fontWeight: 500
                  }}
                >
                  Зарегистрироваться
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Login;
