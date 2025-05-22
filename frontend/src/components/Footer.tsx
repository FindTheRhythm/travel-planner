import React from 'react';
import { AppBar, Container, Grid, Typography, Link, IconButton, Box } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import TelegramIcon from '@mui/icons-material/Telegram';
import GitHubIcon from '@mui/icons-material/GitHub';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ChatIcon from '@mui/icons-material/Chat';

const Footer: React.FC = () => {
  return (
    <Box 
      sx={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'center',
        mt: { xs: 3, sm: 3 }
      }}
    >
      <AppBar 
        component="footer"
        position="static" 
        sx={{ 
          backgroundColor: '#2c3e50',
          py: 1,
          top: 'auto',
          bottom: 0,
          maxWidth: '1600px',
          width: '98%',
          borderRadius: { xs: '12px 12px 0 0', sm: '12px 12px 0 0' },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} component="div" role="contentinfo">
            {/* Контактная информация */}
            <Grid item xs={12} sm={4} component="div">
              <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#fff', mb: 2 }}>
                Контакты
              </Typography>
              <address style={{ fontStyle: 'normal' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EmailIcon fontSize="small" sx={{ color: 'white' }} aria-hidden="true" />
                    <Link 
                      href="mailto:shurupov.d.a@yandex.ru" 
                      sx={{ 
                        color: '#fff',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#3498db'
                        }
                      }}
                    >
                      shurupov.d.a@yandex.ru
                    </Link>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOnIcon fontSize="small" sx={{ color: 'white' }} aria-hidden="true" />
                    <Typography variant="body2" component="p" sx={{ color: '#fff' }}>
                      Не скажу - стесняюсь
                    </Typography>
                  </Box>
                </Box>
              </address>
            </Grid>
            
            {/* Социальные сети */}
            <Grid item xs={12} sm={4} component="div">
              <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#fff', mb: 2 }}>
                Мессенджеры
              </Typography>
              <nav aria-label="Социальные сети">
                <Box 
                  sx={{ display: 'flex', gap: 2 }}
                  component="ul"
                  style={{ listStyle: 'none', padding: 0, margin: 0 }}
                >
                  <li>
                    <IconButton 
                      href="https://t.me/Find_The_Rhythm" 
                      target="_blank"
                      aria-label="Telegram"
                      sx={{ 
                        color: '#fff',
                        p: 1,
                        '&:hover': { 
                          backgroundColor: 'rgba(52, 152, 219, 0.2)',
                          transform: 'scale(1.1)',
                          color: '#3498db'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      <TelegramIcon aria-hidden="true" />
                    </IconButton>
                  </li>
                  <li>
                    <IconButton 
                      href="https://github.com/FindTheRhythm" 
                      target="_blank"
                      aria-label="GitHub"
                      sx={{ 
                        color: '#fff',
                        p: 1,
                        '&:hover': { 
                          backgroundColor: 'rgba(52, 152, 219, 0.2)',
                          transform: 'scale(1.1)',
                          color: '#3498db'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      <GitHubIcon aria-hidden="true" />
                    </IconButton>
                  </li>
                  <li>
                    <IconButton 
                      href="https://steamcommunity.com/profiles/76561198885861670/" 
                      target="_blank"
                      aria-label="Steam"
                      sx={{ 
                        color: '#fff',
                        p: 1,
                        '&:hover': { 
                          backgroundColor: 'rgba(52, 152, 219, 0.2)',
                          transform: 'scale(1.1)',
                          color: '#3498db'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      <SportsEsportsIcon aria-hidden="true" />
                    </IconButton>
                  </li>
                  <li>
                    <IconButton 
                      href="https://discord.gg/8q3pJ9TX" 
                      target="_blank"
                      aria-label="Discord"
                      sx={{ 
                        color: '#fff',
                        p: 1,
                        '&:hover': { 
                          backgroundColor: 'rgba(52, 152, 219, 0.2)',
                          transform: 'scale(1.1)',
                          color: '#3498db'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      <ChatIcon aria-hidden="true" />
                    </IconButton>
                  </li>
                </Box>
              </nav>
            </Grid>

            {/* Время работы */}
            <Grid item xs={12} sm={4} component="div">
              <Typography variant="h6" component="h2" gutterBottom sx={{ color: '#fff', mb: 2 }}>
                Режим работы
              </Typography>
              <Box 
                sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}
                component="ul"
                style={{ listStyle: 'none', padding: 0, margin: 0 }}
              >
                <li>
                  <Typography variant="body2" component="p" sx={{ color: '#fff' }}>
                    <time dateTime="Mo-Fr 09:00-20:00">Пн-Пт: 9:00 - 20:00</time>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" component="p" sx={{ color: '#fff' }}>
                    <time dateTime="Sa 10:00-18:00">Сб: 10:00 - 18:00</time>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" component="p" sx={{ color: '#fff' }}>
                    <time dateTime="Su">Вс: выходной</time>
                  </Typography>
                </li>
              </Box>
            </Grid>
          </Grid>

          <Typography 
            variant="body2" 
            component="p"
            align="center" 
            sx={{ 
              mt: 4, 
              pt: 3,
              color: '#fff',
              borderTop: '1px solid rgba(52, 152, 219, 0.3)'
            }}
          >
            © <time dateTime={new Date().getFullYear().toString()}>{new Date().getFullYear()}</time> Travel Planner. Все права защищены.
          </Typography>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Footer; 