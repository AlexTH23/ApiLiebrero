const Usuario = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const usuario = new Usuario({ nombre, email, password: hashedPassword });

        await usuario.save();

        res.json({ mensaje: "Usuario registrado", usuario });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al registrar", error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const valido = await bcrypt.compare(password, usuario.password);
        if (!valido) {
            return res.status(401).json({ mensaje: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
  { 
    userId: usuario._id,  // ¡Usa el _id de MongoDB!
    email: usuario.email  // Opcional: añade más datos si los necesitas
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }  // Ajusta el tiempo de expiración
);

        res.json({ mensaje: "Login exitoso", token });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });
    }
};
