# Travel Planner

Веб-приложение для планирования путешествий с возможностью поиска и сохранения интересных мест.

## Функционал

- Регистрация и авторизация пользователей
- Поиск мест по тегам (Культура, Природа и т.д.)
- Просмотр детальной информации о местах
- Сохранение мест в профиль
- Управление профилем (редактирование, удаление)
- Комментарии и оценки мест
- Адаптивный дизайн

## Технологии

### Frontend
- React 
- TypeScript
- Material UI
- React Router
- Axios

### Backend
- Node.js
- Express
- JSON storage

### Тестирование
- Cypress (e2e тесты)

## Установка и запуск

1. Установка зависимостей:
```bash
npm run install:all
```

2. Запуск приложения:
```bash
npm run dev
```

Frontend будет доступен на http://localhost:3000
Backend API на http://localhost:5000

## Скрипты

- `npm run install:all` - установка всех зависимостей
- `npm run dev` - запуск frontend и backend
- `npm run start:frontend` - запуск только frontend
- `npm run start:backend` - запуск только backend
- `npm run build` - сборка frontend
- `npm run lint:all` - проверка кода линтером
- `npm run format:all` - форматирование кода
- `npm run stop` - остановка всех процессов node

## Тестирование

Запуск e2e тестов:
```bash
cd frontend
npx cypress open
```

## Автор

Danila Shurupov
