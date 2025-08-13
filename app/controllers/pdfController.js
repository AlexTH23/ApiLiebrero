const s3 = require('../config/spaces');
const { PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// Configuración de multer con límites y filtros
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
    files: 1 // Solo un archivo a la vez
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se permiten archivos PDF'), false);
    }
    cb(null, true);
  }
}).single('pdf');

/**
 * Sube un PDF al bucket con manejo mejorado de errores
 */
async function subirPDF(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió archivo PDF válido' });
    }

    // Generar nombre de archivo seguro
    const safeFilename = req.file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '-');
    const fileName = `pdfs/${uuidv4()}-${safeFilename}`;

    const putCommand = new PutObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: fileName,
      Body: req.file.buffer,
      ACL: 'public-read',
      ContentType: 'application/pdf',
      ContentDisposition: 'inline; filename="' + safeFilename + '"'
    });

    await s3.send(putCommand);

    const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.cdn.digitaloceanspaces.com/${fileName}`;
    
    res.json({ 
      url, 
      key: fileName,
      nombre: safeFilename,
      size: req.file.size,
      mensaje: 'PDF subido correctamente'
    });
    
  } catch (err) {
    console.error('Error al subir PDF:', err);
    
    // Manejar errores específicos de AWS
    let errorMessage = 'Error al subir PDF';
    if (err.name === 'InvalidObjectState') {
      errorMessage = 'El archivo ya existe o está en proceso de carga';
    } else if (err.name === 'RequestTimeout') {
      errorMessage = 'Tiempo de espera agotado. Intente nuevamente';
    }
    
    res.status(500).json({ 
      error: errorMessage,
      detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Verifica la existencia de un PDF antes de devolver la URL
 */
async function obtenerPDF(req, res) {
  try {
    const { key } = req.params;
    if (!key) return res.status(400).json({ error: 'Falta el identificador del archivo' });

    // Verificar que el archivo existe
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: key
    });

    await s3.send(headCommand);

    const url = `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.cdn.digitaloceanspaces.com/${key}`;
    res.json({ url });
    
  } catch (err) {
    if (err.name === 'NotFound') {
      return res.status(404).json({ error: 'El archivo PDF no fue encontrado' });
    }
    
    console.error('Error al obtener PDF:', err);
    res.status(500).json({ 
      error: 'Error al recuperar el PDF',
      detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Elimina un PDF con verificación previa
 */
async function eliminarPDF(req, res) {
  try {
    const { key } = req.params;
    if (!key) return res.status(400).json({ error: 'Falta el identificador del archivo' });

    // Verificar que el archivo existe antes de eliminar
    const headCommand = new HeadObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: key
    });

    await s3.send(headCommand);

    // Si existe, procedemos a eliminar
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.SPACES_BUCKET,
      Key: key
    });

    await s3.send(deleteCommand);

    res.json({ 
      mensaje: 'PDF eliminado correctamente',
      key
    });
    
  } catch (err) {
    if (err.name === 'NotFound') {
      return res.status(404).json({ error: 'El archivo PDF no fue encontrado' });
    }
    
    console.error('Error al eliminar PDF:', err);
    res.status(500).json({ 
      error: 'Error al eliminar PDF',
      detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Lista todos los PDFs en el bucket
 */
async function listarPDFs(req, res) {
  try {
    const { Contents } = await s3.send(new ListObjectsV2Command({
      Bucket: process.env.SPACES_BUCKET,
      Prefix: 'pdfs/' // Solo archivos en la carpeta pdfs
    }));

    if (!Contents || Contents.length === 0) {
      return res.json([]);
    }

    // Mapear a un array de objetos con información relevante
    const archivos = Contents.map(archivo => ({
      key: archivo.Key,
      nombre: archivo.Key.split('/').pop(),
      fecha: archivo.LastModified,
      tamaño: archivo.Size,
      url: `https://${process.env.SPACES_BUCKET}.${process.env.SPACES_REGION}.cdn.digitaloceanspaces.com/${archivo.Key}`
    }));

    res.json(archivos);
  } catch (err) {
    console.error('Error al listar PDFs:', err);
    res.status(500).json({ 
      error: 'Error al listar archivos PDF',
      detalles: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

module.exports = { 
  upload, 
  subirPDF, 
  obtenerPDF, 
  eliminarPDF,
  listarPDFs
};