<?php
// Simple form handler: saves messages to data/messages.txt
// Ensure directory exists
$dataDir = __DIR__ . DIRECTORY_SEPARATOR . 'data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0775, true);
}

$file = $dataDir . DIRECTORY_SEPARATOR . 'messages.txt';

function sanitize($v) {
    return trim(str_replace(array("\r", "\n"), ' ', htmlspecialchars($v ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8')));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = sanitize($_POST['name'] ?? '');
    $email = sanitize($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');
    $message = str_replace(["\r\n", "\r"], "\n", $message);
    $message = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

    if ($name && $email && $message) {
        $entry = "----\n" . date('Y-m-d H:i:s') . "\n" .
                 "Name: " . $name . "\n" .
                 "Email: " . $email . "\n" .
                 "Message: \n" . $message . "\n";
        file_put_contents($file, $entry, FILE_APPEND | LOCK_EX);

        // Simple success page
        echo '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
           . '<title>Message received</title><link rel="stylesheet" href="css/styles.css"></head><body>'
           . '<div class="section"><div class="container"><div class="card"><h2>Thank you!</h2>'
           . '<p>Your message has been received. I will get back to you soon.</p>'
           . '<p><a class="btn" href="index.html#contact">Back to site</a></p>'
           . '</div></div></div></body></html>';
        exit;
    } else {
        http_response_code(400);
        echo 'Invalid input.';
        exit;
    }
}

http_response_code(405);
echo 'Method not allowed';
?>


