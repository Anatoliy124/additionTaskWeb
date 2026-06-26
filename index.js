import express from 'express';
import { gzip } from 'zlib';

const app = express();

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/login', (req, res) => {
  res.type('text/plain; charset=UTF-8');
  res.send('anatoliy409453');
});

// ВРЕМЕННЫЙ диагностический режим — без multer, просто смотрим что реально приходит
app.post('/zipper', (req, res) => {
  const chunks = [];

  req.on('data', (chunk) => chunks.push(chunk));

  req.on('end', () => {
    const raw = Buffer.concat(chunks);

    console.log('--- RAW /zipper body ---');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Content-Length header:', req.headers['content-length']);
    console.log('Actual bytes received:', raw.length);
    console.log('Raw body (как текст):');
    console.log(JSON.stringify(raw.toString('utf8')));

    res.status(400).send('Debug mode - see server logs');
  });

  req.on('error', (err) => {
    console.log('Stream error:', err.message);
    res.status(500).send('Stream error');
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
