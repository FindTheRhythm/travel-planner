const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const POPULAR_TOURS_FILE = path.join(__dirname, '../data/popular-tours.json');

// Функция для чтения данных из файла popular-tours.json
function readAllTours() {
  try {
    const data = fs.readFileSync(POPULAR_TOURS_FILE, 'utf8');
    const tours = JSON.parse(data);
    console.log('Всего туров загружено:', tours.length);
    return tours;
  } catch (err) {
    console.error("Error reading the tours file:", err);
    return []; // Возвращаем пустой массив в случае ошибки
  }
}

// Обработка GET-запроса на /allTours - возвращает все туры
router.get('/', (req, res) => {
  const allTours = readAllTours();
  console.log('Отправляем все туры. Количество:', allTours.length);
  res.json(allTours);
});

// Получить конкретный тур по ID
router.get('/:id', (req, res) => {
  const tourId = parseInt(req.params.id, 10);
  const allTours = readAllTours();
  const tour = allTours.find(t => t.id === tourId);
  
  if (!tour) {
    return res.status(404).json({ error: 'Tour not found' });
  }
  
  console.log('Отправляем тур по ID:', tour);
  res.json(tour);
});

module.exports = router; 