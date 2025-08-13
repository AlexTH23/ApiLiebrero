const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// CORS absolutamente abierto
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Multer para subir archivos
const upload = multer({ storage: multer.memoryStorage() });

// Cliente S3
const s3 = new S3Client({
  endpoint: process.env.SPACES_ENDPOINT,
  region: process.env.SPACES_REGION,
  credentials: {
    accessKeyId: process.env.SPACES_KEY,
    secretAccessKey: process.env.SPACES_SECRET,
  },
});

// 📤 Subir PDF
app.post('/pdfs/subir', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió archivo' });

    const fileName = `pdfs/${Date.now()}-${req.file.originalname}`;
    const uploadParams = {
      Bucket: process.env.SPACES_BUCKET,
      Key: fileName,
      Body: req.file.buffer,
      ACL: 'public-read',
      ContentType: 'application/pdf',
    };

    await s3.send(new PutObjectCommand(uploadParams));

    const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.cdn.digitaloceanspaces.com/${fileName}`;
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al subir el archivo' });
  }
});

// 🧪 Endpoint para verificar que está arriba
app.get('/ping', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`));