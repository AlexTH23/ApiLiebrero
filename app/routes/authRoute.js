const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UsuarioModel = require('../models/usuarioModel'); // tu modelo real

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_123';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24H';
const JWT_ISSUER = process.env.JWT_ISSUER || 'LIEBRERA';

//Registro
router.post('/registro', async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, password } = req.body;

    if (!nombre || !apellido || !email || !telefono || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Evitar email duplicado
    const existe = await UsuarioModel.findOne({ email });
    if (existe) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new UsuarioModel({
      nombre,
      apellido,
      email,
      telefono,
      password: hashedPassword
    });

    await nuevoUsuario.save();
    return res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    return res.status(500).json({ message: 'Error al registrar', error: err.message });
  }
});

//Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    const user = await UsuarioModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { sub: user._id.toString(), nombre: user.nombre, apellido: user.apellido },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES, issuer: JWT_ISSUER }
    );

    return res.json({
      token,
      expiresIn: JWT_EXPIRES,
      user: {
        id: user._id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        telefono: user.telefono
      }
    });
  } catch (err) {
    return res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
});

module.exports = router;
