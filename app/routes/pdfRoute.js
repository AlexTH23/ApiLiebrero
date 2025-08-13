const express = require('express');
const router = express.Router();

const { upload, subirPDF, obtenerPDF, eliminarPDF } = require('../controllers/pdfController');

// Rutas PDF
router.post('/subir', upload.single('pdf'), subirPDF);
router.get('/:key', obtenerPDF);
router.delete('/:key', eliminarPDF);

module.exports = router;
