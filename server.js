// Importa express para usar sus middlewares
const express = require('express');

// Configuración
const CONFIG = require('./app/config/configuracion');

// App principal (instancia express ya creada dentro de ./app/app)
const app = require('./app/app');

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

// CORS
const cors = require('cors');

// Middlewares nativos de Express para parsear JSON y urlencoded con límite de 10 MB
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Configuración CORS mejorada
const corsOptions = {
  origin: function (origin, callback) {
    // Permite todas las orígenes (en producción deberías restringirlo)
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
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

// Conexión DB
const conexion = require('./app/config/conexion');
conexion.conect();

// Swagger middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Puerto — primero intenta process.env.PORT (DigitalOcean/App Platform)
const PORT = process.env.PORT || CONFIG.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Aplicación corriendo en puerto ${PORT}`);
});
