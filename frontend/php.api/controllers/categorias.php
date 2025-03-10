<?php
require_once '../cors.php';
require_once '../config/database.php';
include_once '../models/Categoria.php';

$database = new Database();
$db = $database->getConnection();

$categoria = new Categoria($db);

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        $stmt = $categoria->obtenerCategorias();
        $num = $stmt->rowCount();

        if ($num > 0) {
            $categorias_arr = array();
            $categorias_arr["categorias"] = array();

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                extract($row);
                $categoria_item = array(
                    "id" => $id,
                    "nombre" => $nombre,
                    "descripcion" => $descripcion,
                    "precio" => $precio
                );
                array_push($categorias_arr["categorias"], $categoria_item);
            }
            http_response_code(200);
            echo json_encode($categorias_arr);
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "No se encontraron categorías."));
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        $categoria->nombre = $data->nombre;
        $categoria->descripcion = $data->descripcion;
        $categoria->precio = $data->precio;

        if ($categoria->crearCategoria()) {
            http_response_code(201);
            echo json_encode(array("message" => "Categoría creada."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "No se pudo crear la categoría."));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        $categoria->id = $data->id;
        $categoria->nombre = $data->nombre;
        $categoria->descripcion = $data->descripcion;
        $categoria->precio = $data->precio;

        if ($categoria->actualizarCategoria()) {
            http_response_code(200);
            echo json_encode(array("message" => "Categoría actualizada."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "No se pudo actualizar la categoría."));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        $categoria->id = $data->id;

        if ($categoria->eliminarCategoria()) {
            http_response_code(200);
            echo json_encode(array("message" => "Categoría eliminada."));
        } else {
            http_response_code(503);
            echo json_encode(array("message" => "No se pudo eliminar la categoría."));
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(array("message" => "Método no permitido."));
        break;
}
?>