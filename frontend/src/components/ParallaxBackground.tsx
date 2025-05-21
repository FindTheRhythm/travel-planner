import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Box } from '@mui/material';

interface ParallaxBackgroundProps {
  imageUrl: string;
  height?: string | number;
  children?: React.ReactNode;
  overlayColor?: string;
  overlayOpacity?: number;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({
  imageUrl,
  height = '50vh',
  children,
  overlayColor = 'rgba(0, 0, 0, 0.4)',
  overlayOpacity = 0.4,
}) => {
  const [elementTop, setElementTop] = useState(0);
  const { scrollY } = useScroll();
  
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      setElementTop(ref.current.offsetTop);
    }
  }, []);

  const y = useTransform(
    scrollY,
    [elementTop - 500, elementTop + 500],
    [0, -150],
    { clamp: false }
  );

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        height,
        overflow: 'hidden',
        width: '100%',
      }}
    >
      <motion.div
        style={{
          y,
          position: 'absolute',
          height: `calc(${typeof height === 'number' ? `${height}px` : height} + 150px)`,
          width: '100%',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            backgroundImage: `url(${imageUrl})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
          }}
        />
      </motion.div>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: overlayColor,
          opacity: overlayOpacity,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      {children && (
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            zIndex: 1,
          }}
        >
          {children}
        </Box>
      )}
    </Box>
  );
};

export default ParallaxBackground; 