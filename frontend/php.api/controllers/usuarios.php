<?php
require_once '../cors.php';
require_once '../config/database.php';
require_once '../models/Usuario.php';

$usuario = new Usuario($db);

$action = isset($_GET['action']) ? $_GET['action'] : '';

switch ($action) {
    case 'listar':
        listarUsuarios($usuario);
        break;
    case 'crear':
        crearUsuario($usuario);
        break;
    case 'obtener':
        obtenerUsuario($usuario);
        break;
    case 'actualizar':
        actualizarUsuario($usuario);
        break;
    case 'eliminar':
        eliminarUsuario($usuario);
        break;
    case 'categorias':
        manejarCategoriasUsuario($usuario);
        break;
    case 'cursos':
        manejarCursosUsuario($usuario);
        break;
    case 'obtenerCategorias':
        obtenerTodasCategorias($usuario);
        break;
    case 'obtenerCursos':
        obtenerTodosCursos($usuario);
        break;
    default:
        echo json_encode(['error' => 'Acción no válida']);
        break;
}

function listarUsuarios($usuario) {
    $usuarios = $usuario->obtenerUsuarios();
    echo json_encode($usuarios);
}

function crearUsuario($usuario) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->nombre, $data->correo, $data->contrasena, $data->rol)) {
        $resultado = $usuario->crearUsuario($data->nombre, $data->correo, $data->contrasena, $data->rol);
        echo json_encode(['success' => $resultado]);
    } else {
        echo json_encode(['error' => 'Datos incompletos']);
    }
}

function obtenerUsuario($usuario) {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if ($id) {
        $usuarioData = $usuario->obtenerUsuarioPorId($id);
        echo json_encode($usuarioData);
    } else {
        echo json_encode(['error' => 'ID no proporcionado']);
    }
}

function actualizarUsuario($usuario) {
    $data = json_decode(file_get_contents("php://input"));
    if (isset($data->id, $data->nombre, $data->correo, $data->rol)) {
        $resultado = $usuario->actualizarUsuario($data->id, $data->nombre, $data->correo, $data->rol);
        echo json_encode(['success' => $resultado]);
    } else {
        echo json_encode(['error' => 'Datos incompletos']);
    }
}

function eliminarUsuario($usuario) {
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    if ($id) {
        $resultado = $usuario->eliminarUsuario($id);
        echo json_encode(['success' => $resultado]);
    } else {
        echo json_encode(['error' => 'ID no proporcionado']);
    }
}

function manejarCategoriasUsuario($usuario) {
    $subAction = isset($_GET['subAction']) ? $_GET['subAction'] : '';
    $usuarioId = isset($_GET['usuarioId']) ? $_GET['usuarioId'] : null;
    $categoriaId = isset($_GET['categoriaId']) ? $_GET['categoriaId'] : null;
    $categoriaName = isset($_GET['categoriaName']) ? $_GET['categoriaName'] : null;

    if (!$usuarioId) {
        echo json_encode(['error' => 'ID de usuario no proporcionado']);
        return;
    }

    switch ($subAction) {
        case 'listar':
            $categorias = $usuario->obtenerCategoriasUsuario($usuarioId);
            echo json_encode($categorias);
            break;
        case 'agregar':
            if ($categoriaId) {
                $resultado = $usuario->agregarCategoriaUsuario($usuarioId, $categoriaId);
                echo json_encode(['success' => $resultado]);
            } elseif ($categoriaName) {
                $categoriaId = $usuario->obtenerCategoriaIdPorNombre($categoriaName);
                if ($categoriaId) {
                    $resultado = $usuario->agregarCategoriaUsuario($usuarioId, $categoriaId);
                    echo json_encode(['success' => $resultado]);
                } else {
                    echo json_encode(['error' => 'Nombre de categoría no encontrado']);
                }
            } else {
                echo json_encode(['error' => 'ID o Nombre de categoría no proporcionado']);
            }
            break;
        case 'eliminar':
            if ($categoriaId) {
                $resultado = $usuario->eliminarCategoriaUsuario($usuarioId, $categoriaId);
                echo json_encode(['success' => $resultado]);
            } elseif ($categoriaName) {
                $categoriaId = $usuario->obtenerCategoriaIdPorNombre($categoriaName);
                if ($categoriaId) {
                    $resultado = $usuario->eliminarCategoriaUsuario($usuarioId, $categoriaId);
                    echo json_encode(['success' => $resultado]);
                } else {
                    echo json_encode(['error' => 'Nombre de categoría no encontrado']);
                }
            } else {
                echo json_encode(['error' => 'ID o nombre de categoría no proporcionado']);
            }
            break;
        case 'eliminarTodas':
            $resultado = $usuario->eliminarCategoriasUsuario($usuarioId);
            echo json_encode(['success' => $resultado]);
            break;
        default:
            echo json_encode(['error' => 'Subacción no válida']);
            break;
    }
}

function manejarCursosUsuario($usuario) {
    $subAction = isset($_GET['subAction']) ? $_GET['subAction'] : '';
    $usuarioId = isset($_GET['usuarioId']) ? $_GET['usuarioId'] : null;
    $cursoId = isset($_GET['cursoId']) ? $_GET['cursoId'] : null;
    $cursoNombre = isset($_GET['cursoNombre']) ? $_GET['cursoNombre'] : null;

    if (!$usuarioId) {
        echo json_encode(['error' => 'ID de usuario no proporcionado']);
        return;
    }

    switch ($subAction) {
        case 'listar':
            $cursos = $usuario->obtenerCursosUsuario($usuarioId);
            echo json_encode($cursos);
            break;
        case 'agregar':
            if ($cursoId) {
                $resultado = $usuario->agregarCursoUsuario($usuarioId, $cursoId);
                echo json_encode(['success' => $resultado]);
            } elseif ($cursoNombre) {
                $cursoId = $usuario->obtenerCursoIdPorNombre($cursoNombre);
                if ($cursoId) {
                    $resultado = $usuario->agregarCursoUsuario($usuarioId, $cursoId);
                    echo json_encode(['success' => $resultado]);
                } else {
                    echo json_encode(['error' => 'Nombre de curso no encontrado']);
                }
            } else {
                echo json_encode(['error' => 'ID o Nombre de curso no proporcionado']);
            }
            break;
        case 'eliminar':
            if ($cursoId) {
                $resultado = $usuario->eliminarCursoUsuario($usuarioId, $cursoId);
                echo json_encode(['success' => $resultado]);
            } elseif ($cursoNombre) {
                $cursoId = $usuario->obtenerCursoIdPorNombre($cursoNombre);
                if ($cursoId) {
                    $resultado = $usuario->eliminarCursoUsuario($usuarioId, $cursoId);
                    echo json_encode(['success' => $resultado]);
                } else {
                    echo json_encode(['error' => 'Nombre de curso no encontrado']);
                }
            } else {
                echo json_encode(['error' => 'ID o nombre de curso no proporcionado']);
            }
            break;
        case 'eliminarTodos':
            $resultado = $usuario->eliminarCursosUsuario($usuarioId);
            echo json_encode(['success' => $resultado]);
            break;
        default:
            echo json_encode(['error' => 'Subacción no válida']);
            break;
    }
}

function obtenerTodasCategorias($usuario) {
    $categorias = $usuario->obtenerTodasCategorias();
    echo json_encode($categorias);
}

function obtenerTodosCursos($usuario) {
    $cursos = $usuario->obtenerTodosCursos();
    echo json_encode($cursos);
}
?>