<?php
class Categoria {
    private $conn;
    private $table_name = "categorias";

    public $id;
    public $nombre;
    public $descripcion;
    public $precio;

    public function __construct($db) {
        $this->conn = $db;
    }

    function obtenerCategorias() {
        $query = "SELECT id, nombre, descripcion, precio FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    function crearCategoria() {
        $query = "INSERT INTO " . $this->table_name . " SET nombre=:nombre, descripcion=:descripcion, precio=:precio";
        $stmt = $this->conn->prepare($query);

        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->precio = htmlspecialchars(strip_tags($this->precio));

        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":precio", $this->precio);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function obtenerCategoriaPorId() {
        $query = "SELECT id, nombre, descripcion, precio FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            $this->nombre = $row['nombre'];
            $this->descripcion = $row['descripcion'];
            $this->precio = $row['precio'];
            return true;
        }
        return false;
    }

    function actualizarCategoria() {
        $query = "UPDATE " . $this->table_name . " SET nombre=:nombre, descripcion=:descripcion, precio=:precio WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->nombre = htmlspecialchars(strip_tags($this->nombre));
        $this->descripcion = htmlspecialchars(strip_tags($this->descripcion));
        $this->precio = htmlspecialchars(strip_tags($this->precio));

        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":nombre", $this->nombre);
        $stmt->bindParam(":descripcion", $this->descripcion);
        $stmt->bindParam(":precio", $this->precio);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    function eliminarCategoria() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id=:id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));

        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?>