// app.js
const express = require('express');
const app = express();
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// ===== Carpeta para guardar PDFs =====
const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// ===== Base de datos temporal para libros =====
// Reemplaza luego con tu base real en MongoDB o MySQL
let libros = [];

// ===== Importar rutas existentes =====
const usuarioRoutes = require('./routes/usuarioRoute');
const authRoutes = require('./routes/authRoute');
const librosRoute = require('./routes/librosRoute'); // tus otras rutas de libros si las tienes

// ===== Middlewares =====
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '20mb' })); // aumento de límite para PDFs grandes

// ===== Rutas existentes =====
app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/libros', librosRoute); // tus rutas de libros existentes

// ===== NUEVAS RUTAS PARA PDF =====
const pdfRouter = express.Router();

// Subir libro con PDF en base64
pdfRouter.post('/', (req, res) => {
  const { titulo, autor, genero, descripcion, archivoJSON } = req.body;
  if (!titulo || !autor || !archivoJSON) return res.status(400).json({ message: 'Faltan datos' });

  // Guardar PDF en carpeta uploads
  const base64Data = archivoJSON.split(',')[1];
  const filePath = path.join(UPLOAD_DIR, `${titulo}.pdf`);
  fs.writeFileSync(filePath, base64Data, 'base64');

  libros.push({ titulo, autor, genero, descripcion, archivoJSON });
  res.json({ message: 'Libro subido correctamente' });
});

// Listar libros (solo título y autor)
pdfRouter.get('/', (req, res) => {
  res.json(libros.map(({ titulo, autor }) => ({ titulo, autor })));
});

// Servir PDF por título
pdfRouter.get('/:titulo/pdf', (req, res) => {
  const libro = libros.find(l => l.titulo === req.params.titulo);
  if (!libro) return res.status(404).send('Libro no encontrado');

  const pdfBuffer = Buffer.from(libro.archivoJSON.split(',')[1], 'base64');
  res.contentType('application/pdf');
  res.send(pdfBuffer);
});

// Montar las nuevas rutas bajo /libros
app.use('/libros', pdfRouter);

module.exports = app;
