const bcrypt = require("bcrypt");
const db = require("./config/db"); // Asegúrate de que este archivo tenga la conexión a la BD

async function actualizarContrasenas() {
    try {
        const [usuarios] = await db.query("SELECT id, contrasena FROM usuarios");

        for (const usuario of usuarios) {
            if (!usuario.contrasena.startsWith("$2b$")) { // Verifica si ya está encriptada
                const hashedPassword = await bcrypt.hash(usuario.contrasena, 10);
                await db.query("UPDATE usuarios SET contrasena = ? WHERE id = ?", [hashedPassword, usuario.id]);
                console.log(`Contraseña actualizada para usuario ID: ${usuario.id}`);
            }
        }

        console.log("Todas las contraseñas han sido encriptadas correctamente.");
    } catch (error) {
        console.error("Error al actualizar contraseñas:", error);
    } finally {
        db.end(); // Cierra la conexión con la base de datos
    }
}

actualizarContrasenas();
