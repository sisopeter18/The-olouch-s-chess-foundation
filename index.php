<?php
session_start();
if (isset($_SESSION['username'])) {
    $user = $_SESSION['username'];
};
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Olouch Chess Foundation</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- logo link -->
    <link rel="shortcut icon" type="image/x-icon" href="images/chesslogo.png">
</head>

<body>
    <!-- Header & Navigation -->
    <header>
        <div class="navbar-placeholder"></div>
    </header>
    <div class="account-info">
        <?php
            if(isset($_SESSION['username'])) {
                echo "Hello, " . $user . "&nbsp;<button onclick='window.location.href=`server/logout.php`'>Logout</button>";
            }
        ?>
    </div>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-bg-slider">
            <img src="images/chessboard.png" class="hero-bg-slide active" alt="Chess Hero 1">
            <img src="images/chessphoto.png" class="hero-bg-slide" alt="Chess Hero 2">
            <img src="images/chesschampions.png" class="hero-bg-slide" alt="Chess Hero 3">
            <!-- Add more images as needed -->
        </div>
        <div class="hero-content">
            <h2>Empowering Minds Through Chess</h2>
            <p>Join us in promoting chess education, strategy, and community growth.</p>
            <a href="donate.html" class="btn">Support Our Mission</a>
        </div>
    </section>
    <!-- Footer -->
    <footer>
        <div class="social-links">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
        </div>
        <p>&copy; 2025 The Olouch Chess Foundation. All rights reserved.</p>
    </footer>

    <script type="module" src="scripts/scripts.js"></script>
</body>

</html>