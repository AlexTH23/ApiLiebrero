const express = require('express');
const app = express();
require('dotenv').config();

// Importar rutas
const router = require('./routes/librosRoute');
const usuarioRoutes = require('./routes/usuarioRoute');
const authRoutes = require('./routes/authRoutes'); // Ahora sí existe este archivo

// Middlewares para parsear datos
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.use('/libros', router);
app.use('/auth', authRoute);      // Ruta /auth funcionando
app.use('/usuarios', usuarioRoutes);

module.exports = app;
