// =========================
// Configuración
// =========================
const CONFIG = require('./app/config/configuracion');
const app = require('./app/app');

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

// =========================
// CORS compatible con Cordova
// =========================
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir todos los orígenes incluyendo file:// y null (Cordova)
    if (!origin || origin === 'null' || origin.startsWith('file://')) {
      callback(null, true);
    } else {
      callback(null, true); // Aquí puedes restringir si es producción
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: false, // Cambia a true si necesitas cookies
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// =========================
// Conexión DB
// =========================
const conexion = require('./app/config/conexion');
conexion.conect();

// =========================
// Swagger middleware
// =========================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// =========================
// Endpoint para recibir Base64 y guardar como imagen
// =========================
const fs = require('fs');
const path = require('path');
app.use(require('express').json({ limit: '20mb' })); // Permitir JSON grande para base64

app.post('/subir-imagen', (req, res) => {
  try {
    const { imagenBase64, nombreArchivo } = req.body;

    if (!imagenBase64) {
      return res.status(400).json({ error: 'No se envió la imagen en base64' });
    }

    // Detectar tipo de imagen
    const match = imagenBase64.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      return res.status(400).json({ error: 'Formato base64 inválido' });
    }

    const extension = match[1].split('/')[1];
    const data = match[2];
    const buffer = Buffer.from(data, 'base64');

    // Ruta para guardar
    const fileName = nombreArchivo || `imagen_${Date.now()}.${extension}`;
    const savePath = path.join(__dirname, 'uploads', fileName);

    // Crear carpeta si no existe
    fs.mkdirSync(path.dirname(savePath), { recursive: true });

    fs.writeFileSync(savePath, buffer);
    console.log(`Imagen guardada en: ${savePath}`);

    res.json({ mensaje: 'Imagen subida correctamente', archivo: fileName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar la imagen' });
  }
});

// =========================
// Puerto
// =========================
const PORT = process.env.PORT || CONFIG.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Aplicación corriendo en puerto ${PORT}`);
});
