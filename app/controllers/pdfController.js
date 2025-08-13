// app/controllers/pdfController.js
const s3 = require('../config/spaces');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');

// Configurar multer para recibir archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

async function subirPDF(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha enviado ningún archivo' });
    }

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
}

module.exports = { upload, subirPDF };