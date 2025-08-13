// Importaciones principales
const express = require('express');
const CONFIG = require('./app/config/configuracion');
const app = require('./app/app');
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');
const cors = require('cors');

// SOLUCIÓN AL ERROR 413: Aumentar límite de carga (50MB)
app.use(express.json({ 
  limit: '50mb'    // Aumenta límite para JSON
}));
app.use(express.urlencoded({ 
  limit: '50mb',   // Aumenta límite para datos de formularios
  extended: true 
}));

// Configuración CORS mejorada
const corsOptions = {
  origin: function (origin, callback) {
    // Permite todas las origenes (en producción deberías restringirlo)
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,  // Importante si usas cookies/tokens
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // Cachear opciones CORS por 24 horas
};

// Aplica CORS globalmente
app.use(cors(corsOptions));

// Manejo seguro de preflight OPTIONS (sin romper path-to-regexp en Express 5)
app.options(/.*/, cors(corsOptions)); // Expresión regular en vez de '*'

// Middleware para asegurar cabeceras en todas las respuestas
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Conexión a MongoDB Atlas
const conexion = require('./app/config/conexion');
conexion.conect(); // Esta función debe manejar la conexión a Atlas

// Swagger middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Puerto — primero intenta process.env.PORT (para entornos cloud)
const PORT = process.env.PORT || CONFIG.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n=========================================`);
  console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📚 Documentación API: http://localhost:${PORT}/api-docs`);
  console.log(`🗄️  Base de datos: MongoDB Atlas`);
  console.log(`=========================================\n`);
});