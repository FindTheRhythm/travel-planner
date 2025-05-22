// frontend/src/pages/Register.tsx
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import KeyIcon from '@mui/icons-material/Key';
import InputAdornment from '@mui/material/InputAdornment';

// Константы для цветов в соответствии с NavBar
const MAIN_COLOR = '#2c3e50';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirm) {
      setMessage({ type: 'error', text: 'Пароли не совпадают.' });
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
        setMessage({ type: 'error', text: errData.error || 'Ошибка регистрации' });
        throw new Error('Ошибка регистрации');
      }
      return res.json();
    })
    .then(data => {
      setMessage({ type: 'success', text: 'Регистрация успешна. Пожалуйста, войдите в систему.' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
                mb: 3,
                color: MAIN_COLOR
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
                    label="Имя пользователя" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    fullWidth 
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: MAIN_COLOR }} />
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
                    color: MAIN_COLOR,
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

export default Register;
