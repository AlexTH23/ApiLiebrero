const express = require('express');
const app = express();
require('dotenv').config();

// Importar rutas
const router = require('./routes/librosRoute');
const usuarioRoutes = require('./routes/usuarioRoute');
const authRoutes = require('./routes/authRoute'); // Ahora sí existe este archivoz

const pdfRoutes = require('./routes/pdfRoute');

// Middlewares para parsear datos
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use('/libros', router);
app.use('/auth', authRoutes);      // Ruta /auth funcionando
app.use('/usuarios', usuarioRoutes);

// ... después de tus rutas existentes
app.use('/pdfs', pdfRoutes);

module.exports = app;
