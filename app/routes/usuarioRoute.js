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

 *     LoginResponse:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Sesión iniciada
 *         token:
 *           type: string
 *           description: JWT para autenticar otras rutas

 *     PerfilResponse:
 *       type: object
 *       properties:
 *         mensaje:
 *           type: string
 *           example: Perfil protegido
 *         usuario:
 *           type: object
 *           description: Datos del usuario extraídos del token
 */

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para CRUD de usuarios
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Obtener todos los usuarios (liebreros)
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
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