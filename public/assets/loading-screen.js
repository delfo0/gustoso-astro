(function () {
  'use strict';

  var SESSION_KEY = 'gst-loaded';
  var MIN_DURATION = 700;
  var startTime = Date.now();
  var firstVisit = !sessionStorage.getItem(SESSION_KEY);

  var bar = document.createElement('div');
  bar.className = 'gst-progress-bar';
  document.body.appendChild(bar);

  function showProgressBar() {
    bar.classList.remove('is-done');
    void bar.offsetWidth;
    bar.classList.add('is-running');
  }
  function hideProgressBar() {
    bar.classList.remove('is-running');
    bar.classList.add('is-done');
    setTimeout(function () { bar.classList.remove('is-done'); }, 700);
  }

  if (!firstVisit) {
    showProgressBar();
    window.addEventListener('load', function () {
      hideProgressBar();
    });
    return;
  }

  sessionStorage.setItem(SESSION_KEY, '1');

  var boot = document.createElement('div');
  boot.id = 'gst-boot';
  boot.className = 'gst-boot';
  boot.setAttribute('aria-hidden', 'true');
  boot.setAttribute('role', 'presentation');
  boot.innerHTML = [
    '<img class="gst-boot-logo" src="assets/logo-chiaro.svg" alt="Gustoso" width="180" height="83">',
    '<div class="gst-loader-dots" aria-hidden="true">',
      '<span></span><span></span><span></span>',
    '</div>'
  ].join('');

  document.body.insertBefore(boot, document.body.firstChild);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      boot.querySelector('.gst-boot-logo').classList.add('is-visible');
      setTimeout(function () { boot.classList.add('dots-visible'); }, 200);
    });
  });

  function dismiss() {
    var elapsed = Date.now() - startTime;
    var remaining = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(function () {
      boot.classList.add('is-hiding');
      boot.addEventListener('transitionend', function handler() {
        boot.removeEventListener('transitionend', handler);
        if (boot.parentNode) boot.parentNode.removeChild(boot);
      });
    }, remaining);
  }

  if (document.readyState === 'complete') {
    dismiss();
  } else {
    window.addEventListener('load', dismiss);
  }
})();
