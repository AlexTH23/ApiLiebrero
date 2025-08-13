const express = require('express')
const router = express.Router()
const librosController = require('../controllers/librosController')
const librosModel = require('../models/librosModel')

/**
 * @swagger
 * components:
 *   schemas:
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
 *           example: "Cien años de soledad"
 *         autor:
 *           type: string
 *           example: "Gabriel García Márquez"
 *         descripcion:
 *           type: string
 *           example: "Una historia multigeneracional en Macondo..."
 *         genero:
 *           type: string
 *           example: "Realismo mágico"
 *         idioma:
 *           type: string
 *           example: "Español"
 *         anoPublicacion:
 *           type: integer
 *           example: 1967
 *         portadaJSON:
 *           type: string
 *           example: "https://covers.openlibrary.org/b/id/8228691-L.jpg"
 *         archivoJSON:
 *           type: string
 *           example: "https://www.gutenberg.org/cache/epub/205/pg205.txt"
 */

/**
 * @swagger
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
 *       204:
 *         description: No se ha encontrado nada
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
 *       404:
 *         description: Error al guardar el libro
 */
router.post('/', librosController.crearLibro);

/**
 * @swagger
 * /libros/{key}/{value}:
 *   get:
 *     summary: Buscar libros por cualquier campo
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *         description: Campo por el cual buscar (ej: "titulo", "autor", "genero")
 *       - in: path
 *         name: value
 *         schema:
 *           type: string
 *         required: true
 *         description: Valor exacto del campo
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
 *         description: No se encontró ningún libro
 *       404:
 *         description: Error al buscar el libro
 */
router.get('/:key/:value', librosController.buscarLibro, librosController.mostrarLibro);

/**
 * @swagger
 * /libros/{key}/{value}:
 *   put:
 *     summary: Actualizar un libro por campo dinámico
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: value
 *         schema:
 *           type: string
 *         required: true
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
 *         description: Libro no encontrado o error
 */
router.put('/:key/:value', librosController.buscarLibro, librosController.actualizarLibro);

/**
 * @swagger
 * /libros/{key}/{value}:
 *   delete:
 *     summary: Eliminar un libro por campo dinámico
 *     tags: [Libros]
 *     parameters:
 *       - in: path
 *         name: key
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: value
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Libro eliminado correctamente
 *       404:
 *         description: Libro no encontrado o error
 */
router.delete('/:key/:value', librosController.buscarLibro, librosController.eliminarLibro);

module.exports = router;
