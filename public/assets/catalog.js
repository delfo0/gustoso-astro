(function(){
  var slider = document.querySelector('.cat-slider');
  if (slider) {
    var track  = slider.querySelector('.cat-slider-track');
    var slides = Array.prototype.slice.call(track.children);
    var dots   = Array.prototype.slice.call(slider.querySelectorAll('.cat-slider-dot'));
    var prevBtn = slider.querySelector('.cat-slider-arrow.prev');
    var nextBtn = slider.querySelector('.cat-slider-arrow.next');
    var idx = 0;
    var timer = null;
    var AUTOPLAY = 5500;

    function go(n) {
      idx = (n + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-idx * 100) + '%)';
      dots.forEach(function(d, i){ d.setAttribute('aria-current', i === idx ? 'true' : 'false'); });
    }
    function next() { go(idx + 1); }
    function prev() { go(idx - 1); }
    function restartAuto() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, AUTOPLAY);
    }

    dots.forEach(function(d, i){ d.addEventListener('click', function(){ go(i); restartAuto(); }); });
    if (prevBtn) prevBtn.addEventListener('click', function(){ prev(); restartAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ next(); restartAuto(); });

    var startX = 0, deltaX = 0, dragging = false;
    slider.addEventListener('touchstart', function(e){ startX = e.touches[0].clientX; dragging = true; deltaX = 0; }, { passive: true });
    slider.addEventListener('touchmove',  function(e){ if (!dragging) return; deltaX = e.touches[0].clientX - startX; }, { passive: true });
    slider.addEventListener('touchend',   function(){
      if (!dragging) return; dragging = false;
      if (Math.abs(deltaX) > 50) { deltaX < 0 ? next() : prev(); restartAuto(); }
    });

    slider.addEventListener('mouseenter', function(){ if (timer) { clearInterval(timer); timer = null; } });
    slider.addEventListener('mouseleave', restartAuto);

    go(0);
    restartAuto();
  }

  var popup = document.getElementById('cat-popup');
  if (popup) {
    var popupBackdrop = document.getElementById('cat-popup-backdrop');
    var popupClose    = document.getElementById('cat-popup-close');
    var popupImg      = document.getElementById('cat-popup-img');
    var popupName     = document.getElementById('cat-popup-name');
    var popupSpecs    = document.getElementById('cat-popup-specs');
    var popupDesc     = document.getElementById('cat-popup-desc');

    function openPopup(product) {
      var img    = product.getAttribute('data-img') || '';
      var name   = product.getAttribute('data-name') || '';
      var desc   = product.getAttribute('data-desc') || '';
      var bottle = product.querySelector('.cat-product-img--bottle');

      popupImg.style.backgroundImage = img ? "url('" + img + "')" : '';
      popupImg.classList.toggle('is-bottle', !!bottle);
      popupName.textContent = name;

      var srcSpecs = product.querySelector('.cat-product-overlay-specs');
      if (srcSpecs) {
        popupSpecs.innerHTML = srcSpecs.innerHTML;
        popupSpecs.hidden = false;
      } else {
        popupSpecs.innerHTML = '';
        popupSpecs.hidden = true;
      }

      var srcDesc = product.querySelector('.cat-product-overlay-desc');
      popupDesc.innerHTML = srcDesc ? srcDesc.innerHTML : desc;

      popup.classList.add('is-open');
      popup.setAttribute('aria-hidden', 'false');
      document.body.classList.add('cat-popup-open');
    }
    function closePopup() {
      popup.classList.remove('is-open');
      popup.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('cat-popup-open');
    }

    document.querySelectorAll('.cat-product').forEach(function(p){
      p.addEventListener('click', function(e){
        e.preventDefault();
        openPopup(p);
      });
    });
    popupClose.addEventListener('click', closePopup);
    popupBackdrop.addEventListener('click', closePopup);
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && popup.classList.contains('is-open')) closePopup();
    });

    function tryOpenFromHash() {
      var rawHash = location.hash;
      if (!rawHash || rawHash.indexOf('#open:') !== 0) return;
      var targetName = decodeURIComponent(rawHash.slice(6));
      history.replaceState(null, '', location.pathname);
      var matched = null;
      document.querySelectorAll('.cat-product').forEach(function(p) {
        if (!matched && p.getAttribute('data-name') === targetName) matched = p;
      });
      if (matched) openPopup(matched);
    }

    if (location.hash && location.hash.indexOf('#open:') === 0) {
      setTimeout(tryOpenFromHash, 350);
    }

    window.addEventListener('hashchange', tryOpenFromHash);
  }
})();
