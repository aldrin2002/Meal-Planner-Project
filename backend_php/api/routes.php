<?php 
header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once './modules/api.php';
require_once './modules/global.php';
require_once './config/db_connection.php';

$api = new Api($mysqli);

$request = isset($_REQUEST['request']) ? explode('/', $_REQUEST['request']) : null;
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetRequest($request, $mysqli);
        break;
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        handlePostRequest($request, $mysqli, $data);
        break;
    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        handlePutRequest($request, $mysqli, $data);
        break;
    case 'DELETE':
        handleDeleteRequest($request, $mysqli);
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Method not available']);
        break;
}

function handleGetRequest($request, $mysqli) {
    if (!$request || empty($request[0])) {
        http_response_code(403);
        echo json_encode(['error' => 'Invalid request']);
        return;
    }

    switch ($request[0]) {
        case 'users':
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Resource not found']);
            break;
    }
}

function handlePostRequest($request, $mysqli, $data) {
    global $api;

    if (!$request || empty($request[0])) {
        http_response_code(403);
        echo json_encode(['error' => 'Invalid request']);
        return;
    }

    switch ($request[0]) {
        case 'register':
            echo json_encode($api->register($data['email'], $data['username'], $data['password']));
            break;
        case 'login':
            echo json_encode($api->login($data['email'], $data['password']));
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Resource not found']);
            break;
    }
}

function handlePutRequest($request, $mysqli, $data) {
    if (!$request || empty($request[0])) {
        http_response_code(403);
        echo json_encode(['error' => 'Invalid request']);
        return;
    }

    switch ($request[0]) {
        case 'updateProfile':
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Resource not found']);
            break;
    }
}

function handleDeleteRequest($request, $mysqli) {
    if (!$request || empty($request[0])) {
        http_response_code(403);
        echo json_encode(['error' => 'Invalid request']);
        return;
    }

    switch ($request[0]) {
        case 'deleteUser':
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Resource not found']);
            break;
    }
}

function sendResponse($response) {
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}
?>
