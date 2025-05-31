// backend/routes/travels.js

// Импортируем необходимые модули
const express = require('express'); // Express для роутинга
const fs = require('fs'); // Для работы с файлами
const path = require('path'); // Для работы с путями
const router = express.Router(); // Создаем роутер

const TRAVELS_FILE = path.join(__dirname, '../data/travels.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');
const POPULAR_TOURS_FILE = path.join(__dirname, '../data/popular-tours.json');

// Кэш для популярных туров
let popularToursCache = null;
let lastPopularToursRead = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 минут в миллисекундах

// Читать/записывать поездки из JSON
function readTravels() {
  try {
    const data = fs.readFileSync(TRAVELS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
function writeTravels(travels) {
  fs.writeFileSync(TRAVELS_FILE, JSON.stringify(travels, null, 2), 'utf8');
}

// Читать/записывать пользователей из JSON
function readUsers() {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

// Читать популярные туры с кэшированием
function readPopularTours() {
  const now = Date.now();
  if (popularToursCache && (now - lastPopularToursRead) < CACHE_TTL) {
    return popularToursCache;
  }

  try {
    const data = fs.readFileSync(POPULAR_TOURS_FILE, 'utf8');
    popularToursCache = JSON.parse(data);
    lastPopularToursRead = now;
    return popularToursCache;
  } catch (err) {
    console.error('Ошибка чтения популярных туров:', err);
    return [];
  }
}

// Получить путешествия пользователя
router.get('/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const users = readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  if (!user.tours || !Array.isArray(user.tours)) {
    return res.json([]);
  }

  // Получаем популярные туры из кэша
  const popularTours = readPopularTours();

  // Получаем полную информацию о турах пользователя
  const userTravels = user.tours
    .map(tourId => popularTours.find(t => t.id === tourId))
    .filter(tour => tour !== undefined);

  res.json(userTravels);
});

// Удалить тур из списка пользователя
router.delete('/user-tours/:userId/:travelId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const travelId = parseInt(req.params.travelId, 10);

  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const user = users[userIndex];
  const originalLength = user.tours?.length || 0;

  if (!user.tours) user.tours = [];

  // Фильтруем массив ID туров
  user.tours = user.tours.filter(id => id !== travelId);

  if (user.tours.length === originalLength) {
    return res.status(404).json({ error: 'Тур не найден в списке пользователя' });
  }

  users[userIndex] = user;
  writeUsers(users);

  return res.json({ message: 'Тур успешно удален' });
});

// Добавить тур в список пользователя
router.post('/user/:userId/add', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const { travelId } = req.body;

  if (!travelId) {
    return res.status(400).json({ error: 'Необходимо указать ID тура.' });
  }

  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  // Получаем популярные туры из кэша
  const popularTours = readPopularTours();

  const travel = popularTours.find(t => t.id === travelId);
  if (!travel) {
    return res.status(404).json({ error: 'Тур не найден в списке популярных туров' });
  }

  const user = users[userIndex];
  if (!user.tours) {
    user.tours = [];
  }

  // Проверяем, не сохранен ли уже этот тур
  if (user.tours.includes(travelId)) {
    return res.status(400).json({ error: 'Тур уже сохранен' });
  }

  // Добавляем id тура в список пользователя
  user.tours.push(travelId);

  users[userIndex] = user;
  writeUsers(users);

  return res.json({ 
    message: 'Тур успешно добавлен',
    tour: travel
  });
});

// --- Экспорт роутера ---
module.exports = router;
