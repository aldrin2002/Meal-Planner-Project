<?php
include 'db_connection.php';

$user_id = $_GET['user_id'];

$query = "SELECT * FROM recipes WHERE user_id = '$user_id'";
$result = mysqli_query($conn, $query);

if (mysqli_num_rows($result) > 0) {
    $recipes = mysqli_fetch_all($result, MYSQLI_ASSOC);
    echo json_encode(["success" => "Recipes fetched successfully", "data" => $recipes]);
} else {
    echo json_encode(["error" => "No recipes found"]);
}
?>
