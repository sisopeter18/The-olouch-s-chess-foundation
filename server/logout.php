<?php
// logout.php
session_start();

// Prevent caching
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Expires: 0");

// Clear all session variables
$_SESSION = array();

// If using cookies, remove the session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Destroy the session
session_destroy();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logout</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        #countdown {
            font-weight: bold;
            color: red;
        }
    </style>
    <script>
        let seconds = 3; // countdown start
        function updateCountdown() {
            document.getElementById('countdown').textContent = seconds;
            if (seconds <= 0) {
                window.location.href = "../index.php";
            } else {
                seconds--;
                setTimeout(updateCountdown, 1000);
            }
        }
        window.onload = updateCountdown;
    </script>
</head>
<body>
    <h2>You have been logged out.</h2>
    <p>Redirecting in <span id="countdown">3</span> seconds...</p>
</body>
</html>