<?php
class Usuario {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function obtenerUsuarios() {
        $query = "SELECT id, nombre, correo, rol FROM usuarios";
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function crearUsuario($nombre, $correo, $contrasena, $rol) {
        $query = "INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (:nombre, :correo, :contrasena, :rol)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':correo', $correo);
        $stmt->bindParam(':contrasena', $contrasena);
        $stmt->bindParam(':rol', $rol);
        return $stmt->execute();
    }

    public function obtenerUsuarioPorId($id) {
        $query = "SELECT id, nombre, correo, rol FROM usuarios WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function actualizarUsuario($id, $nombre, $correo, $rol) {
        $query = "UPDATE usuarios SET nombre = :nombre, correo = :correo, rol = :rol WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->bindParam(':nombre', $nombre);
        $stmt->bindParam(':correo', $correo);
        $stmt->bindParam(':rol', $rol);
        return $stmt->execute();
    }

    public function eliminarUsuario($id) {
        $query = "DELETE FROM usuarios WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }

    public function obtenerCategoriasUsuario($id) {
        $query = "SELECT c.nombre FROM categorias c JOIN usuario_categoria uc ON c.id = uc.categoria_id WHERE uc.usuario_id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function agregarCategoriaUsuario($usuarioId, $categoriaId) {
        $query = "INSERT INTO usuario_categoria (usuario_id, categoria_id) VALUES (:usuarioId, :categoriaId)";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':usuarioId', $usuarioId);
        $stmt->bindParam(':categoriaId', $categoriaId);
        return $stmt->execute();
    }

    public function eliminarCategoriaUsuario($usuarioId, $categoriaId) {
        $query = "DELETE FROM usuario_categoria WHERE usuario_id = :usuarioId AND categoria_id = :categoriaId";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':usuarioId', $usuarioId);
        $stmt->bindParam(':categoriaId', $categoriaId);
        return $stmt->execute();
    }

    public function eliminarCategoriasUsuario($usuarioId) {
        $query = "DELETE FROM usuario_categoria WHERE usuario_id = :usuarioId";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':usuarioId', $usuarioId);
        return $stmt->execute();
    }

    public function agregarCursoUsuario($usuarioId, $cursoId) {
        try {
            $query = "INSERT INTO usuario_curso (usuario_id, curso_id) VALUES (:usuarioId, :cursoId)";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':usuarioId', $usuarioId);
            $stmt->bindParam(':cursoId', $cursoId);
            $stmt->execute();
            return true; // Éxito
        } catch (PDOException $e) {
            error_log("Error en agregarCursoUsuario: " . $e->getMessage());
            return false; // Error al insertar
        }
    }

    public function eliminarCursoUsuario($usuarioId, $cursoId) {
        $query = "DELETE FROM usuario_curso WHERE usuario_id = :usuarioId AND curso_id = :cursoId";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':usuarioId', $usuarioId);
        $stmt->bindParam(':cursoId', $cursoId);
        return $stmt->execute();
    }

    public function eliminarCursosUsuario($usuarioId) {
        $query = "DELETE FROM usuario_curso WHERE usuario_id = :usuarioId";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':usuarioId', $usuarioId);
        return $stmt->execute();
    }

    public function obtenerTodasCategorias() {
        $query = "SELECT id, nombre FROM categorias";
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerCursosUsuario($usuarioId) {
        $query = "SELECT c.nombre FROM cursos c INNER JOIN usuario_curso uc ON c.id = uc.curso_id WHERE uc.usuario_id = :usuarioId";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':usuarioId', $usuarioId);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerTodosCursos() {
        $query = "SELECT id, nombre FROM cursos";
        $stmt = $this->conn->query($query);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerCategoriaIdPorNombre($categoriaNombre) {
        $query = "SELECT id FROM categorias WHERE nombre = :nombre";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':nombre', $categoriaNombre);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            return $result['id'];
        } else {
            return null;
        }
    }

    public function obtenerCursoIdPorNombre($cursoNombre) {
        $query = "SELECT id FROM cursos WHERE nombre = :nombre";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':nombre', $cursoNombre);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($result) {
            return $result['id'];
        } else {
            return null;
        }
    }
}
?>