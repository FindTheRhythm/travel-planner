// frontend/src/components/TravelCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import { useTheme, useMediaQuery } from '@mui/material';

interface Props {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  loading?: boolean;
}

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const TravelCard: React.FC<Props> = ({ id, title, description, image, tags, loading = false }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (loading) {
    return (
      <Card sx={{ height: '100%' }}>
        <Skeleton variant="rectangular" height={isMobile ? 200 : 240} animation="wave" />
        <CardContent>
          <Skeleton variant="text" width="60%" height={32} />
          <Box sx={{ mt: 1 }}>
            <Skeleton variant="text" />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Skeleton variant="rounded" width={60} height={24} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Box>
        </CardContent>
        <CardActions>
          <Skeleton variant="rounded" width="100%" height={36} />
        </CardActions>
      </Card>
    );
  }

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      <Card 
        component={motion.div}
        whileHover={{ y: -8 }}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'box-shadow 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[8],
          },
          cursor: 'pointer',
          backgroundColor: 'background.paper',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
        }}
        onClick={() => navigate(`/travels/${id}`)}
      >
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <motion.div
            variants={imageVariants}
            whileHover="hover"
          >
            <CardMedia
              component="img"
              height={isMobile ? "200" : "240"}
              image={image}
              alt={`Изображение для путешествия "${title}"`}
              sx={{
                objectFit: 'cover',
              }}
            />
          </motion.div>
        </Box>

        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography 
            variant="h5" 
            component="h2"
            sx={{
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              fontWeight: 600,
              lineHeight: 1.3,
              mb: 1
            }}
          >
            {title}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{
              flexGrow: 1,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5
            }}
          >
            {description}
          </Typography>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
            {tags.slice(0, isMobile ? 2 : 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                sx={{
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    transform: 'scale(1.05)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              />
            ))}
            {tags.length > (isMobile ? 2 : 3) && (
              <Chip
                label={`+${tags.length - (isMobile ? 2 : 3)}`}
                size="small"
                sx={{
                  backgroundColor: 'action.hover',
                  fontWeight: 500,
                }}
              />
            )}
          </Box>
        </CardContent>

        <CardActions sx={{ p: { xs: 1, sm: 1.5 } }}>
          <Button 
            size={isMobile ? "small" : "medium"}
            fullWidth
            variant="contained"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/travels/${id}`);
            }}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateX(-100%)',
                transition: 'transform 0.3s ease-in-out',
              },
              '&:hover::after': {
                transform: 'translateX(0)',
              },
            }}
          >
            Подробнее
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default TravelCard;
