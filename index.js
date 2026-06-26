import express from 'express';
import multer from 'multer';
import { gzip } from 'zlib';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/zipper', upload.single('file'), (req, res) => {
  if (!req.file || !Buffer.isBuffer(req.file.buffer)) {
    return res.status(400).send('No file');
  }

  gzip(req.file.buffer, (err, data) => {
    if (err) return res.status(500).send('Compression error');

    res.setHeader('Content-Type', 'application/gzip');
    res.setHeader('Content-Length', data.length);
    res.setHeader('Access-Control-Allow-Origin', '*');

    // ВАЖНО: только raw stream
    return res.end(data);
  });
});

app.listen(process.env.PORT || 3000);
