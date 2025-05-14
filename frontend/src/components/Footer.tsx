import React from 'react';
import { AppBar, Container, Grid, Typography, Link, IconButton, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChatIcon from '@mui/icons-material/Chat';

const Footer: React.FC = () => {
  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: '#12242a',
        py: 1,
        top: 'auto',
        bottom: 0
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
              Контакты
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" sx={{ color: '#fff' }} />
                <Link 
                  href="mailto:info@travel-planner.ru" 
                  sx={{ 
                    color: '#fff',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  shurupov.d.a@yandex.ru
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" sx={{ color: '#fff' }} />
                <Typography variant="body2" sx={{ color: '#fff' }}>
                 Не скажу - стесняюсь
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
              Мессенджеры
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton 
                href="https://t.me/Find_The_Rhythm" 
                target="_blank"
                sx={{ 
                  color: '#fff',
                  p: 1,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <TelegramIcon />
              </IconButton>
              <IconButton 
                href="https://github.com/FindTheRhythm" 
                target="_blank"
                sx={{ 
                  color: '#fff',
                  p: 1,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton 
                href="https://steamcommunity.com/profiles/76561198885861670/" 
                target="_blank"
                sx={{ 
                  color: '#fff',
                  p: 1,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <SportsEsportsIcon />
              </IconButton>
              <IconButton 
                href="https://discord.gg/8q3pJ9TX" 
                target="_blank"
                sx={{ 
                  color: '#fff',
                  p: 1,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'scale(1.1)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <ChatIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom sx={{ color: '#fff', mb: 2 }}>
              Режим работы
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                Пн-Пт: 9:00 - 20:00
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                Сб: 10:00 - 18:00
              </Typography>
              <Typography variant="body2" sx={{ color: '#fff' }}>
                Вс: выходной
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ 
            mt: 4, 
            pt: 3,
            color: '#fff',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          © {new Date().getFullYear()} Travel Planner. Все права защищены.
        </Typography>
      </Container>
    </AppBar>
  );
};

export default Footer; 