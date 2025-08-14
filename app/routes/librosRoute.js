const express = require('express')
const router = express.Router()
//controlador de joyas
const librosController = require('../controllers/librosController')
const librosModel = require('../models/librosModel')

/**
 * @swagger
 * components:
 *     Libro:
 *       type: object
 *       required:
 *         - titulo
 *         - autor
 *         - descripcion
 *         - genero
 *       properties:
 *         titulo:
 *           type: string
 *         autor:
 *           type: string
 *         descripcion:
 *           type: string
 *         genero:
 *           type: string
 *         idioma:
 *           type: string
 *         anoPublicacion:
 *           type: integer
 *         portadaJSON:
 *           type: string
 *         archivoJSON:
 *           type: string
 *         capitulos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Capitulo'
 *       example:
 *         titulo: Cien años de soledad
 *         autor: Gabriel García Márquez
 *         descripcion: Una historia multigeneracional en Macondo...
 *         genero: Realismo mágico
 *         idioma: Español
 *         anoPublicacion: 1967
 *         portadaJSON: https://ejemplo.com/portada.jpg
 *         archivoJSON: https://ejemplo.com/archivo.pdf
 *         capitulos:
 *           - numero: 1
 *             titulo: Capítulo 1
 *             contenido: Texto del capítulo...
 *
 * tags:
 *   - name: Libros
 *     description: Endpoints para gestionar libros
 */

/**
 * @swagger
 * /libros:
 *   get:
 *     summary: Obtener todos los libros
 *     tags: [Libros]
 *     responses:
 *       200:
 *         description: Lista de libros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Libro'
 */
router.get('/', librosController.obtenerLibros);

/**
 * @swagger
 * /libros:
 *   post:
 *     summary: Crear un nuevo libro
 *     tags: [Libros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       200:
 *         description: Libro creado exitosamente
 *       400:
 *         description: Error al guardar el libro
 */

router.post('/', librosController.crearLibro)

/**
 * @swagger
 * /libros/{key}/{value}:
 *   get:
 *     summary: Buscar libros por cualquier campo
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Campo por el cual buscar (por ejemplo, "titulo", "autor", "genero")
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Valor del campo a buscar (por ejemplo, "Cien años de soledad")
 *     responses:
 *       200:
 *         description: Libros encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 libros:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Libro'
 *       204:
 *         description: No se encontró ningún libro con los datos proporcionados
 *       404:
 *         description: Error al buscar el libro
 */

 .get('/:key/:value', librosController.buscarLibro, librosController.mostrarLibro)

 /**
  * @swagger
  * /libros/{key}/{value}:
  *   put:
  *     summary: Actualizar un libro encontrado por un campo dinámico
  *     tags: [Libros]
  *     parameters:
  *       - in: path
  *         name: key
  *         required: true
  *         schema:
  *           type: string
  *         description: Campo por el cual buscar
  *       - in: path
  *         name: value
  *         required: true
  *         schema:
  *           type: string
  *         description: Valor del campo
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Libro'
  *     responses:
  *       200:
  *         description: Libro actualizado
  *       404:
  *         description: Error al actualizar o libro no encontrado
  */
 
  .put('/:key/:value', librosController.buscarLibro, librosController.actualizarLibro)

  /**
   * @swagger
   * /libros/{key}/{value}:
   *   delete:
   *     summary: Eliminar un libro encontrado por un campo dinámico
   *     tags: [Libros]
   *     parameters:
   *       - in: path
   *         name: key
   *         required: true
   *         schema:
   *           type: string
   *         description: Campo por el cual buscar
   *       - in: path
   *         name: value
   *         required: true
   *         schema:
   *           type: string
   *         description: Valor del campo
   *     responses:
   *       200:
   *         description: Libro eliminado correctamente
   *       404:
   *         description: Error al eliminar o libro no encontrado
   */
  
  .delete('/:key/:value', librosController.buscarLibro, librosController.eliminarLibro);

/**
 * @swagger
 * /libros:
 *   get:
 *     summary: Obtener todos los libros (versión directa)
 *     description: Retorna todos los libros directamente desde la base de datos sin pasar por el controlador.
 *     tags: [Libros]
 *     responses:
 *       200:
 *         description: Lista de libros
 */
.get('/libros', async (req, res) => {
    try {
        const libros = await librosModel.find();
        res.json(libros);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

/**
 * @swagger
 * /libros:
 *   post:
 *     summary: Crear libro (versión directa)
 *     description: Guarda un nuevo libro directamente en la base de datos sin pasar por el controlador.
 *     tags: [Libros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Libro'
 *     responses:
 *       200:
 *         description: Libro creado
 */
.post('/libros', async (req, res) => {
    try {
        const nuevoLibro = new librosModel(req.body);
        const guardado = await nuevoLibro.save();
        res.json(guardado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

/**
 * @swagger
 * /libros/{titulo}/pdf:
 *   get:
 *     summary: Obtener PDF de un libro por título
 *     description: |
 *       Busca un libro por su título y devuelve el archivo PDF contenido en `archivoJSON` como respuesta binaria.
 *       - Si el libro o el PDF no existen, responde con **404**.
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: titulo
 *         required: true
 *         schema:
 *           type: string
 *         description: Título exacto del libro
 *     responses:
 *       200:
 *         description: Archivo PDF del libro
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: PDF no encontrado
 */
.get('/libros/:titulo/pdf', async (req, res) => {
    try {
        const libro = await librosModel.findOne({ titulo: req.params.titulo });
        if (!libro || !libro.archivoJSON) return res.status(404).send('PDF no encontrado');

        const base64Data = libro.archivoJSON.split(';base64,').pop();
        const pdfBuffer = Buffer.from(base64Data, 'base64');

        res.contentType("application/pdf");
        res.send(pdfBuffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports=router
