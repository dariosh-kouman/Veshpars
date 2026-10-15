<?php
header('Content-Type: application/json; charset=utf-8');

$email = trim($_POST['email'] ?? '');
$userOtp = trim($_POST['otp'] ?? '');
$name = trim($_POST['username'] ?? '');

if (empty($email)) {
    echo json_encode(['ok' => false, 'msg' => 'ایمیل مشخص نیست!']);
    exit;
}

$filename = "users.txt";
if (!file_exists($filename)) {
    echo json_encode(['ok' => false, 'msg' => 'کاربری یافت نشد!']);
    exit;
}

$lines = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$updatedLines = [];
$success = false;
$actionType = '';

// حالت اول: ذخیره نام کاربر بعد از ورود
if ($userOtp === "SAVE_NAME") {
    if (empty($name)) {
        echo json_encode(['ok' => false, 'msg' => 'نام نمی‌تواند خالی باشد!']);
        exit;
    }

    foreach ($lines as $line) {
        $parts = explode("|", $line);
        if (isset($parts[0]) && trim($parts[0]) === $email) {
            $purchases = $parts[4] ?? 0;
            // ایمیل | کد خالی | انقضا 0 | نام جدید | تعداد خرید
            $updatedLines[] = "$email||0|$name|$purchases";
            $success = true;
        } else {
            $updatedLines[] = $line;
        }
    }
    $actionType = 'save_name';
} 
// حالت دوم: تایید کد OTP ارسال شده
else {
    if (empty($userOtp)) {
        echo json_encode(['ok' => false, 'msg' => 'لطفاً کد تایید را وارد کنید!']);
        exit;
    }

    foreach ($lines as $line) {
        $parts = explode("|", $line);
        if (isset($parts[0]) && trim($parts[0]) === $email) {
            $savedOtp = trim($parts[1] ?? '');
            $expire = intval($parts[2] ?? 0);
            $currentName = $parts[3] ?? '';
            $purchases = $parts[4] ?? 0;

            if (!empty($savedOtp) && $savedOtp === $userOtp && time() <= $expire) {
                $success = true;
                // کد مصرف شد، پس باطلش می‌کنیم
                $updatedLines[] = "$email||0|$currentName|$purchases";
            } else {
                $updatedLines[] = $line;
            }
        } else {
            $updatedLines[] = $line;
        }
    }
    $actionType = 'verify_code';
}

if ($success) {
    file_put_contents($filename, implode("\n", $updatedLines), LOCK_EX);
    if ($actionType === 'save_name') {
        echo json_encode(['ok' => true, 'username' => $name, 'msg' => 'نام با موفقیت ذخیره شد.']);
    } else {
        echo json_encode(['ok' => true, 'msg' => 'کد تایید شد!']);
    }
} else {
    if ($actionType === 'save_name') {
        echo json_encode(['ok' => false, 'msg' => 'کاربر یافت نشد!']);
    } else {
        echo json_encode(['ok' => false, 'msg' => 'کد اشتباه است یا منقضی شده!']);
    }
}
?>
