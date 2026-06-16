/* =============================================
   PORTFOLIO PAHRUROJI — script.js
   Includes:
   - Interactive Dot Matrix Grid (canvas)
   - Dark / Light Mode + localStorage
   - Hamburger Menu
   - Smooth Scroll + Active Nav Link
   - Typing Effect
   - Modal (Project Detail)
   ============================================= */

/* ============================================
   1. INTERACTIVE DOT MATRIX GRID (CANVAS)
      + Twinkle / Starfield Effect
   ============================================ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const GRID_SPACE = 16;       // distance between dots (smaller = denser)
  const DOT_BASE   = 0.5;      // base dot radius (tiny dots)
  const DOT_MAX    = 1.4;      // max radius when near cursor
  const RADIUS     = 200;      // cursor influence radius
  const LERP_SPEED = 0.12;     // smoothing factor (lower = smoother)

  // Idle fade settings
  const IDLE_TIMEOUT   = 1500;  // ms before dots start fading
  const OPACITY_ACTIVE = 1.0;   // full opacity when cursor moves
  const OPACITY_IDLE   = 0.25;  // dimmed opacity when idle
  const FADE_SPEED     = 0.03;  // how fast opacity transitions

  // ── Twinkle settings ──
  const TWINKLE_CHANCE   = 0.06;   // ~6% of dots will twinkle
  const TWINKLE_MIN_OPACITY = 0.12; // minimum twinkle brightness
  const TWINKLE_MAX_OPACITY = 0.40; // maximum twinkle brightness
  const TWINKLE_SPEED_MIN  = 0.0008; // slowest cycle (~8s full cycle)
  const TWINKLE_SPEED_MAX  = 0.0020; // fastest cycle (~3s full cycle)
  const TWINKLE_RADIUS_BOOST = 0.3;  // slight size boost when twinkling

  // Detect mobile for lighter animation
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const mobileScale = isMobile ? 0.5 : 1;

  let mouse = { x: -9999, y: -9999 };
  let dots  = [];
  let animId;
  let theme = document.documentElement.getAttribute('data-theme') || 'light';

  // Idle tracking
  let idleTimer    = null;
  let isIdle       = true;       // start dimmed
  let globalOpacity = OPACITY_IDLE;

  // Seeded pseudo-random for consistent dot selection
  function seededRandom(seed) {
    let x = Math.sin(seed) * 43758.5453;
    return x - Math.floor(x);
  }

  function getColors() {
    if (theme === 'dark') {
      return { static: '#1F2226', cursor: '#FFFFFF' };
    }
    return { static: '#E5E7EB', cursor: '#000000' };
  }

  // Twinkle glow color (soft warm-white / cool-blue tint)
  function getTwinkleColor() {
    if (theme === 'dark') {
      return { r: 180, g: 200, b: 255 }; // subtle cool-blue starlight
    }
    return { r: 100, g: 120, b: 180 }; // muted blue for light mode
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function buildGrid() {
    dots = [];
    const cols = Math.ceil(canvas.width  / GRID_SPACE) + 1;
    const rows = Math.ceil(canvas.height / GRID_SPACE) + 1;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const seed = idx * 7 + r * 13 + c * 31; // deterministic seed

        // Semi-random selection with spacing: use seeded random
        // to ensure even distribution across the grid
        const rng = seededRandom(seed);
        const isTwinkle = rng < TWINKLE_CHANCE;

        const dot = {
          x:       c * GRID_SPACE,
          y:       r * GRID_SPACE,
          radius:  DOT_BASE,
          targetR: DOT_BASE,
        };

        if (isTwinkle) {
          // Each twinkle dot gets unique animation parameters
          const rng2 = seededRandom(seed + 999);
          const rng3 = seededRandom(seed + 1777);
          dot.twinkle = true;
          dot.twinklePhase = rng2 * Math.PI * 2;  // random start phase
          dot.twinkleSpeed = TWINKLE_SPEED_MIN +
            rng3 * (TWINKLE_SPEED_MAX - TWINKLE_SPEED_MIN);
          dot.twinkleMax = TWINKLE_MIN_OPACITY +
            seededRandom(seed + 2345) * (TWINKLE_MAX_OPACITY - TWINKLE_MIN_OPACITY);
        }

        dots.push(dot);
      }
    }
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    buildGrid();
  }

  function draw(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const colors    = getColors();
    const staticC   = hexToRgb(colors.static);
    const cursorC   = hexToRgb(colors.cursor);
    const twinkleC  = getTwinkleColor();
    const now       = timestamp || performance.now();

    // Smoothly transition global opacity
    const targetOpacity = isIdle ? OPACITY_IDLE : OPACITY_ACTIVE;
    globalOpacity = lerp(globalOpacity, targetOpacity, FADE_SPEED);

    for (const dot of dots) {
      const dx   = mouse.x - dot.x;
      const dy   = mouse.y - dot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const influence = Math.max(0, 1 - dist / RADIUS) * mobileScale;

      dot.targetR = DOT_BASE + (DOT_MAX - DOT_BASE) * influence;

      // ── Twinkle logic ──
      let twinkleAlpha = 0;
      let twinkleRadiusBoost = 0;

      if (dot.twinkle) {
        // Sine wave produces smooth 0→1→0 oscillation
        const wave = Math.sin(now * dot.twinkleSpeed + dot.twinklePhase);
        // Map from [-1,1] to [0,1], then apply easing for softer peaks
        const t01 = (wave + 1) * 0.5;
        const eased = t01 * t01; // quadratic ease — sharper fade-in/out

        twinkleAlpha = eased * dot.twinkleMax;
        twinkleRadiusBoost = eased * TWINKLE_RADIUS_BOOST;

        // Suppress twinkle when cursor is nearby (spotlight dominates)
        const cursorSuppress = 1 - influence;
        twinkleAlpha *= cursorSuppress;
        twinkleRadiusBoost *= cursorSuppress;
      }

      dot.targetR += twinkleRadiusBoost;
      dot.radius  = lerp(dot.radius, dot.targetR, LERP_SPEED);

      // ── Color blending ──
      const t = influence;

      // Base color: blend static → cursor based on cursor proximity
      let r = Math.round(staticC.r + (cursorC.r - staticC.r) * t);
      let g = Math.round(staticC.g + (cursorC.g - staticC.g) * t);
      let b = Math.round(staticC.b + (cursorC.b - staticC.b) * t);

      // Apply global opacity for idle fade
      let alpha = globalOpacity * (0.6 + 0.4 * influence);

      // Blend twinkle color on top (additive-like)
      if (twinkleAlpha > 0.005) {
        const tw = twinkleAlpha;
        r = Math.round(r + (twinkleC.r - r) * tw);
        g = Math.round(g + (twinkleC.g - g) * tw);
        b = Math.round(b + (twinkleC.b - b) * tw);
        // Boost alpha for twinkling dots so they're visible even when idle
        alpha = Math.min(1, alpha + twinkleAlpha * 0.8);
      }

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
      ctx.fill();
    }

    animId = requestAnimationFrame(draw);
  }

  // Reset idle timer on mouse move
  function resetIdleTimer() {
    isIdle = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isIdle = true;
    }, IDLE_TIMEOUT);
  }

  // Track mouse position
  if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      resetIdleTimer();
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = -9999;
      mouse.y = -9999;
      isIdle = true;
      clearTimeout(idleTimer);
    });
  }

  // Handle resize
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  // Re-theme when theme changes
  document.addEventListener('themeChange', (e) => {
    theme = e.detail.theme;
  });

  resize();
  draw();
})();


/* ============================================
   2. DARK / LIGHT MODE
   ============================================ */
