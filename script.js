/* ============================================================
   COCOON AGENCY — CINEMATIC SCRIPT V3
   GSAP + ScrollTrigger powered
   ============================================================ */

(function () {
  'use strict';

  /* ─── GSAP SETUP ─────────────────────────────────────────── */
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('[data-anim]').forEach(el => {
      el.style.opacity = '1';
      el.style.filter = 'none';
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const EASE = 'power3.out';
  const html      = document.documentElement;


  /* ─── LOADER ─────────────────────────────────────────────── */
  const loader = document.getElementById('loader');

  const tl = gsap.timeline({
    onComplete: () => {
      loader.classList.add('out');
      document.body.classList.remove('is-loading');
      setTimeout(() => { loader.style.display = 'none'; }, 800);
      animateHero();
    }
  });

  tl.fromTo('.loader-logo',
    { opacity: 0, scale: 0.75, y: 20 },
    { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: EASE }
  )
  .to({}, { duration: 1.6 }); // hold


  /* ─── HERO ANIMATION ──────────────────────────────────────── */
  function animateHero() {
    const lines   = document.querySelectorAll('.hero-title .line');
    const sub     = document.querySelector('.hero-sub');
    const actions = document.querySelector('.hero-actions');
    const stats   = document.querySelector('.hero-stats');

    gsap.set([sub, actions, stats], { opacity: 0, y: 20 });
    gsap.set(lines, { y: '110%', opacity: 0 });

    const htl = gsap.timeline({ defaults: { ease: EASE } });
    htl
      .to(lines,   { y: '0%', opacity: 1, stagger: 0.13, duration: 1.0 })
      .to(sub,     { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to(actions, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
      .to(stats,   { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
  }


  /* ─── VIDEO LOADING ───────────────────────────────────────── */
  const heroVid = document.getElementById('heroVideo');
  if (heroVid) {
    const mobile = window.innerWidth <= 768;
    const src    = mobile ? heroVid.dataset.srcMobile : heroVid.dataset.srcDesktop;
    if (src) { heroVid.src = src; heroVid.load(); }

    if (mobile) {
      new IntersectionObserver(([e]) => {
        e.isIntersecting ? heroVid.play().catch(() => {}) : heroVid.pause();
      }, { threshold: 0.2 }).observe(heroVid);
    }
  }

  const muteBtn  = document.getElementById('muteBtn');
  const svgMuted = document.getElementById('svgMuted');
  const svgSound = document.getElementById('svgSound');
  if (muteBtn && heroVid) {
    muteBtn.addEventListener('click', () => {
      heroVid.muted      = !heroVid.muted;
      svgMuted.style.display = heroVid.muted ? '' : 'none';
      svgSound.style.display = heroVid.muted ? 'none' : '';
    });
  }


  /* ─── NAVBAR SCROLL ───────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  ScrollTrigger.create({
    start: 'top -60px',
    onEnter:     () => navbar.classList.add('scrolled'),
    onLeaveBack: () => navbar.classList.remove('scrolled'),
  });


  /* ─── MOBILE MENU ─────────────────────────────────────────── */
  const menuBtn   = document.getElementById('menuBtn');
  const navMenu   = document.getElementById('navMenu');
  const menuClose = document.getElementById('menuClose');

  window.closeMenu = function () {
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  };
  menuBtn  && menuBtn.addEventListener('click', () => {
    navMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  menuClose && menuClose.addEventListener('click', window.closeMenu);


  /* ─── LANGUAGE TOGGLE ─────────────────────────────────────── */
  const langBtn = document.getElementById('langBtn');

  function setLang(lang) {
    html.setAttribute('data-lang', lang);
    html.setAttribute('lang',      lang);
    html.setAttribute('dir',       lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('c-lang', lang);
    const lines = document.querySelectorAll('.hero-title .line');
    gsap.fromTo(lines, { y: '30%', opacity: 0 }, { y: '0%', opacity: 1, stagger: 0.08, duration: 0.6, ease: EASE });
  }

  const savedLang = localStorage.getItem('c-lang');
  if (savedLang && savedLang !== 'ar') setLang(savedLang);

  langBtn && langBtn.addEventListener('click', () => {
    setLang(html.getAttribute('data-lang') === 'ar' ? 'en' : 'ar');
  });


  /* ─── CUSTOM CURSOR ───────────────────────────────────────── */
  if (window.innerWidth > 1024) {
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    let mx = -100, my = -100, rx = -100, ry = -100;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
    });

    (function tickRing() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(tickRing);
    })();

    document.querySelectorAll('a, button, .feat-line, .faq-q, .proc-trigger, .pr-row').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
    });
    document.querySelectorAll('.mag-item, .sel-item').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('ci'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('ci'));
    });
  }


  /* ─── SECTION REVEALS — GSAP ScrollTrigger ───────────────── */

  // Generic fade-up
  document.querySelectorAll('[data-anim="fade-up"]').forEach(el => {
    gsap.fromTo(el,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.85, ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 88%' } }
    );
  });

  // Blur-up: blurry → sharp
  document.querySelectorAll('[data-anim="blur-up"]').forEach(el => {
    gsap.fromTo(el,
      { y: 30, opacity: 0, filter: 'blur(14px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)',
        duration: 1.1, ease: EASE,
        scrollTrigger: { trigger: el, start: 'top 87%' } }
    );
  });

  // Feature lines
  document.querySelectorAll('[data-anim="feat"]').forEach((line, i) => {
    gsap.fromTo(line,
      { x: html.dir === 'rtl' ? 60 : -60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.75, ease: EASE,
        delay: i * 0.07,
        scrollTrigger: { trigger: line, start: 'top 90%' } }
    );
  });

  // Portfolio items
  document.querySelectorAll('[data-anim="port"]').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: EASE,
        delay: i * 0.12,
        scrollTrigger: { trigger: el, start: 'top 88%' } }
    );
  });

  // Selected works — IntersectionObserver (reliable with lazy images)
  const swObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sw-visible');
        swObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('[data-anim="sw"]').forEach(row => {
    swObserver.observe(row);
  });



  /* ─── STORY PARALLAX ──────────────────────────────────────── */
  const storyBg = document.querySelector('.story-bg img');
  if (storyBg) {
    gsap.to(storyBg, {
      y: -130, ease: 'none',
      scrollTrigger: {
        trigger: '#story',
        start: 'top bottom', end: 'bottom top',
        scrub: 1
      }
    });
  }

  const storyContent = document.querySelector('.story-content');
  if (storyContent) {
    gsap.fromTo(storyContent,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: EASE,
        scrollTrigger: { trigger: '#story', start: 'top 70%' } }
    );
  }


  /* ─── PROCESS ACCORDION ───────────────────────────────────── */
  document.querySelectorAll('.proc-step').forEach((step, i) => {
    const trigger = step.querySelector('.proc-trigger');

    // Reveal each step on scroll
    gsap.fromTo(step,
      { x: html.dir === 'rtl' ? 50 : -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, ease: EASE,
        delay: i * 0.08,
        scrollTrigger: { trigger: step, start: 'top 88%' } }
    );

    trigger.addEventListener('click', () => {
      const isOpen = step.classList.contains('open');
      // Close all
      document.querySelectorAll('.proc-step.open').forEach(s => s.classList.remove('open'));
      // Open clicked (unless it was already open)
      if (!isOpen) step.classList.add('open');
    });
  });

  // Open first step by default after a delay
  setTimeout(() => {
    const first = document.querySelector('.proc-step');
    if (first) first.classList.add('open');
  }, 3200);


  /* ─── PRICING CARDS REVEAL ────────────────────────────────── */
  document.querySelectorAll('[data-anim="pc"]').forEach((card, i) => {
    gsap.fromTo(card,
      { y: 60, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, ease: EASE,
        delay: i * 0.12,
        scrollTrigger: { trigger: card, start: 'top 85%' }
      }
    );
  });


  /* ─── FAQ ACCORDION ───────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    q.addEventListener('click', () => {
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });


  /* ─── HERO GLOW FOLLOW ────────────────────────────────────── */
  const heroGlow = document.querySelector('.hero-glow');
  if (heroGlow && window.innerWidth > 1024) {
    document.addEventListener('mousemove', e => {
      const xPct = e.clientX / window.innerWidth;
      const yPct = e.clientY / window.innerHeight;
      gsap.to(heroGlow, {
        x: (xPct - 0.5) * 90,
        y: (yPct - 0.5) * 70,
        duration: 2.2, ease: 'power1.out'
      });
    });
  }


  /* ─── MARQUEE — GSAP seamless infinite loop (static by default) ────────────────────── */
  const marqueeSection = document.getElementById('marquee');
  const mqTrack = document.querySelector('.marquee-track');
  const marqueeSets = mqTrack ? mqTrack.querySelectorAll('.marquee-set') : null;

  if (mqTrack && marqueeSets && marqueeSets.length > 0) {
    // Clone sets for seamless loop (need at least 4 total sets)
    const originalSets = Array.from(marqueeSets);
    const numClones = 2; // Add 2 more clones
    
    // Create clones
    for (let i = 0; i < numClones; i++) {
      originalSets.forEach(set => {
        const clone = set.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        mqTrack.appendChild(clone);
      });
    }
    
    // Get all sets after cloning
    const allSets = mqTrack.querySelectorAll('.marquee-set');
    
    // Determine direction based on language
    const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
    
    // Calculate dimensions
    const setWidth = marqueeSets[0].offsetWidth;
    const totalWidth = setWidth * allSets.length;
    
    // Set initial position and speed
    let currentPos = 0;
    const speed = isRTL ? -0.8 : 0.8; // px per frame
    let paused = true; // Start paused (static by default)
    
    // Animation loop
    function animateMarquee() {
      if (!paused) {
        currentPos += speed;
        
        // Handle seamless loop in both directions
        if (isRTL) {
          // Moving left in RTL
          if (currentPos <= -setWidth) {
            currentPos = 0;
          }
        } else {
          // Moving right in LTR
          if (currentPos >= 0) {
            currentPos = -setWidth * (originalSets.length);
          }
        }
        
        // Apply transform with GPU acceleration
        gsap.set(mqTrack, {
          x: currentPos,
          force3D: true
        });
      }
      requestAnimationFrame(animateMarquee);
    }
    
    // Initialize position
    currentPos = isRTL ? 0 : -setWidth * originalSets.length;
    
    // Start animation loop (but paused - static)
    requestAnimationFrame(animateMarquee);
    
    // Start animation on hover, pause when mouse leaves
    marqueeSection.addEventListener('mouseenter', () => { paused = false; });
    marqueeSection.addEventListener('mouseleave', () => { paused = true; });
    
    // Add hover indicator styling
    marqueeSection.style.cursor = 'pointer';
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const newSetWidth = marqueeSets[0].offsetWidth;
        const newTotalWidth = newSetWidth * allSets.length;
        if (isRTL) {
          currentPos = 0;
        } else {
          currentPos = -newSetWidth * originalSets.length;
        }
      }, 250);
    });
    
    // Handle language change
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        setTimeout(() => {
          const newIsRTL = document.documentElement.getAttribute('dir') === 'rtl';
          if (newIsRTL !== isRTL) {
            // Reload to reset animation properly
            location.reload();
          }
        }, 150);
      });
    }
  }


  /* ─── FOOTER BG TEXT REVEAL ───────────────────────────────── */
  const footerBg = document.querySelector('.footer-bg-text');
  if (footerBg) {
    gsap.fromTo(footerBg,
      { opacity: 0, scale: 1.06 },
      { opacity: 0.028, scale: 1, duration: 1.5, ease: EASE,
        scrollTrigger: { trigger: '#footer', start: 'top 80%' } }
    );
  }


  /* ─── COUNTER ANIMATION ───────────────────────────────────── */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        gsap.to({ n: 0 }, {
          n: target, duration: 1.5, ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(this.targets()[0].n); }
        });
      }
    });
  });


  /* ─── CONTACT FORM ────────────────────────────────────────── */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      let ok = true;
      form.querySelectorAll('[required]').forEach(f => {
        const err = f.nextElementSibling;
        f.classList.remove('err');
        if (err) err.textContent = '';

        if (!f.value.trim()) {
          f.classList.add('err');
          if (err) err.textContent = 'مطلوب / Required';
          ok = false;
        } else if (f.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value)) {
          f.classList.add('err');
          if (err) err.textContent = 'بريد غير صالح / Invalid email';
          ok = false;
        }
      });
      if (!ok) return;

      const btn     = form.querySelector('.submit-btn');
      const btnLoad = btn.querySelector('.sb-load');

      btn.querySelectorAll('.sb-text').forEach(s => s.style.display = 'none');
      if (btnLoad) btnLoad.style.display = '';
      btn.disabled = true;

      try {
        const ep = form.dataset.endpoint || '#';
        if (ep !== '#') {
          await fetch(ep, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        } else {
          await new Promise(r => setTimeout(r, 1100));
        }

        gsap.to(form, { opacity: 0, y: -10, duration: 0.4, onComplete: () => {
          form.style.display = 'none';
          formSuccess.style.display = '';
          gsap.from(formSuccess, { opacity: 0, y: 20, duration: 0.5, ease: EASE });
        }});

        if (typeof gtag !== 'undefined') gtag('event', 'generate_lead');

      } catch {
        btn.querySelectorAll('.sb-text').forEach(s => s.style.display = '');
        if (btnLoad) btnLoad.style.display = 'none';
        btn.disabled = false;
      }
    });
  }


  /* ─── WHATSAPP FAB ────────────────────────────────────────── */
  const waFab = document.getElementById('waFab');
  setTimeout(() => { waFab && waFab.classList.add('show'); }, 2800);


  /* ─── MOBILE STICKY CTA ───────────────────────────────────── */
  const mobileCTA = document.getElementById('mobileCTA');
  const heroSec   = document.getElementById('hero');
  if (mobileCTA && heroSec) {
    ScrollTrigger.create({
      trigger: heroSec,
      start: 'bottom top',
      onEnter:     () => mobileCTA.classList.add('show'),
      onLeaveBack: () => mobileCTA.classList.remove('show'),
    });
  }


  /* ─── EXIT INTENT ─────────────────────────────────────────── */
  const exitModal   = document.getElementById('exitModal');
  const exitOverlay = document.getElementById('exitOverlay');
  const exitX       = document.getElementById('exitX');
  const exitCTA     = document.getElementById('exitCTA');

  let pageTime = 0;
  setInterval(() => pageTime++, 1000);
  let shown = sessionStorage.getItem('c-exit');

  if (!shown && window.innerWidth > 1024) {
    document.addEventListener('mouseleave', e => {
      if (e.clientY <= 0 && pageTime >= 30 && !shown) {
        shown = '1';
        sessionStorage.setItem('c-exit', '1');
        exitModal.classList.add('open');
      }
    });
  }

  function closeExit() { exitModal.classList.remove('open'); }
  exitX       && exitX.addEventListener('click', closeExit);
  exitOverlay && exitOverlay.addEventListener('click', closeExit);
  exitCTA     && exitCTA.addEventListener('click', closeExit);


  /* ─── KINETIC TEXT BAND ─────────────────────────────────────── */
  (function initKineticText() {
    const section = document.getElementById('kinetic-text');
    const el      = document.getElementById('kineticText');
    if (!section || !el) return;

    const phrasesAr = JSON.parse(section.dataset.phrasesAr || '[]');
    const phrasesEn = JSON.parse(section.dataset.phrasesEn || '[]');

    let idx     = 0;
    let paused  = false;
    let timer   = null;

    function getLang() {
      return document.documentElement.getAttribute('dir') === 'rtl' ? 'ar' : 'en';
    }

    function getPhrases() {
      return getLang() === 'ar' ? phrasesAr : phrasesEn;
    }

    function showPhrase(text) {
      /* Phase 1: exit */
      el.classList.add('kt-out');

      setTimeout(() => {
        /* Phase 2: instant swap + enter position (no transition) */
        el.textContent = text;
        el.classList.remove('kt-out');
        el.classList.add('kt-in');

        /* Force reflow so the browser registers the class before removing it */
        void el.offsetWidth;

        /* Phase 3: enter animation */
        el.classList.remove('kt-in');
      }, 460); /* match the transition duration */
    }

    function next() {
      if (paused) return;
      const phrases = getPhrases();
      idx = (idx + 1) % phrases.length;
      showPhrase(phrases[idx]);
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(next, 2600);
    }

    /* Initial text (no animation) */
    const phrases = getPhrases();
    el.textContent = phrases[0];

    /* Pause on hover */
    section.addEventListener('mouseenter', () => { paused = true; });
    section.addEventListener('mouseleave', () => { paused = false; });

    /* Re-sync when language is toggled */
    const langBtn = document.getElementById('langBtn');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        setTimeout(() => {
          const p = getPhrases();
          idx = idx % p.length;
          el.textContent = p[idx];
        }, 50);
      });
    }

    start();
  })();


  /* ─── DYNAMIC CURRENCY PRICING ────────────────────────────── */
  (function initCurrencyPricing() {

    /* Currency configs: { rate vs USD, prefix/symbol, rounding step } */
    const CURRENCIES = {
      USD: { rate: 1,     prefix: '$',    step: 1  },
      SAR: { rate: 3.75,  prefix: 'SAR ', step: 5  },
      AED: { rate: 3.67,  prefix: 'AED ', step: 5  },
      EGP: { rate: 50.50, prefix: 'EGP ', step: 50 },
    };

    /* Country → currency map */
    const COUNTRY_MAP = {
      SA: 'SAR', AE: 'AED', EG: 'EGP',
      BH: 'SAR', KW: 'SAR', OM: 'SAR', QA: 'SAR', YE: 'SAR',
    };

    function roundTo(value, step) {
      return Math.round(value / step) * step;
    }

    function formatPrice(usd, currency) {
      const cfg = CURRENCIES[currency] || CURRENCIES.USD;
      const raw = usd * cfg.rate;
      const rounded = roundTo(raw, cfg.step);
      const formatted = rounded.toLocaleString('en-US', { maximumFractionDigits: 0 });
      return cfg.prefix + formatted;
    }

    function injectPrices(currency) {
      document.querySelectorAll('.pc-price-val[data-usd]').forEach(el => {
        const usd = parseFloat(el.dataset.usd);
        el.textContent = formatPrice(usd, currency);
      });
    }

    function markActivePill(currency) {
      document.querySelectorAll('.cp-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.currency === currency);
      });
    }

    function applyAndStore(currency) {
      injectPrices(currency);
      markActivePill(currency);
    }

    /* ── Currency switcher pills ── */
    document.querySelectorAll('.cp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const chosen = btn.dataset.currency;
        localStorage.setItem('c-currency', chosen);
        applyAndStore(chosen);
      });
    });

    /* ── Detection flow ── */
    const stored = localStorage.getItem('c-currency');
    if (stored && CURRENCIES[stored]) {
      /* Path 1: use stored preference synchronously — no flicker */
      applyAndStore(stored);
      return;
    }

    /* Path 2: IP geolocation (async, 3s timeout) */
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    fetch('https://ipapi.co/json/', { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        clearTimeout(timeout);
        const country = (data && data.country_code) ? data.country_code.toUpperCase() : '';
        const resolved = COUNTRY_MAP[country] || 'USD';
        localStorage.setItem('c-currency', resolved);
        applyAndStore(resolved);
      })
      .catch(() => {
        /* Path 3: fallback — USD (default HTML values remain correct) */
        markActivePill('USD');
      });

  })();


})();