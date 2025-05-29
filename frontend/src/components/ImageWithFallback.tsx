import React, { useState } from 'react';
import { Box } from '@mui/material';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  containerStyle?: React.CSSProperties;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc = '/images/notfound.jpeg',
  alt,
  containerStyle,
  style,
  ...props
}) => {
  const [error, setError] = useState(false);

  const handleError = () => {
    if (!error) {
      setError(true);
    }
  };

  return (
    <Box component="div" style={containerStyle}>
      <img
        src={error ? fallbackSrc : src}
        alt={alt}
        onError={handleError}
        style={{
          ...style,
          objectFit: 'cover',
        }}
        {...props}
      />
    </Box>
  );
};

export default ImageWithFallback; 