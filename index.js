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

app.post('/zipper', (req, res) => {
  let buffer;

  if (req.file && req.file.buffer) {
    buffer = req.file.buffer;
  } else if (req.files && req.files[0]) {
    buffer = req.files[0].buffer;
  } else if (req.body && Buffer.isBuffer(req.body)) {
    buffer = req.body;
  }

  if (!buffer) {
    return res.status(400).send('No file');
  }

  gzip(buffer, (err, data) => {
    if (err) return res.status(500).send('Compression error');

    res.writeHead(200, {
      'Content-Type': 'application/gzip',
      'Content-Length': data.length
    });

    res.end(data);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
