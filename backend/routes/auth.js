// backend/routes/auth.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../data/users.json');

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

// Регистрация
router.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Необходимо указать имя пользователя, email и пароль.' });
  }

  const users = readUsers();
  if (users.find(user => user.username === username)) {
    return res.status(400).json({ error: 'Пользователь с таким именем уже существует.' });
  }
  if (users.find(user => user.email === email)) {
    return res.status(400).json({ error: 'Пользователь с таким email уже существует.' });
  }

  const newUser = {
    id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
    username,
    email,
    password
  };
  users.push(newUser);
  writeUsers(users);
  res.json({ message: 'Регистрация успешна', user: { id: newUser.id, username: newUser.username, email: newUser.email } });
});

// Вход
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Необходимо указать email и пароль.' });
  }
  const users = readUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Неверный email или пароль.' });
  }
  res.json({ id: user.id, username: user.username, email: user.email });
});

// Удаление аккаунта
router.delete('/delete-account/:userId', (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const users = readUsers();
    
    // Находим пользователя
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    // Удаляем аватар пользователя, если он есть
    const user = users[userIndex];
    if (user.avatar) {
      const avatarPath = path.join(__dirname, '../uploads/avatars', user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }

    // Удаляем пользователя из массива
    users.splice(userIndex, 1);
    
    // Сохраняем обновленный список пользователей
    writeUsers(users);

    res.json({ message: 'Аккаунт успешно удален' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Ошибка при удалении аккаунта' });
  }
});

module.exports = router;
