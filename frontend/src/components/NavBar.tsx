// frontend/src/components/NavBar.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { API_BASE_URL } from '../config';

interface NavBarProps {
  user: {
    id: number;
    username: string;
    email: string;
    avatar?: string;
  } | null;
  onLogout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ user, onLogout }) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleTitleClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.location.reload();
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    onLogout();
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/travels/explore') {
      return location.pathname === '/travels/explore';
    }
    if (path === '/travels') {
      return location.pathname === '/travels';
    }
    return location.pathname === path;
  };

  const NavButton = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      <Button
        color="inherit"
        component={Link}
        to={to}
        sx={{
          height: '100%',
          borderRadius: 0,
          px: 3,
          position: 'relative',
          transition: 'all 0.2s ease-in-out',
          backgroundColor: isActive(to) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
          borderBottom: isActive(to) ? '3px solid #fff' : '3px solid transparent',
          '&:hover': {
            backgroundColor: isActive(to) ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'
          }
        }}
      >
        {children}
      </Button>
    </Box>
  );

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#1565c0',
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '1600px',
        width: '98%',
        borderRadius: { xs: '0 0 8px 8px', sm: '12px' },
        mt: { xs: 0, sm: 1 },
        paddingRight: '0 !important'
      }}
      className="no-shift"
    >
      <Toolbar 
        component="nav"
        aria-label="Основная навигация"
        sx={{ 
          height: { xs: 68, sm: 77 },
          pr: { xs: 1, sm: 0 }
        }}
      >
        <Typography 
          component={Link} 
          to="/" 
          onClick={handleTitleClick}
          variant="h1"
          aria-label="Планировщик Путешествий - На главную"
          sx={{
            color: 'inherit', 
            textDecoration: 'none',
            cursor: 'pointer',
            fontSize: {
              xs: '1.32rem',
              sm: '1.5rem'
            },
            fontWeight: 500,
            zIndex: 1,
            padding: {
              xs: '10px',
              sm: '10px 19px'
            },
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: {
              xs: '240px',
              sm: '360px',
              md: 'none'
            },
            '&:hover': {
              textDecoration: 'none',
              color: 'inherit'
            }
          }}
        >
          Планировщик Путешествий
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{ height: '100%', display: 'flex' }}>
          <NavButton to="/travels/explore">
            <SearchIcon sx={{ fontSize: 24 }} />
          </NavButton>
          <NavButton to="/about">
            <Typography sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}>
              О Проекте
            </Typography>
          </NavButton>
          {user ? (
            <>
              <Box
                sx={{
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  mr: -3
                }}
              >
                <Button
                  onClick={handleMenuOpen}
                  aria-haspopup="true"
                  aria-expanded={Boolean(anchorEl)}
                  aria-controls={Boolean(anchorEl) ? 'user-menu' : undefined}
                  sx={{ 
                    height: '100%',
                    minHeight: { xs: 68, sm: 77 },
                    borderRadius: 0,
                    px: { xs: 1.2, sm: 2.4, md: 3.6 },
                    position: 'relative',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: Boolean(anchorEl) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                    borderBottom: Boolean(anchorEl) ? '3px solid #fff' : '3px solid transparent',
                    color: 'white',
                    display: 'grid',
                    gridTemplateColumns: 'auto auto',
                    alignItems: 'center',
                    justifyContent: 'start',
                    columnGap: '10px',
                    textTransform: 'none',
                    borderTopRightRadius: { xs: 0, sm: '12px' },
                    '&:hover': {
                      backgroundColor: Boolean(anchorEl) ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'
                    }
                  }}
                >
                  {user.avatar ? (
                    <Avatar
                      src={`${API_BASE_URL}/uploads/avatars/${user.avatar}`}
                      alt={`Аватар пользователя ${user.username}`}
                      sx={{
                        width: { xs: 34, sm: 38 },
                        height: { xs: 34, sm: 38 },
                        border: '1px solid white',
                        display: 'flex',
                        alignSelf: 'center'
                      }}
                    />
                  ) : (
                    <PersonIcon 
                      aria-hidden="true"
                      sx={{ 
                        color: 'transparent',
                        stroke: 'white',
                        strokeWidth: 1,
                        fontSize: { xs: 29, sm: 34 },
                        display: 'flex',
                        alignSelf: 'center'
                      }} 
                    />
                  )}
                  <Typography 
                    sx={{ 
                      display: { xs: 'none', sm: 'block' },
                      fontWeight: 500,
                      maxWidth: { sm: '120px', md: '200px' },
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      alignSelf: 'center',
                      textAlign: 'center',
                      pr: { sm: 2.25, md: 3 }
                    }}
                  >
                    {user.username}
                  </Typography>
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                  sx={{
                    '& .MuiPaper-root': {
                      borderRadius: '8px',
                      minWidth: 180,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      mt: 1
                    }
                  }}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  slotProps={{
                    paper: {
                      style: { position: 'fixed' }
                    }
                  }}
                  style={{ position: 'fixed' }}
                  disableScrollLock={true}
                  MenuListProps={{
                    sx: { py: 0.5 }
                  }}
                >
                  <MenuItem 
                    component={Link} 
                    to="/profile"
                  >
                    Личный кабинет
                  </MenuItem>
                  <MenuItem onClick={handleLogoutClick}>
                    Выйти
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Button
                component={Link}
                to="/login"
                sx={{
                  height: '100%',
                  borderRadius: 0,
                  px: 3,
                  position: 'relative',
                  transition: 'all 0.2s ease-in-out',
                  backgroundColor: isActive('/login') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  borderBottom: isActive('/login') ? '3px solid #fff' : '3px solid transparent',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isActive('/login') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <PersonIcon sx={{ fontSize: 28 }} />
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
