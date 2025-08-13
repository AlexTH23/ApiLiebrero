const express = require('express');
const cors = require('cors');
const CONFIG = require('./app/config/configuracion');
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');
const conexion = require('./app/config/conexion');

// App principal
const app = require('./app/app'); // tus rutas y middlewares

// ===== CORS =====
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ===== Middlewares =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Headers CORS adicionales
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
  next();
});

// Conexión a DB
conexion.conect();

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Puerto
const PORT = process.env.PORT || CONFIG.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Aplicación corriendo en puerto ${PORT}`);
});
