<?php
header('Content-Type: application/json');
$username = htmlspecialchars($_POST['username']);
$password = htmlspecialchars($_POST['password']);

if (empty($username) || empty($password))
{
    echo json_encode(['success' => false, 'message' => 'Please enter username and password']);
    exit;
} else {
    $env = parse_ini_file(__DIR__ . '/.env');
    $mysqli = new mysqli($env['Db_Host'], $env['Db_User'], $env['Db_Password'], $env['Db_Name']);
    
    if ($mysqli->connect_error) {
        die(json_encode(['success' => false, 'message' => "Connection failed: " . $mysqli->connect_error]));
    }
    
    $stmt = $mysqli->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->bind_param('s', $username);
    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        if ($user) {
            if (password_verify($password, $user['user_password'])) {
                echo json_encode(['success' => true, 'message' => 'Login successful', 'user_id' => $user['id']]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid password']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'User does not exist']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Something went wrong']);
    }
    $stmt->close();
    $mysqli->close();
}
