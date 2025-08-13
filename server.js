// Importa express para usar sus middlewares
const express = require('express');

// Configuración
const CONFIG = require('./app/config/configuracion');

// App principal
const app = require('./app/app');

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

// CORS
const cors = require('cors');

// Middlewares nativos de Express para parsear JSON y form-data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ✅ CORS abierto para permitir peticiones desde cualquier origen
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['*'],
  credentials: false,
  optionsSuccessStatus: 200
}));

// ✅ Headers adicionales para evitar bloqueos
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  next();
});

// 🧪 Endpoint para verificar variables de entorno
app.get('/env-check', (req, res) => {
  res.json({
    SPACES_REGION: process.env.SPACES_REGION,
    SPACES_BUCKET: process.env.SPACES_BUCKET,
    SPACES_KEY: process.env.SPACES_KEY ? '✅' : '❌',
    SPACES_SECRET: process.env.SPACES_SECRET ? '✅' : '❌',
  });
});

// Conexión DB
const conexion = require('./app/config/conexion');
conexion.conect();

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Puerto
const PORT = process.env.PORT || CONFIG.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Aplicación corriendo en puerto ${PORT}`);
});