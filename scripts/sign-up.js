document.querySelector('.form-placeholder').innerHTML = `

        <form id="account-signup-form">
            <h3>Create Account</h3>
            <label for="fullname">Name:</label>
            <input type="text" name="fullname" placeholder="Full Name" required>
            <label for="username">Username:</label>
            <input type="text" name="username" placeholder="Username" required>
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
            <button type="submit" class="btn">Sign Up</button>
            <button type="button" class="btn" id="close-signup-modal" onclick="closeSignupModal()">Cancel</button>
            <button type="button" class="goto-login-btn" onclick="window.location.href='login.html'">Go to
                Login</button>
        </form>
`;

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
    const userName = signupForm.username.value.trim();
    const email = signupForm.email.value.trim();
    const password = signupForm.password.value.trim();
    const confirmPassword = signupForm.confirmpassword.value.trim();
    const dob = signupForm.dob.value;
    const gender = signupForm.gender.value;
    const levelSelect = signupForm.level;
    const schoolInput = signupForm.school;
    const school = schoolInput.value.trim();
    const phone = signupForm.phone.value.trim();

    if (levelSelect.value !== 'not-student' && !school) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!fullName || !userName || !email || !password || !confirmPassword || !dob || !gender || !phone) {
        alert('Please fill in all required fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    signupData = {
        fullName,
        userName,
        email,
        password,
        confirmPassword,
        dob,
        gender,
        phone,
        school: levelSelect.value !== 'not-student' ? school : ''
    };
    console.log(signupData);
    // submit to server for processing
});