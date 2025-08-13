const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Importar rutas
const librosRoute = require('./routes/librosRoute');
const usuarioRoute = require('./routes/usuarioRoute');
const authRoute = require('./routes/authRoute');
const pdfRoute = require('./routes/pdfRoute');
require('dotenv').config();

app.use(cors());
// Rutas
app.use('/libros', librosRoute);
app.use('/auth', authRoute);
app.use('/usuarios', usuarioRoute);
app.use('/pdfs', pdfRoute);

// Puerto dinámico para DigitalOcean
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));

module.exports = app;
