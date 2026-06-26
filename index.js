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
  res.json({
    body: req.body,
    files: req.files ? req.files.map(f => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      size: f.size
    })) : []
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT);
