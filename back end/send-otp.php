<?php
header('Content-Type: application/json; charset=utf-8');

// دریافت ایمیل ارسالی از فرم
$email = trim($_POST['email'] ?? '');

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['ok' => false, 'msg' => 'ایمیل معتبر نیست!']);
    exit;
}

// ساخت کد ۶ رقمی تصادفی و زمان انقضا (۵ دقیقه بعد)
$otp = random_int(100000, 999999);
$expire = time() + (5 * 60);

$filename = "users.txt";
$lines = file_exists($filename) ? file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [];
$updatedLines = [];
$found = false;

foreach ($lines as $line) {
    $parts = explode("|", $line);
    if (isset($parts[0]) && trim($parts[0]) === $email) {
        $username = $parts[3] ?? '';
        $purchases = $parts[4] ?? 0;
        $updatedLines[] = "$email|$otp|$expire|$username|$purchases";
        $found = true;
    } else {
        $updatedLines[] = $line;
    }
}

if (!$found) {
    $updatedLines[] = "$email|$otp|$expire||0";
}

// ذخیره ایمن با قفل اختصاصی
file_put_contents($filename, implode("\n", $updatedLines), LOCK_EX);

// ارسال با PHPMailer
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require 'PHPMailer/src/Exception.php';

$mail = new PHPMailer\PHPMailer\PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'yourgmail@gmail.com'; // ایمیل خودت
    $mail->Password   = '*******';   // رمز برنامه گوگل (App Password)
    $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->setFrom('yourgmail@gmail.com', 'وشپارس');
    $mail->addAddress($email);
    $mail->CharSet = 'UTF-8';
    $mail->Subject = 'کد تایید ورود به وشپارس';
    $mail->Body    = "سلام داش گلم!\n\nکد ورودت به سایت: $otp\n۵ دقیقه فرصت داری تا از این کد استفاده کنی.";

    $mail->send();
    echo json_encode(['ok' => true, 'msg' => 'کد با موفقیت ارسال شد!']);
} catch (Exception $e) {
    echo json_encode(['ok' => false, 'msg' => 'خطا در ارسال ایمیل! تنظیمات جیمیل یا هاست رو چک کن.']);
}
?>