(function initTheme() {
  const btn     = document.getElementById('theme-toggle');
  const icon    = document.getElementById('theme-icon');
  const html    = document.documentElement;

  const saved   = localStorage.getItem('theme');
  const initial = saved || 'light';

  applyTheme(initial);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    if (icon) {
      icon.className = t === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
    }
    // Notify canvas
    document.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: t } }));
  }
})();


/* ============================================
   3. HAMBURGER MENU
   ============================================ */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const hamIcon   = document.getElementById('hamburger-icon');
  const navMenu   = document.getElementById('nav-menu');

  if (!hamburger || !navMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamIcon.className = isOpen ? 'bx bx-x' : 'bx bx-menu';
  });

  // Close on nav link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamIcon.className = 'bx bx-menu';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      navMenu.classList.remove('open');
      hamIcon.className = 'bx bx-menu';
    }
  });
})();


/* ============================================
   4. ACTIVE NAV LINK (SCROLL SPY)
   ============================================ */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    const scrollY = window.scrollY + 80;
    sections.forEach(sec => {
      const top    = sec.offsetTop;
      const height = sec.offsetHeight;
      const id     = sec.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ============================================
   5. TYPING EFFECT
   ============================================ */
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const words = [
    'IT Support',
    'Web Development',
    'Mobile Development',
  ];

  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let pausing  = false;

  const SPEED_TYPE = 90;
  const SPEED_DEL  = 50;
  const PAUSE_END  = 1800;
  const PAUSE_STR  = 400;

  function tick() {
    const word    = words[wordIdx];
    const current = el.textContent;

    if (pausing) return;

    if (!deleting) {
      // Typing forward
      if (charIdx <= word.length) {
        el.textContent = word.substring(0, charIdx);
        charIdx++;
        setTimeout(tick, SPEED_TYPE);
      } else {
        // Pause at end
        pausing = true;
        setTimeout(() => { pausing = false; deleting = true; tick(); }, PAUSE_END);
      }
    } else {
      // Deleting
      if (charIdx > 0) {
        el.textContent = word.substring(0, charIdx - 1);
        charIdx--;
        setTimeout(tick, SPEED_DEL);
      } else {
        // Move to next word
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        pausing  = true;
        setTimeout(() => { pausing = false; tick(); }, PAUSE_STR);
      }
    }
  }

  tick();
})();


/* ============================================
   6. MODALS + GALLERY
   ============================================ */
