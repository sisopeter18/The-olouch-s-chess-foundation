<?php
// get signUp data from JavaScript object
$fullName = htmlspecialchars($_POST['fullname']);
$userName = htmlspecialchars($_POST['username']);
$email = htmlspecialchars($_POST['email']);
$password = htmlspecialchars($_POST['password']);
$confirmPassword = htmlspecialchars($_POST['confirmPassword']);
$dob = htmlspecialchars($_POST['dob']);
$gender = htmlspecialchars($_POST['gender']);
$phoneNumber = htmlspecialchars($_POST['phone']);
$school = htmlspecialchars($_POST['school']);
$terms = htmlspecialchars($_POST['accepted_terms']);


if (empty($fullName) || empty($userName) || empty($email) || empty($password) || empty($confirmPassword) || empty($dob) || empty($gender) || empty($phoneNumber) || empty($school)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required!']);
    exit;
} else if (empty($terms)) {
    echo json_encode(['success' => false, 'message' => 'You must agree to the terms and conditions!']);
    exit;
} else if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters!']);
    exit;
} else if ($password !== $confirmPassword) {
        echo json_encode(['success' => false, 'message' => 'Passwords do not match!']);
        exit;
} else {
    $envVariables = parse_ini_file(__DIR__ . '/.env');
    $db_host = $envVariables['Db_Host'];
    $db_username = $envVariables['Db_User'];
    $db_password = $envVariables['Db_Password'];
    $db_name = $envVariables['Db_Name'];
    
    $conn = new mysqli($db_host, $db_username, $db_password, $db_name);
    if ($conn->connect_error) {
        echo json_encode(['success' => false, 'message' => 'Connection failed!']);
        exit;
    }
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // check if user already exists
    $check_username = "SELECT user_id FROM users WHERE user_name = ?";
    $stmt = $conn->prepare($check_username);
    $stmt->bind_param('s', $userName);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Username already taken!']);
        $stmt->close();
        $conn->close();
        exit;
    }

    $check_email = "SELECT user_id FROM users WHERE email = ?";
    $stmt = $conn->prepare($check_email);
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Email already exists!']);
        $stmt->close();
        $conn->close();
        exit;
    }

    $check_phoneNumber = "SELECT user_id FROM users WHERE phoneNumber = ?";
    $stmt = $conn->prepare($check_phoneNumber);
    $stmt->bind_param('s', $phoneNumber);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Phone number entered is associated with another user. Please try another one.']);
        $stmt->close();
        $conn->close();
        exit;
    }
    // insert user data into database
    $sql = "INSERT INTO users (fullname, user_name, email, user_password, dob, gender, phoneNumber, school) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ssssssss', $fullName, $userName, $email, $hashedPassword, $dob, $gender, $phoneNumber, $school);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'User registered successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
    
}