document.querySelector('.form-placeholder').innerHTML = `

        <form id="account-signup-form">
            <h3>Create Account</h3>
            <label for="fullname">Name:</label>
            <input type="text" name="fullname" placeholder="Full Name" required>
            <label for="username">username:</label>
            <input type="text" name="username" placeholder="username" required>
            <label for="email">Email:</label>
            <input type="email" name="email" placeholder="Email" required>
            <label for="password">Password:</label>
            <input type="password" name="password" placeholder="Password" required>
            <label for="confirm-password">Confirm Password:</label>
            <input type="password" name="confirmpassword" placeholder="Confirm Password" required>
            <label for="dob">Date of Birth:</label>
            <input type="date" name="dob" placeholder="Date of Birth" required>
            <select name="gender" required>
                <option value="" disabled selected>Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
            </select>
            <select name="level" id="level-select" required>
                <option value="" disabled selected>Level of Education</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Tertiary">UNIVERSITY/COLLEGE</option>
                <option value="not-student">Not a Student</option>
            </select>
            <input type="text" name="school" id="school-input" class="hidden" placeholder="School Name (if student)">
            <label for="phone">Phone Number:</label>
            <input type="tel" name="phone" placeholder="Phone Number" required>
            <div class="terms-container">
            <input type="checkbox" name="terms" required>
            <label for="terms">I accept the <a href="terms.html">Terms and Conditions</a></label>
            </div>
            <button type="submit" class="btn">Sign Up</button>
            <button type="button" class="btn" id="close-signup-modal" onclick="closeSignupModal()">Cancel</button>
            <a href="server/login.php">Go to Login</a>
        </form>
`;
function closeSignupModal() {
    window.location.href = 'index.php';
}
const signupForm = document.querySelector('#account-signup-form');

const levelSelect = signupForm.level;
const schoolInput = signupForm.school;

let signupData;
// Show school input if level is not "Adult"
levelSelect.addEventListener('change', function () {
    if (levelSelect.value !== 'not-student') {
        schoolInput.classList.remove('hidden');
    } else {
        schoolInput.classList.add('hidden');
    }
});

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Read values at submit time
    const fullName = signupForm.fullname.value.trim();
    const username = signupForm.username.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();
    const confirmPassword = signupForm.confirmpassword.value.trim();
    const dob = signupForm.dob.value;
    const gender = signupForm.gender.value;
    const levelSelect = signupForm.level;
    const schoolInput = signupForm.school;
    const school = schoolInput.value.trim();
    const phone = signupForm.phone.value.trim();
    const terms = signupForm.terms.checked;

    if (levelSelect.value !== 'not-student' && !school) {
        alert('Please fill in all required fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    if (!terms) {
        alert("Please agree to our terms and conditions.");
        return;
    }

    signupData = {
        fullname: fullName,
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        dob: dob,
        gender: gender,
        phone: phone,
        school: levelSelect.value !== 'not-student' ? school : 'Not a Student',
        accepted_terms: terms
    }

    console.log(signupData);
    $.ajax({
        url: 'server/sign-up.php',
        type: 'POST',
        data: signupData,
        // processData: false,
        // contentType: false,
        dataType: 'json',
        // beforeSend: () => { 

        // },
        success: (response) => {
            if (response.success) {
                alert(response.message);
                window.location.href = 'server/login.php';
            } else {
                alert(response.message);
            }
        },
        error: (error) => {
            // alert('An error occurred while signing up.');
            console.error(error);
        },
        complete: () => {
            signupForm.reset();
        }
    });
});