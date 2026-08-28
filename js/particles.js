/**
 * Ambient Particle & Constellation Background Canvas
 * Abhishek Jain Portfolio
 */

(function () {
  'use strict';

  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 120 };
  let animationFrameId;

  const config = {
    particleCount: window.innerWidth < 768 ? 35 : 75,
    maxDistance: 130,
    baseSpeed: 0.45,
    minRadius: 1.2,
    maxRadius: 2.8,
  };

  function getThemeColors() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    return {
      particle: isLight ? 'rgba(99, 102, 241, 0.45)' : 'rgba(99, 102, 241, 0.65)',
      line: isLight ? 'rgba(99, 102, 241, ' : 'rgba(56, 189, 248, ',
    };
  }

  let themeColors = getThemeColors();

  window.addEventListener('themeChanged', () => {
    themeColors = getThemeColors();
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  }

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.radius = Math.random() * (config.maxRadius - config.minRadius) + config.minRadius;
      this.vx = (Math.random() - 0.5) * config.baseSpeed;
      this.vy = (Math.random() - 0.5) * config.baseSpeed;
      this.baseAlpha = Math.random() * 0.5 + 0.3;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 2.5;
          this.y -= Math.sin(angle) * force * 2.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = themeColors.particle;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function initParticles() {
    particles = [];
    const count = window.innerWidth < 768 ? 35 : 75;
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.maxDistance) {
          const alpha = (1 - dist / config.maxDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `${themeColors.line}${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }

    connectParticles();
    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(resize, 150);
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrameId);
    } else {
      animate();
    }
  });

  // Start animation
  resize();
  animate();
})();
