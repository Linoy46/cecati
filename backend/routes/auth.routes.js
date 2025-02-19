const express = require('express'); 
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'clave_secreta'; // por cambiar

// Login
router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body; // Asegúrate de que "contrasena" está bien escrito

        // Buscar usuario en la BD por correo
        const [users] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);

        if (users.length === 0) {
            return res.status(401).json({ message: 'Correo no encontrado' });
        }

        const user = users[0];

        // Comparar contraseña encriptada
        const validPassword = await bcrypt.compare(contrasena, user.contrasena); // Aquí estaba el error
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar Token JWT
        const token = jwt.sign({ id: user.id, correo: user.correo, rol: user.rol }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token, correo: user.correo, rol: user.rol });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
