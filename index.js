import express from 'express';
import multer from 'multer';
import { gzip } from 'zlib';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/login', (req, res) => {
  res.type('text/plain; charset=UTF-8');
  res.send('anatoliy409453');
});

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

app.post(
  '/zipper',
  (req, res, next) => {
    const contentType = req.headers['content-type'] || '';
    if (contentType.startsWith('multipart/form-data')) {
      // Это форма с файлом — отдаём multer'у, он умеет это разбирать
      return upload.any()(req, res, next);
    }
    // Не multipart — поток ещё не трогали, безопасно читаем дальше сами
    next();
  },
  async (req, res) => {
    let buffer;

    if (req.files && req.files.length > 0) {
      buffer = req.files[0].buffer;
    } else if (req.file && req.file.buffer) {
      buffer = req.file.buffer;
    } else {
      try {
        buffer = await readRawBody(req);
      } catch (e) {
        buffer = null;
      }
    }

    console.log('Content-Type:', req.headers['content-type'], '| buffer length:', buffer ? buffer.length : 0);

    if (!buffer || buffer.length === 0) {
      return res.status(400).send('No file');
    }

    gzip(buffer, (err, data) => {
      if (err) {
        return res.status(500).send('Compression error');
      }
      res.set('Content-Type', 'application/gzip');
      res.send(data);
    });
  }
);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
