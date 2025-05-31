// backend/routes/tips.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Кэш для хранения советов
let tipsCache = null;
let lastCacheUpdate = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах

// Функция для чтения данных из файла
const readTipsFromFile = () => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(__dirname, '../data/tips.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Ошибка чтения tips.json:', err);
        reject(err);
        return;
      }

      try {
        const tips = JSON.parse(data);
        resolve(tips);
      } catch (parseError) {
        console.error('Ошибка разбора tips.json:', parseError.message);
        reject(parseError);
      }
    });
  });
};

// Роут для получения всех советов
router.get('/', async (req, res) => {
  try {
    const now = Date.now();

    // Проверяем есть ли актуальный кэш
    if (tipsCache && (now - lastCacheUpdate) < CACHE_DURATION) {
      console.log('Отдаем советы из кэша');
      return res.json(tipsCache);
    }

    // Если кэша нет или он устарел, читаем файл
    console.log('Читаем советы из файла');
    const tips = await readTipsFromFile();
    
    // Обновляем кэш
    tipsCache = tips;
    lastCacheUpdate = now;
    
    res.json(tips);
  } catch (error) {
    console.error('Ошибка при получении советов:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении советов' });
  }
});

// Функция для принудительного обновления кэша
const refreshCache = async () => {
  try {
    const tips = await readTipsFromFile();
    tipsCache = tips;
    lastCacheUpdate = Date.now();
    console.log('Кэш советов обновлен');
  } catch (error) {
    console.error('Ошибка при обновлении кэша советов:', error);
  }
};

// Обновляем кэш при запуске сервера
refreshCache();

// Добавляем refreshCache к роутеру как свойство
router.refreshCache = refreshCache;

// Экспортируем роутер
module.exports = router;
