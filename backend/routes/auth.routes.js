const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'clave_secreta'; // Cambiar por una clave segura

// Login de usuario
router.post('/login', async (req, res) => {
    try {
        const { usuario, contraseña } = req.body;

        // Buscar usuario en la BD
        const [users] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        const user = users[0];

        // Comparar contraseña encriptada
        const validPassword = await bcrypt.compare(contraseña, user.contraseña);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar Token JWT
        const token = jwt.sign({ id: user.id, usuario: user.usuario, rol: user.rol }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token, usuario: user.usuario, rol: user.rol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;