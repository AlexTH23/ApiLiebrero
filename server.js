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

// Configuración CORS ultra-permisiva para Cordova y Live Server
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir todos los orígenes en desarrollo
    // Esto incluye file:// para Cordova y localhost para Live Server
    callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept', 
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
    'X-Requested-With'
  ],
  exposedHeaders: ['Content-Length', 'X-Filename'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400
};

// Aplica CORS globalmente ANTES de cualquier otra ruta
app.use(cors(corsOptions));

// Manejo específico de preflight OPTIONS
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).end();
  }
  next();
});

// Middleware para asegurar cabeceras CORS en todas las respuestas
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'Content-Length, X-Filename');
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
