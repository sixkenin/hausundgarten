const nav = document.getElementById('main-nav');


if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

(function keepRefreshAtTop() {
  const navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  const isReload = navEntry ? navEntry.type === 'reload' : performance.navigation && performance.navigation.type === 1;

  if (isReload && window.location.hash) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  const shouldStartAtTop = isReload || !window.location.hash;

  if (!shouldStartAtTop) return;

  const scrollTop = () => window.scrollTo(0, 0);

  scrollTop();
  window.addEventListener('DOMContentLoaded', scrollTop);
  window.addEventListener('load', () => {
    scrollTop();
    setTimeout(scrollTop, 80);
    setTimeout(scrollTop, 250);
  });
  window.addEventListener('pageshow', scrollTop);
})();


window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });


const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');

    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    document.body.classList.toggle('menu-open', !expanded);
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  }, { passive: true });
}


const heroBg = document.getElementById('hero-bg');

window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `scale(1) translateY(${window.scrollY * 0.38}px)`;
  }
}, { passive: true });


(function initTypewriter() {
  const line1El = document.getElementById('tw-line1');
  const line2El = document.getElementById('tw-line2');

  if (!line1El || !line2El) return;

  const text1 = 'Gartenservice';
  const text2 = 'Cosmin';

  line1El.textContent = '';
  line2El.textContent = '';

  const cursor = document.createElement('span');
  cursor.className = 'tw-cursor';
  line1El.appendChild(cursor);

  const CHAR_DELAY = 55;
  const LINE_PAUSE = 300;

  function typeInto(el, text, onDone) {
    let i = 0;

    if (cursor.parentNode) cursor.parentNode.removeChild(cursor);

    el.textContent = '';
    el.appendChild(cursor);

    const tick = () => {
      if (i < text.length) {
        el.insertBefore(document.createTextNode(text[i]), cursor);
        i++;
        setTimeout(tick, CHAR_DELAY + Math.random() * 20);
      } else if (onDone) {
        onDone();
      }
    };

    tick();
  }

  setTimeout(() => {
    typeInto(line1El, text1, () => {
      setTimeout(() => {
        typeInto(line2El, text2, () => {
          setTimeout(() => {
            if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
          }, 1800);
        });
      }, LINE_PAUSE);
    });
  }, 400);
})();


(function initLeaves() {
  const canvas = document.getElementById('leaf-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  const LEAF_COLORS = [
    'rgba(122,158,126,0.5)',
    'rgba(58,94,60,0.4)',
    'rgba(30,53,32,0.3)',
    'rgba(176,144,96,0.3)',
    'rgba(200,218,201,0.25)',
  ];

  const LEAF_COUNT = 18;
  const leaves = [];

  class Leaf {
    constructor() {
      this.reset(true);
    }

    reset(initial) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -20;
      this.w = 5 + Math.random() * 9;
      this.h = this.w * (0.4 + Math.random() * 0.4);
      this.rot = Math.random() * Math.PI * 2;
      this.rotV = (Math.random() - 0.5) * 0.02;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = 0.25 + Math.random() * 0.6;
      this.sway = Math.random() * Math.PI * 2;
      this.swayS = 0.005 + Math.random() * 0.007;
      this.swayA = 0.25 + Math.random() * 0.45;
      this.color = LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)];
      this.opacity = 0.25 + Math.random() * 0.5;
    }

    update() {
      this.sway += this.swayS;
      this.x += this.vx + Math.sin(this.sway) * this.swayA;
      this.y += this.vy;
      this.rot += this.rotV;

      if (this.y > canvas.height + 30) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      ctx.beginPath();
      ctx.ellipse(0, 0, this.w, this.h, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -this.h);
      ctx.lineTo(0, this.h);
      ctx.stroke();

      ctx.restore();
    }
  }

  for (let i = 0; i < LEAF_COUNT; i++) {
    leaves.push(new Leaf());
  }

  let animating = true;

  window.addEventListener('scroll', () => {
    animating = window.scrollY < window.innerHeight * 0.8;
  }, { passive: true });

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (animating) {
      leaves.forEach((leaf) => {
        leaf.update();
        leaf.draw();
      });
    }

    requestAnimationFrame(loop);
  }

  loop();
})();

/* REVEAL */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

/* COUNTERS */
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        el.textContent = Math.floor(eased * target) + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target + suffix;
        }
      }

      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => obs.observe(el));
})();

/* SERVICES TABS */
document.querySelectorAll('.stab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.stab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.service-panel').forEach((panel) => panel.classList.remove('active'));

    tab.classList.add('active');

    const panel = document.getElementById('panel-' + tab.dataset.panel);

    if (panel) {
      panel.classList.add('active');
      panel.querySelectorAll('.reveal').forEach((el) => {
        el.classList.remove('visible');
        setTimeout(() => io.observe(el), 20);
      });
    }
  });
});

/* LIGHTBOX */
const lightbox = document.getElementById('lightbox');
const lbFill = document.getElementById('lb-fill');
const lbCap = document.getElementById('lb-caption');
const lbClose = document.getElementById('lb-close');

if (lightbox && lbFill && lbCap) {
  document.querySelectorAll('.gi').forEach((gi) => {
    gi.addEventListener('click', () => {
      const img = gi.querySelector('img.gi-fill');
      lbFill.innerHTML = '';

      if (img && img.complete && img.naturalWidth) {
        lbFill.style.background = 'none';
        lbFill.innerHTML = `<img src="${img.src}" style="width:100%;height:100%;object-fit:contain;display:block" alt="">`;
      } else {
        const fill = gi.querySelector('.gi-fill');
        lbFill.innerHTML = '';
        if (fill) lbFill.style.background = getComputedStyle(fill).background;
      }

      lbCap.textContent = gi.dataset.caption || '';
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* CONTACT FORM */
const form = document.getElementById('contact-form');
const btn = document.getElementById('form-btn');
const success = document.getElementById('form-success');
const errBox = document.getElementById('form-error');
const phoneInput = document.getElementById('f-phone');

if (phoneInput) {
  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '');
  });
}

if (form && btn && success && errBox) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    btn.disabled = true;
    btn.textContent = 'Senden…';
    success.style.display = 'none';
    errBox.style.display = 'none';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        success.style.display = 'block';
        form.reset();
      } else {
        errBox.style.display = 'block';
      }
    } catch {
      errBox.style.display = 'block';
    }

    btn.disabled = false;
    btn.textContent = 'Nachricht senden →';
  });
}
