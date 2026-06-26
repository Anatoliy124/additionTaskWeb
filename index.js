import express from 'express';
import multer from 'multer';
import { gzip } from 'zlib';

const app = express();

// важно: memory storage
const upload = multer({ storage: multer.memoryStorage() });

// CORS (на всякий случай для тестеров)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

/*
  LOGIN ROUTE (обязательный для Moodle)
*/
app.get('/login', (req, res) => {
  res.type('text/plain; charset=UTF-8');
  res.send('anatoliy409453');
});

/*
  ZIPPER ROUTE (gzip файла)
*/
app.post('/zipper', upload.single('file'), (req, res) => {
  if (!req.file || !req.file.buffer) {
    return res.status(400).send('No file');
  }

  gzip(req.file.buffer, (err, data) => {
    if (err) {
      return res.status(500).send('Compression error');
    }

    res.writeHead(200, {
      'Content-Type': 'application/gzip',
      'Content-Length': data.length,
      'Access-Control-Allow-Origin': '*'
    });

    res.end(data);
  });
});

/*
  START SERVER
*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
