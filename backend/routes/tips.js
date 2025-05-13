// backend/routes/tips.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Роут для получения всех советов
router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../data/tips.json');  // Путь к файлу tips.json

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Ошибка чтения tips.json:', err);
    return res.status(500).json({ error: 'Ошибка сервера' });
  }

  console.log('Сырые данные:', data); // <= покажет точно, что в файле

  try {
    const tips = JSON.parse(data);
    res.json(tips);
  } catch (parseError) {
    console.error('Ошибка разбора tips.json:', parseError.message);
    res.status(500).json({ error: 'Невозможно разобрать JSON' });
  }
});

});

module.exports = router;
