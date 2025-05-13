// frontend/src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

interface LoginProps {
  setUser: (user: { id: number; username: string; email: string; avatar?: string } | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
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
    <Container>
      <Box 
        sx={{ 
          maxWidth: '400px',
          margin: '0 auto',
          pt: 4
        }}
      >
        <Typography 
          variant="h4" 
          align="center" 
          gutterBottom
        >
          Вход в систему
        </Typography>
        <form noValidate autoComplete="off">
          <TextField 
            label="Email" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            fullWidth 
            margin="normal"
            required
          />
          <TextField 
            label="Пароль" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            fullWidth 
            margin="normal"
            required
          />
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleLogin}
              fullWidth
              size="large"
            >
              Войти
            </Button>
            <Typography 
              align="center" 
              sx={{ 
                fontSize: '1.1rem',
                mt: 1
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
        </form>
      </Box>
    </Container>
  );
};

export default Login;
