const { correo, contrasena } = req.body;

User.findByUsername(correo, (err, results) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor' });
    if (results.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = results[0];

    if (contrasena !== user.contrasena) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: user.id, usuario: user.nombre, rol: user.rol }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });

    res.json({ token, usuario: { id: user.id, usuario: user.nombre, rol: user.rol } });
});
