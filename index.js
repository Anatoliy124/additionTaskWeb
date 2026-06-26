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

app.post('/zipper', upload.any(), (req, res) => {
  const file = (req.files && req.files[0]) || req.file;

  if (!file || !file.buffer) {
    return res.status(400).send('No file');
  }

  gzip(file.buffer, (err, data) => {
    if (err) {
      return res.status(500).send('Compression error');
    }
    res.set('Content-Type', 'application/gzip');
    res.send(data);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
