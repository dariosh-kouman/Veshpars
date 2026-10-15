const products = [
    "ارتقاع سایت",
    "خرید سایت بدون بک اند"
];

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

if (searchInput && searchResults) {
    searchInput.addEventListener('input', function() {
        const value = this.value.trim();
        searchResults.innerHTML = '';

        if (value.length === 0) {
            searchResults.style.display = 'none';
            return;
        }

        const filtered = products.filter(product => 
            product.toLowerCase().includes(value.toLowerCase())
        );

        if (filtered.length > 0) {
            filtered.forEach(item => {
                let li = document.createElement('li');
                li.textContent = item;
                
                li.addEventListener('click', () => {
                    searchInput.value = item;
                    searchResults.style.display = 'none';
                    alert('رفتی تو صفحه: ' + item);
                });

                searchResults.appendChild(li);
            });
            searchResults.style.display = 'block';
        } else {
            let li = document.createElement('li');
            li.textContent = 'موردی پیدا نشد';
            li.style.color = '#888';
            searchResults.appendChild(li);
            searchResults.style.display = 'block';
        }
    });

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box')) {
            searchResults.style.display = 'none';
        }
    });
}

// --- بخش احراز هویت و ورود ---
let currentEmail = "";

async function handleSendCode() {
    const emailInput = document.getElementById("userEmail");
    if (!emailInput) return;
    const email = emailInput.value.trim();

    if (!email || !email.includes("@")) {
        alert("لطفاً یک ایمیل معتبر وارد کن!");
        return;
    }

    try {
        const res = await fetch("send-otp.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email: email })
        });
        const data = await res.json();

        if (data.ok) {
            currentEmail = email;
            document.getElementById("step-email").style.display = "none";
            document.getElementById("step-otp").style.display = "block";
            alert("کد ارسال شد! صندوق ایمیلت رو چک کن.");
        } else {
            alert(data.msg || "خطا در ارسال کد!");
        }
    } catch (err) {
        alert("ارتباط با سرور برقرار نشد! بررسی کن زمپ/آپاچی روشن باشه.");
    }
}

async function handleVerifyOtp() {
    const otpInput = document.getElementById("otpInput");
    if (!otpInput) return;
    const code = otpInput.value.trim();

    if (!code) {
        alert("لطفاً کد تایید را وارد کن!");
        return;
    }

    try {
        const res = await fetch("verify-otp.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email: currentEmail, otp: code })
        });
        const data = await res.json();

        if (data.ok) {
            document.getElementById("step-otp").style.display = "none";
            document.getElementById("step-username").style.display = "block";
            document.getElementById("customNameInput").value = currentEmail.split("@")[0];
        } else {
            alert(data.msg || "کد اشتباه یا منقضی است!");
        }
    } catch (err) {
        alert("خطا در برقراری ارتباط با سرور!");
    }
}

async function handleSaveUsername() {
    const nameInput = document.getElementById("customNameInput");
    if (!nameInput) return;
    const name = nameInput.value.trim();

    if (!name) { 
        alert("اسم نمی‌تونه خالی باشه!"); 
        return; 
    }

    try {
        const res = await fetch("verify-otp.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ email: currentEmail, otp: "SAVE_NAME", username: name })
        });
        const data = await res.json();

        if (data.ok) {
            localStorage.setItem("veshpars_username", data.username);
            alert("خوش اومدی " + data.username + "! 🎉");
            window.location.href = "veshpars.html";
        } else {
            alert(data.msg || "خطا در ذخیره اسم!");
        }
    } catch (err) {
        alert("خطا در برقراری ارتباط با سرور!");
    }
}
