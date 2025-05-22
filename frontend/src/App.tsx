// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import TourExplorer from './pages/TourExplorer';
import TravelDetails from './pages/TravelDetails';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import { Box, CircularProgress } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import { AnimatePresence } from 'framer-motion';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

// Создаем тему с кастомными шрифтами и цветами
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50', // Основной цвет из NavBar
      light: '#3498db', // Светлый оттенок
      dark: '#1a252f', // Темный оттенок
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e74c3c', // Акцентный цвет
      light: '#ff6b6b',
      dark: '#c0392b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#ffffff',
      paper: '#f9f9f9',
    },
    text: {
      primary: '#333333',
      secondary: '#7f8c8d',
    },
    success: {
      main: '#27ae60',
    },
    warning: {
      main: '#f39c12',
    },
  },
  typography: {
    fontFamily: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
    },
    h2: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
    },
    h3: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
    },
    h5: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
    },
    h6: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 700,
    },
    subtitle1: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
    },
    subtitle2: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
    },
    body1: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 400,
    },
    body2: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 400,
    },
    button: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 400,
    },
    overline: {
      fontFamily: "'Montserrat', sans-serif",
      fontWeight: 400,
      letterSpacing: 1,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        html {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        body {
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: 'Montserrat', sans-serif;
          margin-top: 0;
          font-weight: 700;
          line-height: 1.3;
        }
        p {
          margin-bottom: 1rem;
        }
        a {
          text-decoration: none;
          transition: color 0.3s ease;
        }
        a:hover {
          text-decoration: none;
        }
        .text-title {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
        }
        .text-subtitle {
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
        }
        .text-body {
          font-family: 'Montserrat', sans-serif;
          font-weight: 400;
        }
        .text-emphasis {
          font-family: 'Montserrat', sans-serif;
          font-weight: 500;
        }
      `,
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          borderRadius: '12px 12px 0 0',
        },
      },
    },
  },
});

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // При монтировании проверяем localStorage на сохранённый user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Выход пользователя: удаляем из localStorage и обновляем страницу
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    
    // Проверяем текущий путь и решаем, перенаправлять ли на другую страницу
    const currentPath = window.location.pathname;
    
    // Если пользователь находится на странице профиля или других защищенных страницах,
    // перенаправляем на страницу входа, иначе просто обновляем текущую страницу
    if (currentPath === '/profile' || currentPath === '/travels') {
      window.location.href = '/login';
    } else {
      window.location.reload();
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ScrollToTop />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          minHeight: '100vh',
          margin: 0,
          padding: 0
        }}>
          <NavBar user={user} onLogout={handleLogout} />
          <Box sx={{ 
            flexGrow: 1,
            mt: '64px',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            position: 'relative'
          }}>
            <AnimatePresence mode="wait">
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login setUser={setUser} />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/profile" 
                    element={
                      isLoading ? (
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center',
                          minHeight: '60vh' 
                        }}>
                          <CircularProgress />
                        </Box>
                      ) : localStorage.getItem('user') ? (
                        <Profile user={JSON.parse(localStorage.getItem('user')!)} onUpdateUser={handleUpdateUser} />
                      ) : (
                        <Navigate to="/login" />
                      )
                    } 
                  />
                  <Route path="/travels" element={<Navigate to="/profile" />} />
                  <Route path="/travels/explore" element={<TourExplorer />} />
                  <Route path="/travels/:id" element={<TravelDetails />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
              </PageTransition>
            </AnimatePresence>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
