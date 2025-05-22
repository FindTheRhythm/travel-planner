// frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Snackbar,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import InputAdornment from '@mui/material/InputAdornment';

// Константы для цветов в соответствии с NavBar
const MAIN_COLOR = '#2c3e50';


interface LoginProps {
  setUser: (user: { id: number; username: string; email: string; avatar?: string } | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Пожалуйста, заполните все поля' });
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
        setMessage({ type: 'error', text: errData.error || 'Ошибка входа' });
        throw new Error('Ошибка входа');
      }
      return res.json();
    })
    .then(data => {
      setMessage({ type: 'success', text: 'Вход выполнен успешно!' });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      // Небольшая задержка перед переходом, чтобы пользователь увидел сообщение об успехе
      setTimeout(() => {
        navigate('/travels');
      }, 1500);
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
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: MAIN_COLOR
              }
            }}
          >
            <Box 
              sx={{ 
                bgcolor: MAIN_COLOR,
                color: 'white',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                mb: 2,
                boxShadow: `0 4px 8px rgba(52, 152, 219, 0.3)`
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
                mb: 3,
                color: MAIN_COLOR
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
                          <EmailIcon sx={{ color: MAIN_COLOR }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: MAIN_COLOR
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: MAIN_COLOR
                      }
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
                          <KeyIcon sx={{ color: MAIN_COLOR }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: MAIN_COLOR
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: MAIN_COLOR
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Button 
                type="submit"
                variant="contained" 
                fullWidth
                size="large"
                sx={{ 
                  mt: 3, 
                  mb: 2,
                  bgcolor: MAIN_COLOR,
                  '&:hover': {
                    bgcolor: '#2980b9'
                  },
                  py: 1.2
                }}
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
                    color: MAIN_COLOR,
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

export default Login;
