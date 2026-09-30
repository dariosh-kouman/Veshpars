const products = [
    "ارتقاع سرعت سایت",
    "طراحی سایت شرکتی",
    "قالب اختصاصی وشپارس",
    "سئو و بهینه‌سازی",
    "امنیت وب‌سایت",
    "افزونه اختصاصی",
    "هاست و سرور ابری"
];

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

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
        li.textContent = 'موردی پیدا نشد داش گلم!';
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
