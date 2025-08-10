// Configuración
const CONFIG = require('./app/config/configuracion');

// App principal
const app = require('./app/app');

// Swagger
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

// CORS
const cors = require('cors');
app.use(cors({
    origin: '*', // Permite a cualquier origen
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization']
}));
// Conexión DB
const conexion = require('./app/config/conexion');
conexion.conect();

// Swagger middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Puerto — primero intenta process.env.PORT (DigitalOcean/App Platform)
const PORT = process.env.PORT || CONFIG.PORT || 3000;

// Escuchar en 0.0.0.0 (obligatorio en contenedores)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Aplicación corriendo en puerto ${PORT}`);
});
