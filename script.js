document.querySelector('.nav-bar-placeholder').innerHTML = `
    <nav class="navbar">
        <!-- logo -->
        <div class="nav-logo" onclick="window.location.href = 'index.html'">
            <img src="chesslogo.png" alt="Logo">
            <span>The Olouch Chess Foundation</span>
        </div>

        <!-- Hamburger Menu Button -->
        <button class="hamburger-menu" aria-label="Toggle navigation menu">
            <i class="fas fa-bars"></i>
        </button>

        <!-- Navigation Menu (will be toggled) -->
        <div class="nav-menu">
            <div class="nav-items">
                <!-- navigation links -->
                <ul class="nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="contact.html">Contact</a></li>
                    <li><a href="programs.html">Programs</a></li>
                    <li><a href="donate.html">Donate</a></li>
                </ul>
            </div>
            <!-- Auth buttons -->
            <div class="auth-buttons">
                <a href="signup.html" class="btn">Sign Up</a>
                <a href="login.html" class="btn">Login</a>
            </div>
            <div class="language-selector">
                <select id="language-select" class="btn">
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="es">Español</option>
                    <option value="de">Deutsch</option>
                    <option value="zh">中文</option>
                    <option value="ar">العربية</option>
                    <option value="pt">Português</option>
                    <option value="sw">Kiswahili</option>
                </select>
            </div>
        </div>
    </nav>
`;

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navMenu = document.querySelector('.nav-menu');

    // Toggle menu visibility on hamburger click
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked (useful for single-page apps or when navigating)
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Optional: Close the menu if clicked outside
    document.addEventListener('click', (event) => {
        if (!navMenu.contains(event.target) && !hamburger.contains(event.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
});

// on about page

// Make Sign Up button go to signup page
document.getElementById('signup-btn').onclick = function () {
    window.location.href = "signup.html";
};
// Make Login button go to login page (if you have a login.html, otherwise use signup.html for demo)
document.getElementById('login-btn').onclick = function () {
    window.location.href = "signup.html";
};

// Add a return button on signup and login pages
// This code assumes you have a button with id="return-btn" on those pages
// Example for signup.html and login.html:
// <button id="return-btn" class="btn">Return to About Us</button>
//
// Place this script on those pages:
if (document.getElementById('return-btn')) {
    document.getElementById('return-btn').onclick = function () {
        window.location.href = "about.html";
    };
}

