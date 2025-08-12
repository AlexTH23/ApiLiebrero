// Configuración
const CONFIG = require('./app/config/configuracion');

// App principal
const app = require('./app/app');

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

// CORS
const cors = require('cors');
// Configuración CORS mejorada
const corsOptions = {
  origin: function (origin, callback) {
    // Permite todas las origenes (en producción deberías restringirlo)
    callback(null, true);

    // Para producción, usa algo como:
    // const allowedOrigins = ['https://tudominio.com', 'https://otrodominio.com'];
    // if (!origin || allowedOrigins.includes(origin)) {
    //   callback(null, true);
    // } else {
    //   callback(new Error('Not allowed by CORS'));
    // }
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


app.use(cors(corsOptions));

// Preflight para todas las rutas (Express 5 usa RegExp en vez de '*')
app.options(/.*/, cors(corsOptions));

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
