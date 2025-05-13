// backend/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Публичная раздача изображений
app.use('/images', express.static(path.join(__dirname, 'images')));

// Подключаем маршруты
const authRouter = require('./routes/auth');
const travelsRouter = require('./routes/travels');
const popularTravelsRouter = require('./routes/popularTours');
const tipsRouter = require('./routes/tips'); 
const travelDetailsRouter = require('./routes/travelDetails');
const allToursRouter = require('./routes/allTours');

app.use('/auth', authRouter);
app.use('/travels', travelsRouter);
app.use('/popularTours', popularTravelsRouter);
app.use('/allTours', allToursRouter);
app.use('/tips', tipsRouter); 
app.use('/travel-details', travelDetailsRouter);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
