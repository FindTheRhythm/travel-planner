// backend/server.js

// Импортируем необходимые модули
const express = require('express'); // Основной фреймворк для сервера
const fs = require('fs'); // Для работы с файловой системой
const path = require('path'); // Для работы с путями
const cors = require('cors'); // Для поддержки CORS
const app = express(); // Создаем экземпляр приложения Express

// --- Создание необходимых директорий ---
// Проверяем и создаём папки для хранения изображений, аватаров и данных, если их нет
const directories = ['images', 'uploads/avatars', 'data'];
directories.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
});

// --- Настройка CORS ---
// Разрешаем запросы с фронтенда (localhost:3000 в dev, production-домен в prod)
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-production-domain.com' 
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Access-Control-Allow-Origin'],
    credentials: true
}));

// --- Парсинг JSON ---
// Позволяет Express автоматически парсить JSON в body запросов
app.use(express.json());

// --- Логирование всех запросов ---
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// --- Безопасная раздача файлов изображений ---
// Проверяем расширения и защищаем от path traversal
app.use('/images', (req, res, next) => {
    const ext = path.extname(req.path).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (!allowedExtensions.includes(ext)) {
        return res.status(403).json({ error: 'Недопустимый тип файла' });
    }
    if (req.path.includes('../')) {
        return res.status(403).json({ error: 'Недопустимый путь' });
    }
    next();
}, express.static(path.join(__dirname, 'images')));

// --- Раздача аватаров с кэшированием ---
app.use('/uploads/avatars', (req, res, next) => {
    const ext = path.extname(req.path).toLowerCase();
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    if (!allowedExtensions.includes(ext)) {
        return res.status(403).json({ error: 'Недопустимый тип файла' });
    }
    if (req.path.includes('../')) {
        return res.status(403).json({ error: 'Недопустимый путь' });
    }
    // Кэшируем аватары на год
    res.set({
        'Cache-Control': 'public, max-age=31536000',
        'Expires': new Date(Date.now() + 31536000000).toUTCString()
    });
    next();
}, express.static(path.join(__dirname, 'uploads/avatars')));

// --- Подключение маршрутов (роутеров) ---
try {
    // Каждый роутер отвечает за свою часть API
    const authRouter = require('./routes/auth'); // Аутентификация и регистрация
    const travelsRouter = require('./routes/travels'); // CRUD для туров
    const popularTravelsRouter = require('./routes/popularTours'); // Популярные туры и все туры
    const tipsRouter = require('./routes/tips'); // Советы путешественникам
    const travelDetailsRouter = require('./routes/travelDetails'); // Детальная инфа о туре
    const profileRouter = require('./routes/profile'); // Профиль пользователя

    // Подключаем роутеры к соответствующим путям
    app.use('/auth', authRouter);
    app.use('/travels', travelsRouter);
    app.use('/popular-tours', popularTravelsRouter);
    app.use('/tips', tipsRouter);
    app.use('/travel-details', travelDetailsRouter);
    app.use('/', profileRouter); // Профиль и связанные действия
} catch (error) {
    console.error('Error loading routes:', error);
    process.exit(1);
}

// --- Глобальный обработчик необработанных ошибок Node.js ---
process.on('uncaughtException', (err) => {
    console.error('Необработанная ошибка:', err);
    // Не завершаем процесс, просто логируем ошибку
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Необработанное отклонение промиса:', reason);
    // Не завершаем процесс, просто логируем ошибку
});

// --- Обработка ошибок Express ---
app.use((err, req, res, next) => {
    console.error(`${new Date().toISOString()} Error:`, err);
    // Обработка разных типов ошибок
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Некорректный JSON' });
    }
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Размер данных превышает допустимый' });
    }
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

// --- Обработка несуществующих маршрутов (404) ---
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// --- Запуск сервера ---
const PORT = process.env.PORT || 5000;
let server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// --- Корректное завершение сервера (graceful shutdown) ---
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

// --- Обработка сигналов завершения процесса ---
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
// Для поддержки перезапуска через nodemon
process.once('SIGUSR2', () => {
    gracefulShutdown();
});
