/**
 * Dallas Home & Decor - Main Script
 * Vanilla JS - Zero Dependências Externas - Altamente Otimizado
 */

(function () {
  'use strict';

  /* =========================================================
     1. Navegação: Mobile Menu & Dropdowns
  ========================================================== */
  function initNavigation() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const burgerIcon = document.getElementById('mobile-hamburger-icon');
    const closeIcon = document.getElementById('mobile-close-icon');

    if (toggleBtn && mobileMenu) {
      toggleBtn.addEventListener('click', function () {
        const isClosed = mobileMenu.classList.contains('hidden');
        if (isClosed) {
          mobileMenu.classList.remove('hidden');
          if (burgerIcon) burgerIcon.classList.add('hidden');
          if (closeIcon) closeIcon.classList.remove('hidden');
        } else {
          mobileMenu.classList.add('hidden');
          if (burgerIcon) burgerIcon.classList.remove('hidden');
          if (closeIcon) closeIcon.classList.add('hidden');
        }
      });

      // Fecha o menu mobile ao clicar em qualquer link
      document.querySelectorAll('.mobile-nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
          mobileMenu.classList.add('hidden');
          if (burgerIcon) burgerIcon.classList.remove('hidden');
          if (closeIcon) closeIcon.classList.add('hidden');
        });
      });
    }

    // Suporte para touch/click no botão de catálogos
    const catalogoBtn = document.getElementById('catalogo-dropdown-btn');
    if (catalogoBtn) {
      catalogoBtn.addEventListener('click', function (e) {
        const parent = this.closest('.group');
        if (parent) {
          parent.classList.toggle('is-open');
        }
      });
    }
  }

  /* =========================================================
     2. Hero Tabs: Troca de Imagem no Container de Trás
  ========================================================== */
  function initHeroTabs() {
    const buttons = document.querySelectorAll('[data-hero-btn]');
    const slides = document.querySelectorAll('[data-hero-slide]');

    if (!buttons.length || !slides.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = this.getAttribute('data-hero-btn');

        // Atualiza estado ativo dos botões
        buttons.forEach(function (b) {
          b.classList.remove('is-active');
        });
        this.classList.add('is-active');

        // Atualiza slides do container de trás com crossfade suave
        slides.forEach(function (slide) {
          const isMatch = slide.getAttribute('data-hero-slide') === target;
          const vid = slide.querySelector('video');

          if (isMatch) {
            slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
            slide.classList.add('opacity-100', 'z-10');
            if (vid) {
              vid.play().catch(function () {});
            }
          } else {
            slide.classList.remove('opacity-100', 'z-10');
            slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
            if (vid) {
              vid.pause();
            }
          }
        });
      });
    });
  }

  /* =========================================================
     3. Slider Interativo Comparativo (Antes / Depois)
  ========================================================== */
  function initSliders() {
    const sliders = document.querySelectorAll('[data-slider]');
    sliders.forEach(function (slider) {
      const before = slider.querySelector('[data-before]');
      const line = slider.querySelector('[data-line]');
      const handle = slider.querySelector('[data-handle]');

      if (!before || !line) return;

      let isDragging = false;

      function setPosition(clientX) {
        const rect = slider.getBoundingClientRect();
        const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        const percent = (x / rect.width) * 100;

        before.style.clipPath = 'inset(0 ' + (100 - percent) + '% 0 0)';
        line.style.left = percent + '%';
        if (handle) {
          handle.style.left = percent + '%';
        }
      }

      function onPointerDown(e) {
        isDragging = true;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        if (clientX !== undefined) setPosition(clientX);
      }

      function onPointerMove(e) {
        if (!isDragging) return;
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        if (clientX !== undefined) setPosition(clientX);
      }

      function onPointerUp() {
        isDragging = false;
      }

      slider.addEventListener('mousedown', onPointerDown);
      slider.addEventListener('touchstart', onPointerDown, { passive: true });

      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('touchmove', onPointerMove, { passive: true });

      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchend', onPointerUp);
    });
  }

  /* =========================================================
     4. Animações de Scroll Reveal (IntersectionObserver)
  ========================================================== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      reveals.forEach(function (el) {
        el.classList.add('animate-in');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* =========================================================
     5. Controle Inteligente do Vídeo no Hero
  ========================================================== */
  function initVideos() {
    const videos = document.querySelectorAll('video[data-aura-video-preset="loop-in-view"]');
    if (!videos.length) return;

    if (!('IntersectionObserver' in window)) {
      videos.forEach(function (v) {
        v.play().catch(function () {});
      });
      return;
    }

    const videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const v = entry.target;
          const slide = v.closest('[data-hero-slide]');
          if (slide && slide.classList.contains('opacity-0')) {
            v.pause();
            return;
          }

          if (entry.isIntersecting) {
            v.play().catch(function () {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    videos.forEach(function (v) {
      v.muted = true;
      v.playsInline = true;
      v.loop = true;
      videoObserver.observe(v);
    });
  }

  /* =========================================================
     6. Smooth Scroll para Links Internos (com offset para header fixo)
  ========================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 90;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* =========================================================
     7. Inicialização Geral
  ========================================================== */
  function init() {
    initNavigation();
    initHeroTabs();
    initSliders();
    initScrollReveal();
    initVideos();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
