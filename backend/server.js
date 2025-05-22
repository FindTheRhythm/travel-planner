// backend/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Создаем необходимые директории, если они не существуют
const directories = ['images', 'uploads/avatars'];
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
});

// Настройка CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-production-domain.com' 
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Access-Control-Allow-Origin'],
    credentials: true
}));

// Basic security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

app.use(express.json());

// Публичная раздача файлов
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Подключаем маршруты
try {
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
} catch (error) {
    console.error('Error loading routes:', error);
    process.exit(1);
}

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(`${new Date().toISOString()} Error:`, err.stack);
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
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
