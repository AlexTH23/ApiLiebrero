// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));

// Carpeta pública (si tienes Cordova compilado en /www o /public)
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para convertir una imagen local a Base64
app.get('/image-to-base64/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, 'public', filename);

  if (!fs.existsSync(imagePath)) {
    return res.status(404).json({ error: 'Imagen no encontrada' });
  }

  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = `image/${path.extname(filename).substring(1)}`;

  res.json({
    filename,
    base64: `data:${mimeType};base64,${base64Image}`
  });
});

// Ruta para recibir Base64 y guardarlo como imagen
app.post('/base64-to-image', (req, res) => {
  const { base64, filename } = req.body;

  if (!base64 || !filename) {
    return res.status(400).json({ error: 'Base64 y filename requeridos' });
  }

  const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return res.status(400).json({ error: 'Formato Base64 inválido' });
  }

  const imageBuffer = Buffer.from(matches[2], 'base64');
  const savePath = path.join(__dirname, 'public', filename);

  fs.writeFileSync(savePath, imageBuffer);
  res.json({ success: true, message: 'Imagen guardada correctamente' });
});

// Puerto dinámico para DigitalOcean
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
