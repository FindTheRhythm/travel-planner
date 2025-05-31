// backend/routes/popularTours.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const POPULAR_TOURS_FILE = path.join(__dirname, '../data/popular-tours.json');

// Кэш для туров
let toursCache = null;
let lastToursRead = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 минут в миллисекундах

// Функция для чтения данных из файла popular-tours.json с кэшированием
function readTours() {
  const now = Date.now();
  if (toursCache && (now - lastToursRead) < CACHE_TTL) {
    return toursCache;
  }

  try {
    const data = fs.readFileSync(POPULAR_TOURS_FILE, 'utf8');
    toursCache = JSON.parse(data);
    lastToursRead = now;
    return toursCache;
  } catch (err) {
    console.error("Error reading the tours file:", err);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

// Получить все туры
router.get('/all', (req, res) => {
  const allTours = readTours();
  res.json(allTours);
});

// Получить 12 случайных популярных туров
router.get('/', (req, res) => {
  const allTours = readTours();
  const shuffled = allTours.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 12);
  res.json(selected);
});

// Получить конкретный тур по ID
router.get('/:id', (req, res) => {
  const tourId = parseInt(req.params.id, 10);
  const allTours = readTours();
  const tour = allTours.find(t => t.id === tourId);
  
  if (!tour) {
    return res.status(404).json({ error: 'Tour not found' });
  }
  
  res.json(tour);
});

module.exports = router;
