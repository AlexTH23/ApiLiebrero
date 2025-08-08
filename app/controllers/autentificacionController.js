const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usuarioModel = require('../models/usuarioModel');

exports.registro = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuarioExistente = await usuarioModel.findOne({ email });
        if (usuarioExistente) return res.status(409).send({ mensaje: 'Email ya registrado' });

        const hash = await bcrypt.hash(password, 10);
        const usuario = await usuarioModel.create({ ...req.body, password: hash });

        res.status(201).send({ mensaje: 'Usuario registrado', usuario: { id: usuario._id, email } });
    } catch (error) {
        res.status(404).send({ mensaje: 'Error en el registro' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await usuarioModel.findOne({ email });
        if (!usuario) return res.status(404).send({ mensaje: 'Credenciales inválidas' });

        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) return res.status(404).send({ mensaje: 'Credenciales inválidas' });

        const token = jwt.sign(
            { id: usuario._id, email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).send({ mensaje: 'Sesión iniciada', token });
    } catch (error) {
        res.status(404).send({ mensaje: 'Error en el login' });
    }
};