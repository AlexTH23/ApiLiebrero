const express = require('express');
const router = express.Router();
const { registro, login } = require('../controllers/autentificacionController');
const autenticar = require('../config/autentificacionTokens');

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
 *           example: Juan
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *           example: Pérez
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico único
 *           example: juanperez@gmail.com
 *         telefono:
 *           type: string
 *           description: Número de teléfono del usuario
 *           example: 5522334455
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña (mínimo 6 caracteres)
 *           example: 12345678
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación del usuario
 *           example: 2025-07-29T12:00:00Z

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
 *   name: Autenticación
 *   description: Endpoints para registro, login y perfil protegido
 */

/**
 * @swagger
 * /registro:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       409:
 *         description: Email ya registrado
 *       404:
 *         description: Error en el registro
 */

router.post('/registro', registro);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión y obtener token
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       404:
 *         description: Credenciales inválidas o error en login
 */
router.post('/login', login);

/**
 * @swagger
 * /perfil:
 *   get:
 *     summary: Obtener perfil protegido con token
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil protegido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PerfilResponse'
 *       401:
 *         description: Token inválido o no enviado
 */
router.get('/perfil', autenticar, (req, res) => {
    res.json({ 
        mensaje: "Perfil protegido",
        usuario: req.usuario // Datos del token
    });
});
module.exports = router;