(function initModals() {
  const openBtns  = document.querySelectorAll('.open-modal');
  const overlays  = document.querySelectorAll('.modal-overlay');
  const closeBtns = document.querySelectorAll('.modal-close');

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('active');
      document.body.style.overflow = 'hidden';

      // Load iframe if present (lazy loading preview)
      const iframe = el.querySelector('iframe[data-src]');
      if (iframe) {
        iframe.src = iframe.dataset.src;
      }
    }
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('active');
      document.body.style.overflow = '';

      // Unload iframe if present (to release resources)
      const iframe = el.querySelector('iframe[data-src]');
      if (iframe) {
        iframe.src = '';
      }

      // Pause and reset video if present
      const video = el.querySelector('video');
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
  }

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.modal);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(btn.dataset.modal);
    });
  });

  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay.id);
      }
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlays.forEach(o => {
        if (o.classList.contains('active')) {
          closeModal(o.id);
        }
      });
    }
  });

  /* ── Gallery Setup ── */
  const gallerySets = document.querySelectorAll('.gallery-thumbnails');

  gallerySets.forEach(container => {
    const id       = container.id;                              // e.g. "gallery-thumbs-1"
    const suffix   = id ? id.replace('gallery-thumbs-', '') : '';
    const heroImg  = document.getElementById('gallery-hero-' + suffix);
    const caption  = document.getElementById('gallery-caption-' + suffix);
    const counter  = document.getElementById('gallery-counter-' + suffix);
    const prevBtn  = document.getElementById('gallery-prev-' + suffix);
    const nextBtn  = document.getElementById('gallery-next-' + suffix);
    const thumbs   = container.querySelectorAll('.gallery-thumb');

    if (!heroImg || thumbs.length === 0) return;

    let currentIdx = 0;
    const total    = thumbs.length;

    // ── Shared navigation function ──
    function navigateToIndex(idx, animate) {
      if (idx < 0) idx = total - 1;
      if (idx >= total) idx = 0;
      if (idx === currentIdx && animate) return;

      currentIdx = idx;
      const thumb = thumbs[idx];
      const src   = thumb.dataset.src;
      const alt   = thumb.dataset.alt || '';
      const cap   = thumb.dataset.caption || '';

      // Update active thumbnail
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Auto-scroll thumbnail into view
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });

      // Update counter
      if (counter) counter.textContent = (idx + 1) + ' / ' + total;

      if (animate) {
        // Smooth fade transition
        heroImg.classList.add('fade-out');
        setTimeout(() => {
          heroImg.src = src;
          heroImg.alt = alt;
          if (caption) caption.textContent = cap;
          heroImg.classList.remove('fade-out');
        }, 280);
      } else {
        heroImg.src = src;
        heroImg.alt = alt;
        if (caption) caption.textContent = cap;
      }
    }

    // ── Thumbnail clicks ──
    container.addEventListener('click', (e) => {
      const thumb = e.target.closest('.gallery-thumb');
      if (!thumb) return;
      const idx = Array.from(thumbs).indexOf(thumb);
      if (idx !== -1) navigateToIndex(idx, true);
    });

    // ── Prev / Next buttons ──
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        navigateToIndex(currentIdx - 1, true);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        navigateToIndex(currentIdx + 1, true);
      });
    }

    // ── Keyboard arrows (when modal is active) ──
    document.addEventListener('keydown', (e) => {
      // Only react if the modal containing this gallery is active
      const modal = container.closest('.modal-overlay');
      if (!modal || !modal.classList.contains('active')) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateToIndex(currentIdx - 1, true);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateToIndex(currentIdx + 1, true);
      }
    });

    // ── Reset gallery on modal close ──
    const modal = container.closest('.modal-overlay');
    if (modal) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
          if (mutation.attributeName === 'class' && !modal.classList.contains('active')) {
            navigateToIndex(0, false);
          }
        });
      });
      observer.observe(modal, { attributes: true });
    }
  });
})();


/* ============================================
   7. SCROLL TO TOP
   ============================================ */
(function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ============================================
   8. SCROLL REVEAL (IntersectionObserver)
   ============================================ */
(function initScrollReveal() {
  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Select all elements with reveal classes
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-up'
  );

  if (!revealElements.length) return;

  // If user prefers reduced motion, show everything immediately
  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  // Home section elements: reveal immediately on page load
  // (they're already in viewport, no scroll needed)
  const homeSection = document.getElementById('home');
  if (homeSection) {
    const homeReveals = homeSection.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-up'
    );
    // Small delay so the page loads first, then animate in
    setTimeout(() => {
      homeReveals.forEach(el => el.classList.add('revealed'));
    }, 150);
  }

  // IntersectionObserver for all other elements
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    {
      threshold: 0.12,    // trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px' // slight offset from bottom edge
    }
  );

  // Observe all reveal elements (except home ones already handled)
  revealElements.forEach(el => {
    // Skip home section elements — they animate on load
    if (homeSection && homeSection.contains(el)) return;
    observer.observe(el);
  });
})();