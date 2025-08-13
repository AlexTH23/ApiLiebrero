const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - email
 *         - telefono
 *         - password
 *       properties:
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         telefono:
 *           type: string
 *           description: Número telefónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario (mínimo 6 caracteres)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación automática
 *       example:
 *         nombre: Juan
 *         apellido: Pérez
 *         email: juan.perez@gmail.com
 *         telefono: "5551234567"
 *         password: 12345678
 *
 * tags:
 *   - name: Usuarios
 *     description: Endpoints para CRUD de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     description: |
 *       Retorna todos los usuarios registrados en la base de datos.
 *       - Si existen usuarios, devuelve **200** con un array de usuarios.
 *       - Si no hay registros, devuelve **204**.
 *       - Si ocurre un error en la consulta, devuelve **404**.
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       204:
 *         description: No hay usuarios para mostrar
 *       404:
 *         description: Error al consultar los usuarios
 */
router.get('/', usuariosController.buscarTodo)

/**
 * @swagger
 * /usuarios/{key}/{value}:
 *   get:
 *     summary: Buscar un usuario por cualquier campo
 *     description: |
 *       Busca un usuario filtrando por un campo (`key`) y un valor (`value`) exactos.
 *       - Realiza búsqueda exacta sin importar mayúsculas/minúsculas.
 *       - Si encuentra el usuario, devuelve **200** con los datos.
 *       - Si no encuentra resultados, devuelve **204**.
 *       - Si ocurre un error, devuelve **404**.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Campo por el cual se desea buscar (ej. email, nombre)
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Valor del campo a buscar
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuario:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Usuario'
 *       204:
 *         description: No se encontró el usuario
 *       404:
 *         description: Error al buscar el usuario
 */
router.get('/:key/:value', usuariosController.buscarUsuario, usuariosController.mostrarUsuario)

/**
 * @swagger
 * /usuarios/{key}/{value}:
 *   delete:
 *     summary: Eliminar un usuario por cualquier campo
 *     description: |
 *       Elimina un usuario que coincida con el campo (`key`) y el valor (`value`).
 *       - Si el usuario existe, lo elimina y devuelve **200**.
 *       - Si no existe, devuelve igualmente **200** pero no elimina nada.
 *       - Si ocurre un error durante la eliminación, devuelve **404**.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Campo del usuario a buscar
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Valor del campo a buscar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Error al eliminar usuario
 */
router.delete('/:key/:value', usuariosController.buscarUsuario, usuariosController.eliminarUsuario)

/**
 * @swagger
 * /usuarios/{key}/{value}:
 *   put:
 *     summary: Actualizar un usuario por cualquier campo
 *     description: |
 *       Actualiza un usuario que coincida con el campo (`key`) y el valor (`value`).
 *       - Requiere que el usuario exista previamente (buscado con `buscarUsuario`).
 *       - Si el usuario existe, actualiza los datos enviados en el cuerpo.
 *       - Si no hay usuario que actualizar, devuelve **404**.
 *       - Si ocurre un error, devuelve **404** con mensaje.
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *         description: Campo del usuario a buscar
 *       - in: path
 *         name: value
 *         required: true
 *         schema:
 *           type: string
 *         description: Valor del campo a buscar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Error al actualizar usuario
 */
router.put('/:key/:value', usuariosController.buscarUsuario, usuariosController.usuarioActualizar)

module.exports = router;
