const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcrypt');

// 🔹 Registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        const { nombre, correo, usuario, contraseña, rol } = req.body;

        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // Insertar el nuevo usuario
        await pool.query(
            'INSERT INTO usuarios (nombre, correo, usuario, contraseña, rol) VALUES (?, ?, ?, ?, ?)',
            [nombre, correo, usuario, hashedPassword, rol]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
});

// 🔹 Obtener todos los usuarios (solo para admin en el futuro)
router.get('/', async (req, res) => {
    try {
        const [usuarios] = await pool.query('SELECT id, nombre, correo, usuario, rol FROM usuarios');
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
});

// 🔹 Obtener un usuario por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [usuario] = await pool.query('SELECT id, nombre, correo, usuario, rol FROM usuarios WHERE id = ?', [id]);

        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(usuario[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
});

// 🔹 Modificar datos de un usuario (ejemplo: cambiar nombre o rol)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, rol } = req.body;

        await pool.query('UPDATE usuarios SET nombre = ?, rol = ? WHERE id = ?', [nombre, rol, id]);

        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
});

// 🔹 Eliminar usuario
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el usuario' });
    }
});

// Ruta de login
router.post("/login", (req, res) => {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
        return res.status(400).json({ error: "Faltan datos" });
    }

    const query = "SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?";
    db.query(query, [correo, contrasena], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error en el servidor" });
        }
        if (results.length > 0) {
            res.json({ token: "TOKEN_FALSO_PARA_PRUEBAS" }); // generar un JWT real
        } else {
            res.status(401).json({ error: "Credenciales incorrectas" });
        }
    });
});

module.exports = router;