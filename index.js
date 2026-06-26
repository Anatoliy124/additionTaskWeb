import express from 'express';
import multer from 'multer';
import { gzip } from 'zlib';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/zipper', upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No file');
  }

  const file = req.files[0];

  gzip(file.buffer, (err, data) => {
    if (err) {
      return res.status(500).send('Compression error');
    }

    res.type('application/gzip');
    res.send(data);
  });
});
const PORT = process.env.PORT || 3000;

app.listen(PORT);
