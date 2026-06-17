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
      + 3D Starfield Effect with Depth Tiers
   ============================================ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Detect mobile and preferences
  const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Grid spacing: larger spacing means fewer dots and much better performance
  const GRID_SPACE = isMobile ? 26 : 20; 
  const RADIUS     = isMobile ? 120 : 180; // Cursor influence radius
  const LERP_SPEED = 0.12;

  // Idle fade settings
  const IDLE_TIMEOUT   = 1800;
  const OPACITY_ACTIVE = 1.0;
  const OPACITY_IDLE   = 0.35; // Raised slightly so dots stay visible when idle
  const FADE_SPEED     = 0.02; // Smoother transition

  // Depth tiers for twinkling stars
  const TIERS = [
    { name: 'far',  chance: 0.03, dotBase: 0.4, dotMax: 0.8, twinkleMax: 0.3,  driftAmp: 0.4, driftSpeed: 0.0002, glowSize: 0, flareChance: 0 },
    { name: 'mid',  chance: 0.02, dotBase: 0.6, dotMax: 1.2, twinkleMax: 0.5,  driftAmp: 0.8, driftSpeed: 0.0004, glowSize: 3, flareChance: 0 },
    { name: 'near', chance: 0.01, dotBase: 0.8, dotMax: 1.6, twinkleMax: 0.65, driftAmp: 1.4, driftSpeed: 0.0006, glowSize: 5, flareChance: 0.1 },
  ];
  const TOTAL_TWINKLE_CHANCE = TIERS.reduce((s, t) => s + t.chance, 0);

  const PLAIN_DOT_BASE = 0.5;
  const PLAIN_DOT_MAX  = 1.2;

  // Twinkle wave speeds (dual sine)
  const WAVE_SPEED_A_MIN = 0.0008;
  const WAVE_SPEED_A_MAX = 0.0020;
  const WAVE_SPEED_B_MIN = 0.0004;
  const WAVE_SPEED_B_MAX = 0.0010;

  // Cursor ambient glow settings
  const CURSOR_GLOW_RADIUS = isMobile ? 100 : 180;
  const CURSOR_GLOW_ALPHA  = 0.08;

  let mouse = { x: -9999, y: -9999 };
  let smoothMouse = { x: -9999, y: -9999 };
  let dots  = [];
  let animId;
  let theme = document.documentElement.getAttribute('data-theme') || 'light';

  // State variables for smooth canvas color transitions
  let targetColors = getColors();
  let currentStaticColor = hexToRgb(targetColors.static);
  let currentCursorColor = hexToRgb(targetColors.cursor);
  let currentTwinkleColors = {
    far: getTwinkleColor('far'),
    mid: getTwinkleColor('mid'),
    near: getTwinkleColor('near')
  };

  let idleTimer    = null;
  let isIdle       = true;
  let globalOpacity = OPACITY_IDLE;

  // Spark settings and arrays (expanding horizontal/vertical line pulses)
  const SPARK_INTERVAL = [120, 300];  // Jeda antar kemunculan spark baru (ms)
  const SPARK_DURATION = [500, 1000]; // Durasi satu spark (ms)
  const SPARK_LEN      = [20, 50];     // Panjang garis spark (px)
  let sparks = [];
  let nextSparkAt = 0;

  // Seeded pseudo-random generator
  function seededRandom(seed) {
    let x = Math.sin(seed) * 43758.5453;
    return x - Math.floor(x);
  }

  // Define static dot color and cursor highlight color
  function getColors() {
    if (theme === 'dark') {
      return { static: '#1F2226', cursor: '#3B82F6' }; // Accent blue in dark mode
    }
    return { static: '#E5E7EB', cursor: '#2563EB' }; // Accent blue in light mode
  }

  // Twinkle star colors (following blue accent theme)
  function getTwinkleColor(tierName) {
    if (theme === 'dark') {
      switch (tierName) {
        case 'far':  return { r: 120, g: 150, b: 220 }; // Soft ice blue
        case 'mid':  return { r: 150, g: 180, b: 255 }; // Bright blue-white
        case 'near': return { r: 210, g: 225, b: 255 }; // Pure star white-blue
      }
    }
    switch (tierName) {
      case 'far':  return { r: 180, g: 200, b: 240 };
      case 'mid':  return { r: 140, g: 170, b: 230 };
      case 'near': return { r: 37, g: 99, b: 235 };
    }
  }

  function hexToRgb(hex) {
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
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
        const idx  = r * cols + c;
        const seed = idx * 7 + r * 13 + c * 31;
        const rng  = seededRandom(seed);

        // Assign a depth tier for movement/parallax for all dots
        const depthRng = seededRandom(seed + 400);
        let depth = 0.3;      // Far
        let driftAmp = 0.5;
        let driftSpeed = 0.00025;

        if (depthRng > 0.85) {
          depth = 1.0;        // Near
          driftAmp = 1.6;
          driftSpeed = 0.0006;
        } else if (depthRng > 0.55) {
          depth = 0.6;        // Mid
          driftAmp = 1.0;
          driftSpeed = 0.0004;
        }

        const dot = {
          baseX:   c * GRID_SPACE,
          baseY:   r * GRID_SPACE,
          x:       c * GRID_SPACE,
          y:       r * GRID_SPACE,
          radius:  PLAIN_DOT_BASE,
          targetR: PLAIN_DOT_BASE,
          depth:   depth,
          driftAmp: driftAmp,
          driftSpeed: driftSpeed,
          seed:    seed,
          twinkle: false,
        };

        // Twinkle assignment (only a small subset of dots twinkle)
        if (rng < TOTAL_TWINKLE_CHANCE) {
          let acc = 0;
          for (const tier of TIERS) {
            acc += tier.chance;
            if (rng < acc) {
              dot.twinkle  = true;
              dot.tier     = tier;

              const rng2 = seededRandom(seed + 999);
              const rng3 = seededRandom(seed + 1777);
              const rng4 = seededRandom(seed + 2345);
              const rng5 = seededRandom(seed + 3141);
              const rng6 = seededRandom(seed + 4567);

              // Dual sine wave parameters
              dot.phaseA = rng2 * Math.PI * 2;
              dot.phaseB = rng5 * Math.PI * 2;
              dot.speedA = WAVE_SPEED_A_MIN + rng3 * (WAVE_SPEED_A_MAX - WAVE_SPEED_A_MIN);
              dot.speedB = WAVE_SPEED_B_MIN + rng6 * (WAVE_SPEED_B_MAX - WAVE_SPEED_B_MIN);
              dot.twinkleMax = 0.15 + rng4 * (tier.twinkleMax - 0.15);

              // Drift parameters
              dot.driftPhaseX = rng2 * Math.PI * 2;
              dot.driftPhaseY = rng3 * Math.PI * 2;
              dot.driftAmp    = tier.driftAmp;
              dot.driftSpeed  = tier.driftSpeed * (0.8 + rng4 * 0.4);

              // Flare parameters (extremely rare, only near dots, disabled on mobile)
              dot.canFlare    = !isMobile && tier.flareChance > 0 && rng4 < tier.flareChance;
              dot.flarePhase  = rng5 * Math.PI * 2;
              dot.flareSpeed  = 0.0002 + rng6 * 0.0003;

              break;
            }
          }
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
    
    // Smoothly interpolate colors frame-by-frame
    const colors = getColors();
    const targetStaticRGB = hexToRgb(colors.static);
    const targetCursorRGB = hexToRgb(colors.cursor);

    currentStaticColor.r = lerp(currentStaticColor.r, targetStaticRGB.r, 0.08);
    currentStaticColor.g = lerp(currentStaticColor.g, targetStaticRGB.g, 0.08);
    currentStaticColor.b = lerp(currentStaticColor.b, targetStaticRGB.b, 0.08);

    currentCursorColor.r = lerp(currentCursorColor.r, targetCursorRGB.r, 0.08);
    currentCursorColor.g = lerp(currentCursorColor.g, targetCursorRGB.g, 0.08);
    currentCursorColor.b = lerp(currentCursorColor.b, targetCursorRGB.b, 0.08);

    for (const key of ['far', 'mid', 'near']) {
      const targetT = getTwinkleColor(key);
      currentTwinkleColors[key].r = lerp(currentTwinkleColors[key].r, targetT.r, 0.08);
      currentTwinkleColors[key].g = lerp(currentTwinkleColors[key].g, targetT.g, 0.08);
      currentTwinkleColors[key].b = lerp(currentTwinkleColors[key].b, targetT.b, 0.08);
    }

    const staticC = currentStaticColor;
    const cursorC = currentCursorColor;
    const now     = timestamp || performance.now();
    const isDark  = theme === 'dark';

    // Smooth global opacity
    const targetOpacity = isIdle ? OPACITY_IDLE : OPACITY_ACTIVE;
    globalOpacity = lerp(globalOpacity, targetOpacity, FADE_SPEED);

    // Smooth cursor position
    smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.15);
    smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.15);

    // Spawning spark
    if (!prefersReduced && now >= nextSparkAt) {
      if (dots.length > 0) {
        const randDot = dots[(Math.random() * dots.length) | 0];
        sparks.push({
          dot: randDot,
          start: now,
          duration: SPARK_DURATION[0] + Math.random() * (SPARK_DURATION[1] - SPARK_DURATION[0]),
          len: SPARK_LEN[0] + Math.random() * (SPARK_LEN[1] - SPARK_LEN[0]),
          axis: Math.random() < 0.5 ? 'h' : 'v',
        });
      }
      nextSparkAt = now + SPARK_INTERVAL[0] + Math.random() * (SPARK_INTERVAL[1] - SPARK_INTERVAL[0]);
    }

    // ── Ambient cursor spotlight glow (only when mouse is active & desktop & not reduced motion) ──
    if (smoothMouse.x > -1000 && !isMobile && !prefersReduced) {
      const glowAlpha = CURSOR_GLOW_ALPHA * globalOpacity;
      const grad = ctx.createRadialGradient(
        smoothMouse.x, smoothMouse.y, 0,
        smoothMouse.x, smoothMouse.y, CURSOR_GLOW_RADIUS
      );
      if (isDark) {
        grad.addColorStop(0, `rgba(59,130,246,${(glowAlpha * 1.2).toFixed(3)})`);
        grad.addColorStop(0.5, `rgba(37,99,235,${(glowAlpha * 0.4).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(37,99,235,0)');
      } else {
        grad.addColorStop(0, `rgba(37,99,235,${(glowAlpha * 0.6).toFixed(3)})`);
        grad.addColorStop(0.6, `rgba(37,99,235,${(glowAlpha * 0.2).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(37,99,235,0)');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(
        smoothMouse.x - CURSOR_GLOW_RADIUS,
        smoothMouse.y - CURSOR_GLOW_RADIUS,
        CURSOR_GLOW_RADIUS * 2,
        CURSOR_GLOW_RADIUS * 2
      );
    }

    // ── Draw dots ──
    for (const dot of dots) {
      // 1. Move/Drift & Wave ripple math
      if (!prefersReduced) {
        const timeFactor = now * dot.driftSpeed;
        
        // Gentle local float/drift
        const localDriftX = Math.sin(timeFactor + dot.seed) * dot.driftAmp;
        const localDriftY = Math.cos(timeFactor * 0.9 + dot.seed * 1.3) * dot.driftAmp;

        // Subtle wave passing across screen
        const waveVal = now * 0.0005;
        const rippleX = Math.sin(waveVal + (dot.baseX * 0.004) + (dot.baseY * 0.003)) * 1.2 * dot.depth;
        const rippleY = Math.cos(waveVal * 0.85 + (dot.baseX * 0.003) + (dot.baseY * 0.004)) * 1.2 * dot.depth;

        dot.x = dot.baseX + localDriftX + rippleX;
        dot.y = dot.baseY + localDriftY + rippleY;
      } else {
        dot.x = dot.baseX;
        dot.y = dot.baseY;
      }

      const dx   = mouse.x - dot.x;
      const dy   = mouse.y - dot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / RADIUS);

      // 2. Twinkle logic (dual sine)
      let twinkleAlpha = 0;
      let twinkleRadiusBoost = 0;
      let twinkleC = null;
      let isFlaring = false;

      if (dot.twinkle && !prefersReduced) {
        const tier = dot.tier;
        twinkleC = currentTwinkleColors[tier.name];

        const waveA = Math.sin(now * dot.speedA + dot.phaseA);
        const waveB = Math.sin(now * dot.speedB + dot.phaseB);
        const combined = (waveA * 0.65 + waveB * 0.35 + 1) * 0.5; // 0 to 1
        const eased = combined * combined; // Quadratic easing for crispness

        twinkleAlpha = eased * dot.twinkleMax;
        twinkleRadiusBoost = eased * (tier.dotMax - tier.dotBase) * 0.3;

        // Rare lens flare for near stars in dark mode
        if (dot.canFlare && isDark) {
          const flareWave = Math.sin(now * dot.flareSpeed + dot.flarePhase);
          const flareT = Math.max(0, (flareWave - 0.88) / 0.12);
          if (flareT > 0) {
            isFlaring = true;
            twinkleAlpha = Math.min(0.9, twinkleAlpha + flareT * 0.4);
            twinkleRadiusBoost += flareT * 1.2;
          }
        }

        // Suppress twinkling close to cursor to let spotlight shine cleanly
        const cursorSuppress = 1 - influence;
        twinkleAlpha *= cursorSuppress;
        twinkleRadiusBoost *= cursorSuppress;

        dot.targetR = tier.dotBase + (tier.dotMax - tier.dotBase) * influence + twinkleRadiusBoost;
      } else {
        dot.targetR = PLAIN_DOT_BASE + (PLAIN_DOT_MAX - PLAIN_DOT_BASE) * influence;
      }

      // Smooth radius transition
      dot.radius = lerp(dot.radius, dot.targetR, LERP_SPEED);

      // 3. Color blending (incorporating theme colors & cursor influence)
      const t = influence;
      let cr = Math.round(staticC.r + (cursorC.r - staticC.r) * t);
      let cg = Math.round(staticC.g + (cursorC.g - staticC.g) * t);
      let cb = Math.round(staticC.b + (cursorC.b - staticC.b) * t);
      
      // Base alpha: static opacity at idle, brighter when cursor influence is high
      let alpha = globalOpacity * (0.5 + 0.5 * influence);

      // Blend twinkle color (if twinkling and not suppressed)
      if (dot.twinkle && twinkleAlpha > 0.005 && twinkleC && !prefersReduced) {
        const tw = twinkleAlpha;
        if (isDark) {
          // Additive blend for luminous night sky feel
          cr = Math.min(255, Math.round(cr + twinkleC.r * tw));
          cg = Math.min(255, Math.round(cg + twinkleC.g * tw));
          cb = Math.min(255, Math.round(cb + twinkleC.b * tw));
          alpha = Math.min(0.95, alpha + twinkleAlpha * 0.8);
        } else {
          // Normal soft blend for light mode to stay clean
          cr = Math.round(cr + (twinkleC.r - cr) * tw);
          cg = Math.round(cg + (twinkleC.g - cg) * tw);
          cb = Math.round(cb + (twinkleC.b - cb) * tw);
          alpha = Math.min(0.7, alpha + twinkleAlpha * 0.4);
        }
      }

      // 4. Render dot onto canvas
      // Render radial glow halo only for twinkle stars in dark mode to save performance
      if (isDark && dot.twinkle && twinkleAlpha > 0.02 && dot.tier.glowSize > 0 && !isMobile && !prefersReduced) {
        const glowR = dot.radius + dot.tier.glowSize * twinkleAlpha;
        const grad = ctx.createRadialGradient(
          dot.x, dot.y, dot.radius * 0.2,
          dot.x, dot.y, glowR
        );
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${(alpha * 0.8).toFixed(3)})`);
        grad.addColorStop(0.5, `rgba(${cr},${cg},${cb},${(alpha * 0.25).toFixed(3)})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Draw solid bright core
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${Math.min(1, alpha * 1.2).toFixed(3)})`;
        ctx.fill();

        // Draw flare lines
        if (isFlaring) {
          const flarLen = dot.radius * 4;
          const fAlpha = twinkleAlpha * 0.2;
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${fAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(dot.x - flarLen, dot.y);
          ctx.lineTo(dot.x + flarLen, dot.y);
          ctx.moveTo(dot.x, dot.y - flarLen);
          ctx.lineTo(dot.x, dot.y + flarLen);
          ctx.stroke();
        }
      } else {
        // Draw simple dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha.toFixed(3)})`;
        ctx.fill();
      }
    }

    // ── Draw Sparks (horizontal / vertical glowing lines that expand and fade) ──
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      const progress = (now - s.start) / s.duration;
      if (progress >= 1) {
        sparks.splice(i, 1);
        continue;
      }
      const envelope = Math.sin(progress * Math.PI); // 0 -> 1 -> 0
      const len = s.len * envelope;
      const alpha = (0.35 + 0.65 * envelope) * globalOpacity;

      ctx.save();
      ctx.strokeStyle = isDark ? `rgba(255,255,255,${alpha.toFixed(3)})` : `rgba(37,99,235,${alpha.toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.shadowColor = isDark ? 'rgba(59,130,246,0.55)' : 'rgba(37,99,235,0.3)';
      ctx.shadowBlur = 6 * envelope;
      
      ctx.beginPath();
      if (s.axis === 'h') {
        ctx.moveTo(s.dot.x - len / 2, s.dot.y);
        ctx.lineTo(s.dot.x + len / 2, s.dot.y);
      } else {
        ctx.moveTo(s.dot.x, s.dot.y - len / 2);
        ctx.lineTo(s.dot.x, s.dot.y + len / 2);
      }
      ctx.stroke();
      ctx.restore();
    }

    animId = requestAnimationFrame(draw);
  }

  // Idle timer
  function resetIdleTimer() {
    isIdle = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isIdle = true;
    }, IDLE_TIMEOUT);
  }

  // Mouse tracking
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

  // Resize
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  // Theme change
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

  // Read initial theme set by early script, or default to light
  const currentTheme = html.getAttribute('data-theme') || 'light';
  
  // Set correct class immediately on load
  if (icon) {
    icon.className = currentTheme === 'dark' ? 'bx bx-sun' : 'bx bx-moon';
  }

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    
    // Add rotating class for click feedback animation
    if (icon) {
      icon.classList.add('theme-animating');
      setTimeout(() => {
        icon.classList.remove('theme-animating');
      }, 500);
    }

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
      Dynamically handles all modal popups (modal-1 to modal-4)
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

  // Home section elements: reveal immediately after preloader finishes
  const homeSection = document.getElementById('home');
  if (homeSection) {
    const homeReveals = homeSection.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-up'
    );
    
    const preloader = document.getElementById('preloader');
    if (preloader) {
      document.addEventListener('preloaderComplete', () => {
        setTimeout(() => {
          homeReveals.forEach(el => el.classList.add('revealed'));
        }, 150);
      });
    } else {
      setTimeout(() => {
        homeReveals.forEach(el => el.classList.add('revealed'));
      }, 150);
    }
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


/* ============================================
   PRELOADER SYSTEM
   ============================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const percentEl = document.getElementById('preloader-percent');
  const circleBar = document.getElementById('preloader-circle-bar');
  if (!preloader || !percentEl || !circleBar) return;

  document.body.classList.add('preloader-active');

  const totalLength = 283; // 2 * Math.PI * 45
  let currentPercent = 0;
  
  // Simulate loading speed
  const duration = 2200; // 2.2 seconds loading time
  const intervalTime = 15; // update every 15ms
  const step = 100 / (duration / intervalTime);

  const timer = setInterval(() => {
    currentPercent += step;
    if (currentPercent >= 100) {
      currentPercent = 100;
      clearInterval(timer);
      finishLoading();
    }

    const percentInt = Math.floor(currentPercent);
    percentEl.textContent = `${percentInt}%`;
    
    // Update SVG circle stroke-dashoffset
    const offset = totalLength - (totalLength * percentInt) / 100;
    circleBar.style.strokeDashoffset = offset;
  }, intervalTime);

  function finishLoading() {
    setTimeout(() => {
      preloader.classList.add('loaded');
      document.body.classList.remove('preloader-active');

      // Dispatch custom event so home section reveals itself
      document.dispatchEvent(new Event('preloaderComplete'));
    }, 200); // short delay after reaching 100%
  }
})();