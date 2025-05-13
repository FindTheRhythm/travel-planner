// backend/routes/travelDetails.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '../data/travel-details.json');

  fs.readFile(filePath, 'utf-8', (err, jsonData) => {
    if (err) {
      console.error('Ошибка чтения файла travel-details.json:', err);
      return res.status(500).json({ error: 'Ошибка загрузки данных' });
    }

    try {
      const data = JSON.parse(jsonData);
      res.json(data);
    } catch (parseErr) {
      console.error('Ошибка разбора JSON:', parseErr);
      res.status(500).json({ error: 'Некорректный JSON' });
    }
  });
});

module.exports = router;
