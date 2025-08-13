const express = require('express');
const router = express.Router();
const { upload, subirPDF, obtenerPDF, eliminarPDF } = require('../controllers/pdfController');

// 📤 POST /pdfs/subir
router.post('/subir', upload.single('pdf'), subirPDF);

// 👁️ GET /pdfs/:key
router.get('/:key', obtenerPDF);

// ❌ DELETE /pdfs/:key
router.delete('/:key', eliminarPDF);

module.exports = router;