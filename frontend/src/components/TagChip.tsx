import React from 'react';
import { Chip } from '@mui/material';

// Константы для цветов в соответствии с NavBar
const MAIN_COLOR = '#2c3e50';

interface TagChipProps {
  tag: string;
  onClick: (tag: string, event: React.MouseEvent) => void;
  darkMode?: boolean;
  isActive?: boolean;
}

/**
 * Компонент для отображения тегов в единообразном стиле
 * @param tag - Текст тега
 * @param onClick - Функция обработки клика по тегу
 * @param darkMode - Флаг для темного режима оформления (опционально)
 * @param isActive - Флаг выделенного тега (опционально)
 */
const TagChip: React.FC<TagChipProps> = ({ tag, onClick, darkMode = false, isActive = false }) => {
  // Определяем стили на основе флагов darkMode и isActive
  const getBackgroundColor = () => {
    if (isActive) return MAIN_COLOR;
    return darkMode ? 'rgba(255, 255, 255, 0.15)' : 'grey.100';
  };

  const getTextColor = () => {
    if (isActive) return 'white';
    return darkMode ? '#ffffff' : 'text.primary';
  };

  const getHoverBackgroundColor = () => {
    if (isActive) return '#2980b9';
    return darkMode ? 'rgba(255, 255, 255, 0.25)' : 'rgba(52, 152, 219, 0.2)';
  };

  const getHoverTextColor = () => {
    if (isActive) return 'white';
    return darkMode ? '#ffffff' : MAIN_COLOR;
  };

  return (
    <Chip
      key={tag}
      label={tag}
      size="small"
      onClick={(e) => onClick(tag, e)}
      sx={{
        backgroundColor: getBackgroundColor(),
        color: getTextColor(),
        borderRadius: 1.5,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.05)',
          backgroundColor: getHoverBackgroundColor(),
          color: getHoverTextColor(),
        },
        '&:active': {
          transform: 'scale(0.95)',
        }
      }}
    />
  );
};

export default TagChip; 