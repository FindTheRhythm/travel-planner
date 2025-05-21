// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

  // Выход пользователя: удаляем из localStorage
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogin = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  return (
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
  );
}

export default App;
