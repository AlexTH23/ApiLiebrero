const express = require('express')
const router = express.Router()
//controlador de joyas
const librosController = require('../controllers/librosController')
/**
 * @swagger
 * components:
 *   schemas:
 *     Capitulo:
 *       type: object
 *       properties:
 *         numero:
 *           type: integer
 *         titulo:
 *           type: string
 *         contenido:
 *           type: string
 *
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

module.exports=router