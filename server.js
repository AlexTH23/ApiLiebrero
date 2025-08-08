//Configuracion.js
const CONFIG = require('./app/config/configuracion');

//App.js
const app = require('./app/app');

//Swagger
const { swaggerUi, swaggerSpec } = require('./swagger/swagger');

//Cors
const cors = require('cors');
app.use(cors());

//Conexion.js
const conexion = require('./app/config/conexion')
conexion.conect()

//Swagger middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Cors
app.use(cors());

app.listen(CONFIG.PORT, () => {
    console.log(`Aplicacion corriendo en puerto ${CONFIG.PORT}`);
})



