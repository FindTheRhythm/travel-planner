// backend/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Настройка CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Access-Control-Allow-Origin'],
  credentials: true
}));

app.use(express.json());

// Публичная раздача файлов
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));

// Подключаем маршруты
const authRouter = require('./routes/auth');
const travelsRouter = require('./routes/travels');
const popularTravelsRouter = require('./routes/popularTours');
const tipsRouter = require('./routes/tips'); 
const travelDetailsRouter = require('./routes/travelDetails');
const allToursRouter = require('./routes/allTours');
const profileRouter = require('./routes/profile');

app.use('/auth', authRouter);
app.use('/travels', travelsRouter);
app.use('/popular-tours', popularTravelsRouter);
app.use('/tips', tipsRouter);
app.use('/travel-details', travelDetailsRouter);
app.use('/all-tours', allToursRouter);
app.use('/', profileRouter);

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
