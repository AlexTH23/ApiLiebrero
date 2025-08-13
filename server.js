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

// Middlewares nativos de Express para parsear JSON y urlencoded con límite de 50 MB para archivos grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configuración CORS específica para tu aplicación Cordova
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de orígenes permitidos para Cordova y desarrollo
    const allowedOrigins = [
      'https://mis-pdfs.sfo3.digitaloceanspaces.com',
      'https://liebrero-st86n.ondigitalocean.app',
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:8080',
      'file://',
      null // Para permitir requests desde file:// (Cordova)
    ];
    
    // Si no hay origin (como en Cordova) o está en la lista permitida
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some(allowed => origin && origin.includes(allowed))) {
      callback(null, true);
    } else {
      console.log('CORS bloqueado para origen:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Accept', 
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Origin',
    'X-Custom-Header'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400
};

// Aplica CORS globalmente
app.use(cors(corsOptions));

// Manejo específico de preflight OPTIONS para todas las rutas
app.options('*', cors(corsOptions));

// Middleware para asegurar cabeceras en todas las respuestas
app.use((req, res, next) => {
  // Permitir múltiples orígenes
  const allowedOrigins = [
    'https://mis-pdfs.sfo3.digitaloceanspaces.com',
    'https://liebrero-st86n.ondigitalocean.app',
    'http://localhost:3000',
    'http://localhost:8080',
    'file://'
  ];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.some(allowed => origin.includes(allowed))) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
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
  console.log(`CORS configurado para permitir: https://mis-pdfs.sfo3.digitaloceanspaces.com`);
  console.log(`API disponible en: https://liebrero-st86n.ondigitalocean.app`);
});
