// frontend/src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import TravelList from './pages/TravelList';
import TourExplorer from './pages/TourExplorer';
import TravelDetails from './pages/TravelDetails';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import { Box } from '@mui/material';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  // При монтировании проверяем localStorage на сохранённый user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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

  return (
    <Router>
      <ScrollToTop />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}>
        <NavBar user={user} onLogout={handleLogout} />
        <Box sx={{ 
          flexGrow: 1,
          mt: '64px', // отступ под навбаром
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          overflow: 'auto'
        }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/travels" element={<TravelList />} />
            <Route path="/travels/explore" element={<TourExplorer />} />
            <Route path="/travels/:id" element={<TravelDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            {user && (
              <Route 
                path="/profile" 
                element={<Profile user={user} onUpdateUser={handleUpdateUser} />} 
              />
            )}
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
