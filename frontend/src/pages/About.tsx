// frontend/src/pages/About.tsx
import React from 'react';
import { Container, Typography, Box, Paper, Link, Divider, Avatar, Grid } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import TelegramIcon from '@mui/icons-material/Telegram';
import FlightIcon from '@mui/icons-material/Flight';
import PlaceIcon from '@mui/icons-material/Place';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import ShareIcon from '@mui/icons-material/Share';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

// Константы для цветов в соответствии с NavBar
const MAIN_COLOR = '#2c3e50';

const About: React.FC = () => (
  <Container maxWidth="lg" sx={{ py: 4 }}>
    <Box
      component="section"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        alignItems: 'center'
      }}
    >
      <Box 
        sx={{ 
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Divider sx={{ 
          position: 'absolute', 
          width: '100%', 
          borderColor: `rgba(52, 152, 219, 0.3)`
        }} />
        
        <Box sx={{ 
          backgroundColor: '#fff',
          px: 3,
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <TravelExploreIcon 
            sx={{ 
              fontSize: { xs: '2rem', sm: '2.5rem' }, 
              color: MAIN_COLOR 
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1"
            sx={{ 
              fontSize: {
                xs: '1.3rem',
                sm: '1.8rem',
                md: '2.2rem',
                lg: '2.4rem'
              },
              textAlign: 'center',
              fontWeight: 600,
              color: MAIN_COLOR
            }}
          >
            О проекте
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                borderTop: `3px solid ${MAIN_COLOR}`
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              pb: 1, 
              borderBottom: `2px solid rgba(52, 152, 219, 0.3)` 
            }}>
              <Avatar sx={{ bgcolor: MAIN_COLOR }}>
                <InfoIcon sx={{ color: '#fff' }} />
              </Avatar>
              <Typography variant="h6" component="h2" sx={{ color: MAIN_COLOR, fontWeight: 600 }}>
                О приложении
              </Typography>
            </Box>
            <Typography variant="body1">
              Веб-приложение для поиска и планирования путешествий, разработанное с использованием:
            </Typography>
            <Box
              component="ul"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                pl: 3,
                '& li': {
                  color: 'text.secondary',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: '-20px',
                    top: '10px',
                    width: '8px',
                    height: '8px',
                    backgroundColor: MAIN_COLOR,
                    borderRadius: '50%'
                  }
                }
              }}
            >
              <li>React + TypeScript для фронтенда</li>
              <li>Node.js + Express для бэкенда</li>
              <li>Дизайн с помощью Material UI и CSS</li>
              <li>Использование API для получения данных о погоде, курсе валют и карт мест</li>
              <li>Упрощенная система хранения данных на основе JSON</li>
              <li>Интеграция с сервисами для получения данных об отелях и авиабилетах</li>


            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                borderTop: `3px solid ${MAIN_COLOR}`
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              pb: 1, 
              borderBottom: `2px solid rgba(52, 152, 219, 0.3)` 
            }}>
              <Avatar sx={{ bgcolor: MAIN_COLOR }}>
                <SchoolIcon sx={{ color: '#fff' }} />
              </Avatar>
              <Typography variant="h6" component="h2" sx={{ color: MAIN_COLOR, fontWeight: 600 }}>
                Об авторе
              </Typography>
            </Box>
            <Typography variant="body1">
              Проект с открытым исходным кодом, демонстрирующий современные подходы к веб-разработке.
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: 2, 
                mt: 'auto',
                justifyContent: 'center',
                pt: 2 
              }}
            >
              <Link 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: MAIN_COLOR,
                  transition: 'all 0.2s',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <GitHubIcon />
                GitHub
              </Link>
              <Link 
                href="https://t.me" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: MAIN_COLOR,
                  transition: 'all 0.2s',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <TelegramIcon />
                Telegram
              </Link>
              <Link 
                href="mailto:contact@example.com" 
                sx={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  color: MAIN_COLOR,
                  transition: 'all 0.2s',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  '&:hover': {
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <EmailIcon />
                Email
              </Link>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={3}
            sx={{
              height: '100%',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              borderRadius: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                borderTop: `3px solid ${MAIN_COLOR}`
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              pb: 1, 
              borderBottom: `2px solid rgba(52, 152, 219, 0.3)` 
            }}>
              <Avatar sx={{ bgcolor: MAIN_COLOR }}>
                <FlightIcon sx={{ color: '#fff' }} />
              </Avatar>
              <Typography variant="h6" component="h2" sx={{ color: MAIN_COLOR, fontWeight: 600 }}>
                Функциональность
              </Typography>
            </Box>
            <Typography variant="body1">
              Основные возможности приложения:
            </Typography>
            <Box
              component="ul"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                pl: 0,
                listStyle: 'none'
              }}
            >
              <Box component="li" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateX(5px)'
                }
              }}>
                <PlaceIcon sx={{ color: MAIN_COLOR }} />
                <Typography>Просмотр популярных туристических мест</Typography>
              </Box>
              <Box component="li" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateX(5px)'
                }
              }}>
                <BookmarkIcon sx={{ color: MAIN_COLOR }} />
                <Typography>Сохранение интересных мест в профиле</Typography>
              </Box>
              <Box component="li" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateX(5px)'
                }
              }}>
                <EditCalendarIcon sx={{ color: MAIN_COLOR }} />
                <Typography>Просмотр погоды и курса валют</Typography>
              </Box>
              <Box component="li" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateX(5px)'
                }
              }}>
                <ShareIcon sx={{ color: MAIN_COLOR }} />
                <Typography>Комментарии и оценки мест</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Divider sx={{ 
        width: '100%', 
        mt: 4, 
        borderColor: `rgba(52, 152, 219, 0.3)`,
        '&::before, &::after': {
          borderColor: `rgba(52, 152, 219, 0.3)`
        }
      }}>
        <Avatar sx={{ bgcolor: MAIN_COLOR, width: 40, height: 40 }}>
          <TravelExploreIcon sx={{ color: '#fff', fontSize: '1.5rem' }} />
        </Avatar>
      </Divider>

    </Box>
  </Container>
);

export default About;
