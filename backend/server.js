// backend/server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

// Создаем необходимые директории, если они не существуют
const directories = ['images', 'uploads/avatars', 'data'];
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

// Парсинг JSON
app.use(express.json());

// Логирование запросов
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Безопасная раздача файлов
app.use('/images', (req, res, next) => {
    // Проверяем расширение файла
    const ext = path.extname(req.path).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (!allowedExtensions.includes(ext)) {
        return res.status(403).json({ error: 'Недопустимый тип файла' });
    }
    
    // Проверяем, что путь не содержит "../" для предотвращения path traversal
    if (req.path.includes('../')) {
        return res.status(403).json({ error: 'Недопустимый путь' });
    }
    
    next();
}, express.static(path.join(__dirname, 'images')));

app.use('/uploads/avatars', (req, res, next) => {
    // Проверяем расширение файла
    const ext = path.extname(req.path).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    if (!allowedExtensions.includes(ext)) {
        return res.status(403).json({ error: 'Недопустимый тип файла' });
    }
    
    // Проверяем, что путь не содержит "../" для предотвращения path traversal
    if (req.path.includes('../')) {
        return res.status(403).json({ error: 'Недопустимый путь' });
    }
    
    // Устанавливаем заголовки кэширования
    res.set({
        'Cache-Control': 'public, max-age=31536000', // 1 год
        'Expires': new Date(Date.now() + 31536000000).toUTCString()
    });
    
    next();
}, express.static(path.join(__dirname, 'uploads/avatars')));

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

// Глобальный обработчик необработанных ошибок
process.on('uncaughtException', (err) => {
    console.error('Необработанная ошибка:', err);
    // Не завершаем процесс, просто логируем ошибку
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Необработанное отклонение промиса:', reason);
    // Не завершаем процесс, просто логируем ошибку
});

// Обработка ошибок Express
app.use((err, req, res, next) => {
    console.error(`${new Date().toISOString()} Error:`, err);
    
    // Проверяем тип ошибки и отправляем соответствующий ответ
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Некорректный JSON' });
    }
    
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Размер данных превышает допустимый' });
    }
    
    // Обработка ошибок multer
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ error: 'Файл слишком большой' });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'Неожиданный файл' });
    }
    
    res.status(err.status || 500).json({ 
        error: err.message || 'Внутренняя ошибка сервера',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Обработка несуществующих маршрутов
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
let server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Корректное завершение сервера
const gracefulShutdown = () => {
    console.log('Получен сигнал завершения. Закрываем сервер...');
    server.close(() => {
        console.log('Сервер успешно закрыт');
        process.exit(0);
    });

    // Если сервер не закрылся за 10 секунд, завершаем процесс принудительно
    setTimeout(() => {
        console.log('Не удалось закрыть сервер gracefully, завершаем принудительно');
        process.exit(1);
    }, 10000);
};

// Обработка сигналов завершения
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Обработка nodemon restart
process.once('SIGUSR2', () => {
    gracefulShutdown();
});
