(function () {
  'use strict';

  var SKELETON_DURATION = 420;
  var pageKey = 'gst-cat-' + location.pathname;
  var firstView = !sessionStorage.getItem(pageKey);

  function initImageShimmer() {
    document.querySelectorAll('.cat-product-img').forEach(function (imgEl) {
      var style = imgEl.style.backgroundImage || getComputedStyle(imgEl).backgroundImage;
      var match = style && style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
      if (!match) return;

      var url = match[1];
      if (!url || url === 'none') return;

      imgEl.classList.add('is-loading-img');

      var img = new Image();
      img.onload = img.onerror = function () {
        imgEl.classList.remove('is-loading-img');
      };
      img.src = url;

      setTimeout(function () { imgEl.classList.remove('is-loading-img'); }, 5000);
    });
  }

  function initSkeleton() {
    var catList = document.querySelector('.cat-list');
    if (!catList) return;

    var products = Array.prototype.slice.call(catList.querySelectorAll('.cat-product'));
    if (!products.length) return;

    products.forEach(function (p) { p.style.visibility = 'hidden'; });

    var skeletons = products.map(function () {
      var sk = document.createElement('div');
      sk.className = 'gst-skeleton-card';
      sk.innerHTML = [
        '<div class="gst-skeleton-img"></div>',
        '<div class="gst-skeleton-body">',
          '<div class="gst-skeleton-line is-xshort"></div>',
          '<div class="gst-skeleton-line"></div>',
          '<div class="gst-skeleton-line is-short"></div>',
        '</div>'
      ].join('');
      return sk;
    });

    var skWrap = document.createElement('div');
    skWrap.className = 'gst-skeleton-grid';

    skWrap.style.cssText = [
      'display: grid',
      'grid-template-columns: ' + getComputedStyle(catList).gridTemplateColumns,
      'gap: ' + getComputedStyle(catList).gap,
      'padding: 0',
      'margin-bottom: 0',
      'position: absolute',
      'top: 0',
      'left: 0',
      'width: 100%',
      'z-index: 20'
    ].join(';');

    skeletons.forEach(function (sk) { skWrap.appendChild(sk); });

    var wrapper = document.createElement('div');
    wrapper.style.cssText = 'position: relative; min-height: 1px;';
    catList.parentNode.insertBefore(wrapper, catList);
    wrapper.appendChild(catList);
    wrapper.appendChild(skWrap);

    setTimeout(function () {
      skWrap.style.transition = 'opacity 220ms ease';
      skWrap.style.opacity = '0';

      products.forEach(function (p, i) {
        setTimeout(function () {
          p.style.visibility = '';
          p.style.opacity = '0';
          p.style.transform = 'translateY(12px)';
          p.style.transition = 'opacity 400ms cubic-bezier(0.16,1,0.3,1), transform 500ms cubic-bezier(0.16,1,0.3,1)';
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              p.style.opacity = '1';
              p.style.transform = '';
            });
          });
        }, i * 55);
      });

      setTimeout(function () {
        if (skWrap.parentNode) skWrap.parentNode.removeChild(skWrap);
        if (wrapper.parentNode) {
          wrapper.parentNode.insertBefore(catList, wrapper);
          wrapper.parentNode.removeChild(wrapper);
        }
        products.forEach(function (p) {
          p.style.opacity = '';
          p.style.transform = '';
          p.style.transition = '';
          p.style.visibility = '';
        });
      }, 350 + products.length * 55);

    }, SKELETON_DURATION);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initImageShimmer();
      if (firstView) {
        sessionStorage.setItem(pageKey, '1');
        initSkeleton();
      }
    });
  } else {
    initImageShimmer();
    if (firstView) {
      sessionStorage.setItem(pageKey, '1');
      initSkeleton();
    }
  }
})();
