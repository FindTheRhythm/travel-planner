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

// Добавить комментарий к месту назначения
router.post('/:id/comments', (req, res) => {
  const travelId = parseInt(req.params.id);
  const { userId, username, text, rating } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ error: 'Текст комментария не может быть пустым' });
  }

  const filePath = path.join(__dirname, '../data/travel-details.json');
  
  fs.readFile(filePath, 'utf-8', (err, jsonData) => {
    if (err) {
      console.error('Ошибка чтения файла travel-details.json:', err);
      return res.status(500).json({ error: 'Ошибка загрузки данных' });
    }

    try {
      const data = JSON.parse(jsonData);
      const travelIndex = data.findIndex(travel => travel.id === travelId);
      
      if (travelIndex === -1) {
        return res.status(404).json({ error: 'Место назначения не найдено' });
      }

      // Создание массива комментариев, если его еще нет
      if (!data[travelIndex].comments) {
        data[travelIndex].comments = [];
      }

      // Добавление нового комментария
      const newComment = {
        id: Date.now(), // Уникальный ID на основе времени
        userId: userId || null,
        username: username || 'Анонимный пользователь',
        text,
        rating: rating || null,
        date: new Date().toISOString()
      };

      data[travelIndex].comments.push(newComment);

      // Сохранение обновленных данных
      fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Ошибка записи в файл:', writeErr);
          return res.status(500).json({ error: 'Не удалось сохранить комментарий' });
        }
        
        res.status(201).json(newComment);
      });
    } catch (parseErr) {
      console.error('Ошибка разбора JSON:', parseErr);
      res.status(500).json({ error: 'Некорректный JSON' });
    }
  });
});

// Получить все комментарии для конкретного места назначения
router.get('/:id/comments', (req, res) => {
  const travelId = parseInt(req.params.id);
  const filePath = path.join(__dirname, '../data/travel-details.json');
  
  fs.readFile(filePath, 'utf-8', (err, jsonData) => {
    if (err) {
      console.error('Ошибка чтения файла travel-details.json:', err);
      return res.status(500).json({ error: 'Ошибка загрузки данных' });
    }

    try {
      const data = JSON.parse(jsonData);
      const travel = data.find(travel => travel.id === travelId);
      
      if (!travel) {
        return res.status(404).json({ error: 'Место назначения не найдено' });
      }

      res.json(travel.comments || []);
    } catch (parseErr) {
      console.error('Ошибка разбора JSON:', parseErr);
      res.status(500).json({ error: 'Некорректный JSON' });
    }
  });
});

// Удалить комментарий к месту назначения
router.delete('/:travelId/comments/:commentId', (req, res) => {
  console.log(`Запрос на удаление комментария получен.`);
  console.log(`travelId: ${req.params.travelId}, commentId: ${req.params.commentId}`);
  console.log(`userId из query: ${req.query.userId}`);
  
  const travelId = parseInt(req.params.travelId);
  const commentId = parseInt(req.params.commentId);
  const { userId } = req.query; // Получаем ID пользователя из запроса
  
  // Проверяем, что все нужные данные есть и они числа
  if (!userId) {
    return res.status(401).json({ error: 'Необходима авторизация для удаления комментариев' });
  }

  if (isNaN(travelId) || isNaN(commentId) || isNaN(parseInt(userId))) {
    return res.status(400).json({ error: 'Некорректные параметры запроса' });
  }

  const filePath = path.join(__dirname, '../data/travel-details.json');
  
  // Проверяем существование файла
  if (!fs.existsSync(filePath)) {
    console.error('Файл travel-details.json не найден');
    return res.status(500).json({ error: 'Файл с данными не найден' });
  }
  
  fs.readFile(filePath, 'utf-8', (err, jsonData) => {
    if (err) {
      console.error('Ошибка чтения файла travel-details.json:', err);
      return res.status(500).json({ error: 'Ошибка загрузки данных' });
    }

    try {
      const data = JSON.parse(jsonData);
      const travelIndex = data.findIndex(travel => travel.id === travelId);
      
      console.log(`Найденный индекс путешествия: ${travelIndex}`);
      
      if (travelIndex === -1) {
        return res.status(404).json({ error: 'Место назначения не найдено' });
      }

      // Проверяем существуют ли комментарии
      if (!data[travelIndex].comments || !data[travelIndex].comments.length) {
        return res.status(404).json({ error: 'Комментарии не найдены' });
      }

      // Находим индекс комментария
      const commentIndex = data[travelIndex].comments.findIndex(
        comment => comment.id === commentId
      );
      
      console.log(`Найденный индекс комментария: ${commentIndex}`);

      if (commentIndex === -1) {
        return res.status(404).json({ error: 'Комментарий не найден' });
      }

      // Проверяем, является ли пользователь автором комментария
      const comment = data[travelIndex].comments[commentIndex];
      const userIdInt = parseInt(userId);
      
      console.log(`ID пользователя комментария: ${comment.userId}, ID пользователя из запроса: ${userIdInt}`);
      
      if (comment.userId !== userIdInt) {
        return res.status(403).json({ error: 'Вы можете удалять только свои комментарии' });
      }

      // Удаляем комментарий
      data[travelIndex].comments.splice(commentIndex, 1);
      console.log('Комментарий удален из массива');

      // Сохраняем обновленные данные
      fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Ошибка записи в файл:', writeErr);
          return res.status(500).json({ error: 'Не удалось удалить комментарий' });
        }
        
        console.log('Данные успешно записаны в файл');
        res.status(200).json({ message: 'Комментарий успешно удален' });
      });
    } catch (parseErr) {
      console.error('Ошибка разбора JSON:', parseErr);
      res.status(500).json({ error: 'Некорректный JSON' });
    }
  });
});

module.exports = router;
