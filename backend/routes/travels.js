// backend/routes/travels.js

// Импортируем необходимые модули
const express = require('express'); // Express для роутинга
const fs = require('fs'); // Для работы с файлами
const path = require('path'); // Для работы с путями
const router = express.Router(); // Создаем роутер

const TRAVELS_FILE = path.join(__dirname, '../data/travels.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

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

// --- Получение списка всех туров ---
// GET /travels
router.get('/', (req, res) => {
  const travels = readTravels();
  res.json(travels);
});

// --- Получение тура по id ---
// GET /travels/:id
router.get('/:id', (req, res) => {
  const travels = readTravels();
  const travelId = parseInt(req.params.id, 10);
  const travel = travels.find(t => t.id === travelId);
  if (!travel) {
    return res.status(404).json({ error: 'Тур не найден.' });
  }
  res.json(travel);
});

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

  // Читаем популярные туры
  const popularToursPath = path.join(__dirname, '../data/popular-tours.json');
  let popularTours;
  try {
    const data = fs.readFileSync(popularToursPath, 'utf8');
    popularTours = JSON.parse(data);
  } catch (err) {
    console.error('Ошибка чтения популярных туров:', err);
    return res.status(500).json({ error: 'Не удалось прочитать данные туров' });
  }

  // Получаем полную информацию о турах пользователя
  const userTravels = user.tours
    .map(tourId => popularTours.find(t => t.id === tourId))
    .filter(tour => tour !== undefined);

  res.json(userTravels);
});

// --- Добавление нового тура ---
// POST /travels
router.post('/', (req, res) => {
  const { title, city, description, date } = req.body;
  if (!title || !city || !date) {
    return res.status(400).json({ error: 'Необходимо указать название, город и дату.' });
  }
  const travels = readTravels();
  const newTravel = {
    id: travels.length > 0 ? travels[travels.length - 1].id + 1 : 1,
    title,
    city,
    description: description || '',
    date
  };
  travels.push(newTravel);
  writeTravels(travels);
  res.json(newTravel);
});

// --- Обновление тура ---
// PUT /travels/:id
router.put('/:id', (req, res) => {
  const travelId = parseInt(req.params.id, 10);
  const updatedTravel = req.body;
  const travels = readTravels();
  const index = travels.findIndex(t => t.id === travelId);
  if (index === -1) {
    return res.status(404).json({ error: 'Тур не найден' });
  }
  travels[index] = { ...travels[index], ...updatedTravel };
  writeTravels(travels);
  res.json({ success: true });
});

// --- Удаление тура ---
// DELETE /travels/:id
router.delete('/:id', (req, res) => {
  const travelId = parseInt(req.params.id, 10);
  const travels = readTravels();
  const newTravels = travels.filter(t => t.id !== travelId);
  if (travels.length === newTravels.length) {
    return res.status(404).json({ error: 'Тур не найден' });
  }
  writeTravels(newTravels);
  res.json({ success: true });
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

  // Читаем популярные туры для получения данных тура
  const popularToursPath = path.join(__dirname, '../data/popular-tours.json');
  let popularTours;
  try {
    const data = fs.readFileSync(popularToursPath, 'utf8');
    popularTours = JSON.parse(data);
    console.log('Прочитанные популярные туры:', popularTours[0]);
  } catch (err) {
    console.error('Ошибка чтения популярных туров:', err);
    return res.status(500).json({ error: 'Не удалось прочитать данные туров' });
  }

  const travel = popularTours.find(t => t.id === travelId);
  if (!travel) {
    return res.status(404).json({ error: 'Тур не найден в списке популярных туров' });
  }

  console.log('Найденный тур для добавления:', travel);

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
  console.log('Добавляем тур:', travelId);

  users[userIndex] = user;
  writeUsers(users);

  return res.json({ 
    message: 'Тур успешно добавлен',
    tour: travel
  });
});

// --- Экспорт роутера ---
module.exports = router;
