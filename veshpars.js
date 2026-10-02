const products = [
    "ارتقاع سایت",
    "خرید سایت بدون بک اند"
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
//+++++++++++
 (() => {
 
    const root = document.querySelector('#heroSlider');
    if (!root) return;
  
    const track = root.querySelector('.slider__track');
    const slides = Array.from(root.querySelectorAll('.slide'));
    const btnPrev = root.querySelector('.slider__btn--prev');
    const btnNext = root.querySelector('.slider__btn--next');
    const dotsWrap = root.querySelector('.slider__dots');
  
    let index = 0;
    let timer = null;
    const DELAY = 4000; 

    const dots = slides.map((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider__dot' + (i === 0 ? ' is-active' : '');
      dot.addEventListener('click', () => goTo(i, true)); // با کلیک برو به اسلاید مربوطه
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(newIndex, userClicked = false) {
      index = (newIndex + slides.length) % slides.length;
      track.style.transform = `translate3d(${-index * 100}%, 0, 0)`;
      dots.forEach(d => d.classList.remove('is-active'));
      dots[index].classList.add('is-active');
      if (userClicked) restartAutoplay();
    }
    const next = (user) => goTo(index + 1, user);
    const prev = (user) => goTo(index - 1, user);
    function startAutoplay() {
      if (!timer) timer = setInterval(() => next(false), DELAY);
    }
  
    function stopAutoplay() {
      clearInterval(timer);
      timer = null;
    }
  
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }
    btnNext.addEventListener('click', () => next(true));
    btnPrev.addEventListener('click', () => prev(true));

    root.addEventListener('mouseenter', stopAutoplay);
    root.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  })();
  
