<?php
// start the session
session_start();

header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

// db connection details
$env = parse_ini_file(__DIR__ . '/.env');
$db_host = $env['Db_Host'];
$db_user = $env['Db_User'];
$db_pass = $env['Db_Password'];
$db_name = $env['Db_Name'];

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = htmlspecialchars($_POST['username']);
    $password = htmlspecialchars($_POST['password']);

    if (empty($username) || empty($password)) {
        $error_message = "Please enter both username and password.";
    } else {
        $sql = "SELECT * FROM users WHERE user_name = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['user_password'])) {
                // set session variables
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['username'] = $user['user_name'];
                header("Location: ../index.php");
                exit();
            } else {
                $error_message =  "Wrong password.";
            }
        } else {
            $error_message =  "Username does not exist.";
        }

        $stmt->close();
        $conn->close();
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <h1 class="login-page-title">Login to your account</h1>
    <?php if (isset($error_message)) { ?>
        <p style="color: red; font-size: 14px; margin-top: 10px; padding: 5px; border-radius: 5px; background-color: #f8d7da; display: flex; justify-content: center; align-items: center;"><?php echo $error_message; ?></p>
    <?php } ?>
    <form id="account-login-form" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="POST">
        <button type="button" class="back-btn" onclick="window.history.back()">Back</button>
        <h2>Login</h2>
        <label for="username">Username:</label>
        <input type="text" name="username" placeholder="Username" required>
        <label for="password">Password:</label>
        <input type="password" name="password" placeholder="Password" required>
        <button type="submit" class="login-btn">Login</button>
        <a href="../signup.html">Register</a>
    </form>
</body>
</html>