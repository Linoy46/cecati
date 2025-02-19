const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = 'clave_secreta'; // Cambiar por una clave segura

// Obtener usuarios
router.get("/", async (req, res) => {
    try {
        const [users] = await pool.query("SELECT id, correo, rol FROM usuarios");
        res.json(users);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

// Registrar usuario
router.post("/register", async (req, res) => {
    try {
        const { correo, contrasena, rol } = req.body;
        if (!correo || !contrasena) {
            return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
        }
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        await pool.query("INSERT INTO usuarios (correo, contrasena, rol) VALUES (?, ?, ?)", 
            [correo, hashedPassword, rol]);
        res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

// Eliminar usuario
router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }
        res.json({ mensaje: "Usuario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

module.exports = router;