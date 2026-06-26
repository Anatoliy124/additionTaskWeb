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

app.post('/zipper', upload.any(), async (req, res) => {
  let buffer;

  if (req.files && req.files.length > 0) {
    // Файл пришёл как multipart/form-data
    buffer = req.files[0].buffer;
  } else if (req.file && req.file.buffer) {
    buffer = req.file.buffer;
  } else {
    // multer ничего не нашёл — значит тело не multipart,
    // читаем его как есть (сырые байты файла)
    try {
      const raw = await readRawBody(req);
      if (raw.length > 0) buffer = raw;
    } catch (e) {
      // игнорируем, buffer останется undefined
    }
  }

  if (!buffer) {
    return res.status(400).send('No file');
  }

  gzip(buffer, (err, data) => {
    if (err) return res.status(500).send('Compression error');

    res.writeHead(200, {
      'Content-Type': 'application/gzip',
      'Content-Disposition': 'attachment; filename="result.gz"',
      'Content-Length': data.length
    });

    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
