// backend/routes/popularTours.js
// GET 12 случайных туров из 30
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const POPULAR_TOURS_FILE = path.join(__dirname, '../data/popular-tours.json');

// Функция для чтения данных из файла popular-tours.json
function readPopularTours() {
  try {
    const data = fs.readFileSync(POPULAR_TOURS_FILE, 'utf8');
    const tours = JSON.parse(data);
    console.log('Прочитанные туры:', tours[0]); // Логируем первый тур для проверки структуры
    return tours;
  } catch (err) {
    console.error("Error reading the tours file:", err);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

// Обработка GET-запроса на /popularTours
router.get('/', (req, res) => {
  const allTours = readPopularTours();
  console.log('Всего туров:', allTours.length);
  
  const shuffled = allTours.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 12);
  
  console.log('Отправляем туры. Первый тур:', selected[0]);
  res.json(selected);
});

// Получить конкретный тур по ID
router.get('/:id', (req, res) => {
  const tourId = parseInt(req.params.id, 10);
  const allTours = readPopularTours();
  const tour = allTours.find(t => t.id === tourId);
  
  if (!tour) {
    return res.status(404).json({ error: 'Tour not found' });
  }
  
  console.log('Отправляем тур по ID:', tour);
  res.json(tour);
});

module.exports = router;
