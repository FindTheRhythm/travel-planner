// frontend/src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
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
          Регистрация
        </Typography>
        <form noValidate autoComplete="off">
          <TextField 
            label="Email" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            fullWidth 
            margin="normal" 
          />
          <TextField 
            label="Имя пользователя" 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            fullWidth 
            margin="normal" 
          />
          <TextField 
            label="Пароль" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            fullWidth 
            margin="normal" 
          />
          <TextField 
            label="Подтверждение пароля" 
            type="password" 
            value={confirm} 
            onChange={e => setConfirm(e.target.value)} 
            fullWidth 
            margin="normal" 
          />
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleRegister}
              fullWidth
              size="large"
            >
              Зарегистрироваться
            </Button>
            <Typography 
              align="center" 
              sx={{ 
                fontSize: '1.1rem',
                mt: 1
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
        </form>
      </Box>
    </Container>
  );
};

export default Register;
