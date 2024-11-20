<?php
include 'db_connection.php';

$data = json_decode(file_get_contents("php://input"));
$title = $data->title;
$ingredients = $data->ingredients;
$user_id = $data->user_id;

$query = "INSERT INTO recipes (title, ingredients, user_id) VALUES ('$title', '$ingredients', '$user_id')";
if (mysqli_query($conn, $query)) {
    echo json_encode(["success" => "Recipe created successfully"]);
} else {
    echo json_encode(["error" => "Failed to create recipe"]);
}
?>
