(function () {

  var nav = document.getElementById('nav');
  function onScroll() {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('nav-burger');
  var menu = document.getElementById('menu-overlay');
  var backdrop = document.getElementById('menu-backdrop');
  var menuClose = document.getElementById('menu-close');

  function openMenu() {
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-lock');
  }
  function closeMenu() {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-lock');
  }
  burger.addEventListener('click', function () {
    menu.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  menuClose.addEventListener('click', closeMenu);
  backdrop.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function (e) {
      closeMenu();
      if (a.hasAttribute('data-open-waitlist')) {
        e.preventDefault();
        setTimeout(function () {
          var w = document.getElementById('waitlist');
          if (!w) return;
          w.classList.add('is-open');
          w.setAttribute('aria-hidden', 'false');
          document.body.classList.add('waitlist-open');
          var inp = document.getElementById('waitlist-email');
          if (inp) setTimeout(function () { inp.focus(); }, 300);
        }, 80);
      }
    });
  });

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
    io.observe(el);
  });

  document.querySelectorAll('.foot-acc-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (window.innerWidth > 980) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.foot-acc-btn').forEach(function (o) {
        if (o !== btn) o.setAttribute('aria-expanded', 'false');
      });
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  var vini = document.getElementById('vini-overlay');
  var viniClose = document.getElementById('vini-close');
  if (vini && viniClose) {
    function openVini() {
      vini.classList.add('is-open');
      vini.setAttribute('aria-hidden', 'false');
      document.body.classList.add('vini-open');
    }
    function closeVini() {
      vini.classList.remove('is-open');
      vini.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('vini-open');
    }
    document.querySelectorAll('[data-open-vini]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (menu.classList.contains('is-open')) closeMenu();
        setTimeout(openVini, 50);
      });
    });
    viniClose.addEventListener('click', closeVini);
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      if (vini.classList.contains('is-open')) closeVini();
      else if (menu.classList.contains('is-open')) closeMenu();
    });
    if (location.hash === '#vini-overlay') openVini();
  }

  var waitlist = document.getElementById('waitlist');
  if (waitlist) {
    var waitlistClose = document.getElementById('waitlist-close');
    var waitlistBackdrop = document.getElementById('waitlist-backdrop');
    var waitlistForm = document.getElementById('waitlist-form');

    function openWaitlist() {
      waitlist.classList.add('is-open');
      waitlist.setAttribute('aria-hidden', 'false');
      document.body.classList.add('waitlist-open');
      setTimeout(function () {
        var inp = document.getElementById('waitlist-email');
        if (inp) inp.focus();
      }, 300);
    }
    function closeWaitlist() {
      waitlist.classList.remove('is-open');
      waitlist.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('waitlist-open');
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-open-waitlist]');
      if (!t) return;
      e.preventDefault();
      if (menu.classList.contains('is-open')) closeMenu();
      setTimeout(openWaitlist, 80);
    });
    waitlistClose.addEventListener('click', closeWaitlist);
    waitlistBackdrop.addEventListener('click', closeWaitlist);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && waitlist.classList.contains('is-open')) closeWaitlist();
    });

    waitlistForm.addEventListener('submit', function (e) {
      e.preventDefault();
      waitlist.classList.remove('is-error');
      var fd = new FormData();
      fd.append('entry.371054546', document.getElementById('waitlist-email').value);
      fetch(
        'https://docs.google.com/forms/d/e/1FAIpQLSc8N_JaLAM-UTnhMXGcjgOqbGE2YWu_ENHBmbMlh8ou2H4ipQ/formResponse',
        { method: 'POST', body: fd, mode: 'no-cors' }
      ).then(function () {
        waitlist.classList.add('is-success');
        setTimeout(function () {
          closeWaitlist();
          setTimeout(function () {
            waitlist.classList.remove('is-success');
            waitlistForm.reset();
          }, 600);
        }, 2200);
      }).catch(function () {
        waitlist.classList.add('is-error');
      });
    });

    if (location.hash === '#waitlist') openWaitlist();
  }

})();
