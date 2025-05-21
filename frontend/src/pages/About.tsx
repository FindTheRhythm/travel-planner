// frontend/src/pages/About.tsx
import React from 'react';
import { Container, Typography, Box, Paper, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import InfoIcon from '@mui/icons-material/Info';
import SchoolIcon from '@mui/icons-material/School';

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
          color: 'primary.main'
        }}
      >
        О проекте
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          width: '100%'
        }}
      >
        <Paper
          elevation={2}
          sx={{
            flex: '1 1 300px',
            maxWidth: '400px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon color="primary" />
            <Typography variant="h6" component="h2">
              О приложении
            </Typography>
          </Box>
          <Typography variant="body1">
            Это приложение для планирования путешествий, разработанное с использованием современных технологий:
          </Typography>
          <Box
            component="ul"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              pl: 3,
              '& li': {
                color: 'text.secondary'
              }
            }}
          >
            <li>React и TypeScript</li>
            <li>Material UI для дизайна</li>
            <li>Node.js и Express для бэкенда</li>
            <li>PostgreSQL для базы данных</li>
          </Box>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            flex: '1 1 300px',
            maxWidth: '400px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SchoolIcon color="primary" />
            <Typography variant="h6" component="h2">
              Об авторе
            </Typography>
          </Box>
          <Typography variant="body1">
            Проект разработан студентом 2 курса университета РТУ МИРЭА.
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
            <GitHubIcon />
            <Link 
              href="https://github.com/FindTheRhythm" 
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                color: 'primary.main',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              Данила Шурупов
            </Link>
          </Box>
        </Paper>

        <Paper
          elevation={2}
          sx={{
            flex: '1 1 300px',
            maxWidth: '400px',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            borderRadius: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon color="primary" />
            <Typography variant="h6" component="h2">
              Возможности
            </Typography>
          </Box>
          <Typography variant="body1">
            С помощью этого приложения вы можете:
          </Typography>
          <Box
            component="ul"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              pl: 3,
              '& li': {
                color: 'text.secondary'
              }
            }}
          >
            <li>Искать интересные места для посещения</li>
            <li>Сохранять понравившиеся туры</li>
            <li>Планировать свои путешествия</li>
            <li>Делиться опытом с другими путешественниками</li>
          </Box>
        </Paper>
      </Box>
    </Box>
  </Container>
);

export default About;
