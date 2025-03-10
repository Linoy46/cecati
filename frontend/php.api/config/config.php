<?php
header("Access-Control-Allow-Origin: *"); // Permitir CORS (¡Importante para desarrollo!)
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Si es una petición OPTIONS, termina aquí.  Es parte del pre-flight de CORS.
 if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
 }

$host = "localhost"; // O tu host de base de datos
$db_name = "cecati"; // Nombre de tu base de datos
$username = "root"; // Tu usuario de MySQL
$password = ""; // Tu contraseña de MySQL
$conn = null;

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name, $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conn->exec("SET NAMES utf8"); // ¡Importante para manejar caracteres especiales!
} catch (PDOException $exception) {
    echo "Error de conexión: " . $exception->getMessage();
    exit; // Termina el script si hay un error de conexión.
}
?>