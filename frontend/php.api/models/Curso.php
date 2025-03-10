<?php
class Curso {
    private $conn;
    private $table_name = "cursos";

    public $id;
    public $nombre;
    public $categoria_id;
    public $duracion_horas;
    public $hora_inicio;
    public $hora_termino;

    public function __construct($db) {
        $this->conn = $db;
    }

    function obtenerCursos() {
        $query = "SELECT id, nombre, categoria_id, duracion_horas, hora_inicio, hora_termino FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function crearCurso() {
        $query = "INSERT INTO " . $this->table_name . " SET nombre=:nombre, categoria_id=:categoria_id, duracion_horas=:duracion_horas, hora_inicio=:hora_inicio, hora_termino=:hora_termino";
        $stmt = $this->conn->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->categoria_id = htmlspecialchars(strip_tags($this->categoria_id));
        $this->duracion_horas = htmlspecialchars(strip_tags($this->duracion_horas));
        $this->hora_inicio = htmlspecialchars(strip_tags($this->hora_inicio));
        $this->hora_termino = htmlspecialchars(strip_tags($this->hora_termino));

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":categoria_id", $this->categoria_id);
        $stmt->bindParam(":duracion_horas", $this->duracion_horas);
        $stmt->bindParam(":hora_inicio", $this->hora_inicio);
        $stmt->bindParam(":hora_termino", $this->hora_termino);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function obtenerCursoPorId() {
        $query = "SELECT id, nombre, categoria_id, duracion_horas, hora_inicio, hora_termino FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->nombre = $row['nombre'];
            $this->categoria_id = $row['categoria_id'];
            $this->duracion_horas = $row['duracion_horas'];
            $this->hora_inicio = $row['hora_inicio'];
            $this->hora_termino = $row['hora_termino'];
            return true;
        }
        return false;
    }

    function actualizarCurso() {
        $query = "UPDATE " . $this->table_name . " SET nombre=:nombre, categoria_id=:categoria_id, duracion_horas=:duracion_horas, hora_inicio=:hora_inicio, hora_termino=:hora_termino WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->categoria_id = htmlspecialchars(strip_tags($this->categoria_id));
        $this->duracion_horas = htmlspecialchars(strip_tags($this->duracion_horas));
        $this->hora_inicio = htmlspecialchars(strip_tags($this->hora_inicio));
        $this->hora_termino = htmlspecialchars(strip_tags($this->hora_termino));

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":categoria_id", $this->categoria_id);
        $stmt->bindParam(":duracion_horas", $this->duracion_horas);
        $stmt->bindParam(":hora_inicio", $this->hora_inicio);
        $stmt->bindParam(":hora_termino", $this->hora_termino);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function eliminarCurso() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function obtenerCursosPorCategoria() {
        $query = "SELECT id, nombre, categoria_id, duracion_horas, hora_inicio, hora_termino FROM " . $this->table_name . " WHERE categoria_id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->categoria_id);
        $stmt->execute();
        return $stmt;
    }
}
?>