// Configuración
const CONFIG = require('./app/config/configuracion');

// App principal
const app = require('./app/app');

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

// CORS
const cors = require('cors');
// Configuración CORS mejorada
const cors = require('cors');

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir todos los orígenes, incluyendo null y file://
    if (!origin || origin === 'null' || origin.startsWith('file://')) {
      callback(null, true);
    } else {
      callback(null, true); // O restringe aquí si quieres
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: false, // Cambia a false si usas '*'
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

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
