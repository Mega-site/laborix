/**
 * Dallas — Transição Estrela → Logo → Topo da Seção 03
 * Vanilla JS, guiada pelo scroll com suavização (inércia) — funciona nos dois sentidos.
 */
(function () {
  'use strict';

  function init() {
    var sec = document.querySelector('[data-star-logo]');
    var target = document.querySelector('[data-sl-target]');
    if (!sec || !target) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var sticky = sec.querySelector('.sl-sticky');
    var logo = sec.querySelector('.sl-logo');
    var slot = sec.querySelector('.sl-star-slot');
    var wing = sec.querySelector('.sl-wing');
    var text = sec.querySelector('.sl-text');
    var fly = document.querySelector('.sl-star-fly');
    var anchor = target.querySelector('.sl-star-anchor');
    var NW = 309, NH = 325;
    var SMOOTH = 0.085; // menor = mais suave

    function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }
    function lerp(a, b, t) { return a + (b - a) * t; }
    function seg(p, a, b) { return clamp((p - a) / (b - a), 0, 1); }
    function ease(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }          // easeInOutSine
    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    var sp = null;      // progresso suavizado
    var sy = null;      // posição y pós-pouso suavizada
    var running = false;

    function frame() {
      var vw = window.innerWidth, vh = window.innerHeight;
      var r = sec.getBoundingClientRect();
      var p = clamp(-r.top / (r.height - vh), 0, 1);
      if (sp === null) sp = p;
      sp += (p - sp) * SMOOTH;
      if (Math.abs(p - sp) < 0.0004) sp = p;
      var q = sp;

      // Asa e texto
      var w = ease(seg(q, 0.2, 0.48));
      var t = ease(seg(q, 0.4, 0.72));
      var f = ease(seg(q, 0.78, 0.94));
      wing.style.opacity = (w * (1 - f)).toFixed(3);
      wing.style.transform = 'translateX(' + ((1 - w) * -60).toFixed(2) + '%) scale(' + (0.55 + 0.45 * w).toFixed(3) + ')';
      var edge = t * 115;
      var m = 'linear-gradient(90deg,#000 ' + (edge - 15).toFixed(2) + '%,transparent ' + edge.toFixed(2) + '%)';
      text.style.webkitMaskImage = m;
      text.style.maskImage = m;
      text.style.opacity = (Math.min(1, t * 1.4) * (1 - f)).toFixed(3);
      text.style.transform = 'translateX(' + ((1 - t) * -1.2).toFixed(2) + '%)';
      logo.style.transform = 'scale(' + (1 - 0.025 * f).toFixed(4) + ')';
      logo.style.filter = f > 0 ? 'blur(' + (f * 3).toFixed(2) + 'px)' : '';

      // Estrela
      var st = sticky.getBoundingClientRect().top;
      var sr = slot.getBoundingClientRect();
      var ar = anchor.getBoundingClientRect();
      var offY = ar.top - target.getBoundingClientRect().top;

      var k0 = { x: vw / 2, y: st + vh / 2, w: clamp(vw * 0.2, 150, 400) };
      var k1 = { x: sr.left + sr.width / 2, y: sr.top + sr.height / 2, w: sr.width };
      var targetY = Math.min(ar.top, offY) + ar.height / 2;
      if (sy === null) sy = targetY;
      sy += (targetY - sy) * 0.18;
      var k2 = { x: ar.left + ar.width / 2, y: sy, w: ar.width };

      var a = ease(seg(q, 0.08, 0.4));
      var d = ease(seg(q, 0.78, 1));
      var x = lerp(lerp(k0.x, k1.x, a), k2.x, d);
      var y = lerp(lerp(k0.y, k1.y, a), k2.y, d) - Math.sin(Math.PI * d) * vh * 0.1;
      var sw = lerp(lerp(k0.w, k1.w, a), k2.w, easeOut(d));
      var rot = a * -90 + d * 180;

      var landed = p >= 1 && ar.top <= offY + 0.5 && Math.abs(sy - targetY) < 0.5;
      var visible = r.top < vh && !landed;
      fly.style.visibility = visible ? 'visible' : 'hidden';
      anchor.style.opacity = landed ? '1' : '0';
      if (visible) {
        fly.style.transform = 'translate3d(' + (x - NW / 2).toFixed(2) + 'px,' + (y - NH / 2).toFixed(2) + 'px,0) rotate(' + rot.toFixed(2) + 'deg) scale(' + (sw / NW).toFixed(4) + ')';
      }

      if (sp !== p || Math.abs(sy - targetY) >= 0.5) requestAnimationFrame(frame);
      else running = false;
    }

    function request() { if (!running) { running = true; requestAnimationFrame(frame); } }
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    window.addEventListener('load', request);
    request();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
