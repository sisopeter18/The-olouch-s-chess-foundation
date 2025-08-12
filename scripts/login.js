document.querySelector('.login-form-placeholder').innerHTML = `
    <form id="account-login-form">
                <button type="button" class="back-btn" onclick="goBack()">Back</button>
                <h2>Login</h2>
                <label for="username">Username:</label>
                <input type="text" name="username" placeholder="Username"><br>
                <label for="password">Password:</label>
                <input type="password" name="password" placeholder="Password"><br>
                <button type="submit" class="login-btn">Login</button>
            </form>
    `;

function goBack() {
    window.history.back();
}

let loginForm = document.querySelector('#account-login-form');
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    let username = loginForm.username.value.trim();
    let password = loginForm.password.value.trim();
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Send login request to the server via ajax
    const loginData = new FormData(loginForm);

    $.ajax({
        url: 'server/login.php',
        type: 'POST',
        data: loginData,
        processData: false,
        contentType: false,
        dataType: 'json',
        // beforeSend: function () {
        //     showLoader();
        // },
        success: function (response) {
            if (response.success) {
                alert(response.message);
                window.location.href = 'server/dashboard.php';
            } else {
                alert(response.message);
            }
        },
        error: function (xhr, status, error) {
            // Handle error
            alert('Error: ' + error);
            console.error('Error:', error);
        },
        // complete: function () {
        //     hideLoader();
        // }
    });
});