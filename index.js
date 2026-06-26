import express from 'express';
import multer from 'multer';
import { gzip } from 'zlib';

const app = express();
const PORT = process.env.PORT || 3000;

// Настройка multer: храним файл в памяти, лимит 10 МБ
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

// CORS для всех запросов
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// Маршрут /login
app.get('/login', (req, res) => {
  res.type('text/plain; charset=UTF-8');
  res.send('anatoliy409453');
});

// Маршрут /zipper
app.post('/zipper', (req, res, next) => {
  // Оборачиваем upload.single в try/catch для обработки ошибок multer
  upload.single('file')(req, res, (err) => {
    if (err) {
      // Если ошибка от multer — возвращаем её текст
      return res.status(400).send(`Multer error: ${err.message}`);
    }
    next();
  });
}, (req, res) => {
  // Проверяем, что файл есть
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Сжимаем файл через gzip
  gzip(req.file.buffer, (err, data) => {
    if (err) {
      return res.status(500).send('Compression error');
    }

    res.set('Content-Type', 'application/gzip');
    res.send(data);
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
