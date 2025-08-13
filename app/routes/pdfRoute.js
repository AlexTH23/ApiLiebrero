// routes/pdfRoutes.js
const express = require('express');
const router = express.Router();
const { 
  upload, 
  subirPDF, 
  obtenerPDF, 
  eliminarPDF,
  listarPDFs
} = require('../controllers/pdfController');

// Subir PDF (POST)
router.post('/upload', upload, subirPDF);

// Obtener URL de PDF (GET)
router.get('/:key', obtenerPDF);

// Eliminar PDF (DELETE)
router.delete('/:key', eliminarPDF);

// Listar todos los PDFs (GET)
router.get('/', listarPDFs);

module.exports = router;