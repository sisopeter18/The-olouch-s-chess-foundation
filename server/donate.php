<?php
header('Content-Type: application/json');

// === 1. Get Phone Number and Amount from JavaScript POST ===
$phone = $_POST['number'] ?? '';
$amount = $_POST['amount'] ?? '';

if (!$phone || !$amount) {
    respond(['status' => 'error', 'message' => 'Phone number and amount required.']);
}

// Load environment variables from .env file
$env = parse_ini_file(__DIR__ . '/.env');
if (!$env) {
    respond(['status' => 'error', 'message' => 'Environment variables missing']);
    exit();
}

$shortCode = $env['M-Pesa_ShortCode'] ?? '';
$passkey = $env['M-Pesa_PassKey'] ?? '';
$consumerKey = $env['M-Pesa_ConsumerKey'] ?? '';
$consumerSecret = $env['M-Pesa_ConsumerSecret'] ?? '';
$callbackUrl = $env['M-Pesa_CallBack_URL'] ?? '';

// === 3. Get OAuth Access Token ===
$access_token = getAccessToken($consumerKey, $consumerSecret);
if (!$access_token) {
    respond(['status' => 'error', 'message' => 'An internal error occurred. Please try again.']);
}

// === 4. Prepare STK Push Payload ===
$timestamp = date('YmdHis');
$password = base64_encode($shortCode . $passkey . $timestamp);
$accountReference = $env['Account_Reference'];
$transactionDesc = $env['Transaction_Description'];

$stkPayload = [
    'BusinessShortCode' => $shortCode,
    'Password' => $password,
    'Timestamp' => $timestamp,
    'TransactionType' => 'CustomerPayBillOnline',
    'Amount' => $amount,
    'PartyA' => $phone, // Sender's Phone Number
    'PartyB' => $shortCode, // Receiver's short code or Paybill Number
    'PhoneNumber' => $phone, // Sender's Phone Number
    'CallBackURL' => $callbackUrl,
    'AccountReference' => $accountReference,
    'TransactionDesc' => $transactionDesc
];

// === 5. Send STK Push Request ===
$response = sendStkPush($stkPayload, $access_token);

// === 6. Handle Response ===
if (isset($response['ResponseCode']) && $response['ResponseCode'] === '0') {
    $merchantRequestID = $response['MerchantRequestID'];
    $checkoutRequestID = $response['CheckoutRequestID'];
    $dbResult = storeTransaction($merchantRequestID, $checkoutRequestID, $phone, $amount, $accountReference);
    if ($dbResult !== true) {
        respond(['DB insert failed']);
    }
    respond([
        'status' => 'pending',
        'message' => 'Mpesa prompt sent. Check your phone for confirmation.',
        'checkoutRequestID' => $checkoutRequestID
    ]);
} else {
    logError("../logs/stkpush_errors.log", json_encode($response));
    respond([
        'status' => 'error',
        'message' => 'An error occurred. Please try again.',
        // 'response' => $response
    ]);
}

// === Helper Functions ===

function respond($data) {
    echo json_encode($data);
    exit;
}

function getAccessToken($consumerKey, $consumerSecret) {
    $credentials = base64_encode("$consumerKey:$consumerSecret");

        global $env;
    $Mpesa_Env = $env['M-Pesa_Environment'] ?? 'Sandbox';
    if (strtolower($Mpesa_Env) === 'production') {
        $tokenUrl = 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'; // for production
    } else {
        $tokenUrl = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'; // for Sandbox
    }

    $ch = curl_init($tokenUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Basic $credentials"]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $tokenResponse = curl_exec($ch);
    curl_close($ch);
    $tokenData = json_decode($tokenResponse);
    return $tokenData->access_token ?? null;
}

function sendStkPush($payload, $access_token) {
        global $env;
    $Mpesa_Env = $env['M-Pesa_Environment'] ?? 'Sandbox';
    if (strtolower($Mpesa_Env) === 'production') {
        $stkUrl = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    } else {
        $stkUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    }

    $ch = curl_init($stkUrl);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        "Authorization: Bearer $access_token"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
    $stkPushResponse = curl_exec($ch);
    curl_close($ch);
    return json_decode($stkPushResponse, true);
}

function storeTransaction($merchantRequestID, $checkoutRequestID, $phone, $amount, $accountReference) {
        global $env;
    $db_host = $env['Db_Host'];
    $db_username = $env['Db_User'];
    $db_password = $env['Db_Password'];
    $db_name = $env['Db_Name'];
    if (!$db_host || !$db_username || !$db_password || !$db_name) {
        return false;
    }
    $conn = new mysqli($db_host, $db_username, $db_password, $db_name);
    if ($conn->connect_error) {
        logError("../logs/db_error.log", $conn->connect_error);
        return false;
    }
    $stmt = $conn->prepare("INSERT INTO transactions 
        (merchant_request_id, checkout_request_id, phone_number, amount, account_reference, status) 
        VALUES (?, ?, ?, ?, ?, ?)");
    $status = 'Pending';
    $stmt->bind_param("ssssss", $merchantRequestID, $checkoutRequestID, $phone, $amount, $accountReference, $status);
    $result = $stmt->execute();
    if (!$result) {
        logError("../logs/db_insert_error.log", $stmt->error);
    }
    $stmt->close();
    $conn->close();
    return $result ? true : false;
}

function logError($file, $message) {
    file_put_contents($file, $message . PHP_EOL, FILE_APPEND);
}
