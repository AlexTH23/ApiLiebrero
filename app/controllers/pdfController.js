const s3 = require('../config/spaces');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');

// Configurar multer para recibir archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Subir PDF
async function subirPDF(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se envió archivo' });

    const fileName = `pdfs/${Date.now()}-${req.file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.SPACES_BUCKET,
        Key: fileName,
        Body: req.file.buffer,
        ACL: 'public-read',
        ContentType: 'application/pdf',
      })
    );

const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.cdn.digitaloceanspaces.com/${fileName}`;
    res.json({ url, key: fileName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al subir PDF' });
  }
}

// Obtener URL pública del PDF
async function obtenerPDF(req, res) {
  const { key } = req.params;
  if (!key) return res.status(400).json({ error: 'Falta el nombre del archivo' });

  const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.cdn.digitaloceanspaces.com/${key}`;
  res.json({ url });
}

// Eliminar PDF
async function eliminarPDF(req, res) {
  try {
    const { key } = req.params;
    if (!key) return res.status(400).json({ error: 'Falta el nombre del archivo' });

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.SPACES_BUCKET,
        Key: key,
      })
    );

    res.json({ message: 'PDF eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar PDF' });
  }
}

module.exports = { upload, subirPDF, obtenerPDF, eliminarPDF };
