const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const AVATAR_SIZE = 200; // размер аватара в пикселях
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Валидация файла
const fileFilter = (req, file, cb) => {
  // Проверяем MIME тип
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Разрешены только изображения'), false);
  }
  
  // Проверяем расширение
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(new Error('Неподдерживаемый формат файла'), false);
  }
  
  cb(null, true);
};

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/avatars');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

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

// Получить информацию о пользователе, включая аватар
router.get('/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const users = readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar
  });
});

// Проверка текущего пароля пользователя
router.post('/verifyPassword', (req, res) => {
  const { userId, password } = req.body;
  
  if (!userId || !password) {
    return res.status(400).json({ error: 'Необходимо указать ID пользователя и пароль' });
  }
  
  const users = readUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }
  
  if (user.password !== password) {
    return res.status(401).json({ error: 'Неверный пароль' });
  }
  
  res.json({ success: true, message: 'Пароль верный' });
});

// Обновить профиль пользователя
router.post('/updateProfile', (req, res) => {
  const { userId, username, email, currentPassword, newPassword } = req.body;

  const users = readUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  // Проверяем, не занят ли email другим пользователем
  const emailExists = users.some(u => u.email === email && u.id !== userId);
  if (emailExists) {
    return res.status(400).json({ error: 'Email уже используется' });
  }

  // Обновляем данные пользователя
  users[userIndex] = {
    ...users[userIndex],
    username,
    email,
    ...(newPassword && { password: newPassword })
  };

  writeUsers(users);

  res.json({
    id: users[userIndex].id,
    username: users[userIndex].username,
    email: users[userIndex].email,
    avatar: users[userIndex].avatar
  });
});

// Обновить аватар пользователя
router.post('/updateAvatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не загружен' });
    }

    const userId = parseInt(req.body.userId, 10);
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      // Удаляем загруженный файл безопасно
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (err) {
        console.log(`Не удалось удалить файл ${req.file.path}: ${err.message}`);
      }
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Удаляем старый аватар, если он существует
    if (users[userIndex].avatar) {
      const oldAvatarPath = path.join(__dirname, '../uploads/avatars', users[userIndex].avatar);
      try {
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      } catch (err) {
        console.log(`Не удалось удалить старый аватар ${oldAvatarPath}: ${err.message}`);
        // Продолжаем выполнение, даже если не удалось удалить старый файл
      }
    }

    // Обрабатываем изображение
    const processedFileName = path.parse(req.file.filename).name + '.webp';
    const processedFilePath = path.join(req.file.destination, processedFileName);

    await sharp(req.file.path)
      .resize(AVATAR_SIZE, AVATAR_SIZE, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(processedFilePath);

    // Удаляем оригинальный файл безопасно
    try {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (err) {
      console.log(`Не удалось удалить оригинальный файл ${req.file.path}: ${err.message}`);
      // Продолжаем выполнение, даже если не удалось удалить оригинальный файл
    }

    // Обновляем путь к аватару
    users[userIndex].avatar = processedFileName;
    writeUsers(users);

    res.json({
      avatar: processedFileName
    });
  } catch (error) {
    // В случае ошибки удаляем загруженный файл безопасно
    if (req.file) {
      try {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (err) {
        console.log(`Не удалось удалить файл при ошибке ${req.file.path}: ${err.message}`);
      }
    }
    
    console.error('Error updating avatar:', error);
    res.status(500).json({ 
      error: 'Ошибка при обновлении аватара',
      details: error.message
    });
  }
});

module.exports = router; 