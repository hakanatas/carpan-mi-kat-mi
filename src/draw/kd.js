/* Shared layout + Nokta helpers for "Çarpan mı, Kat mı?". */
(function (LI) {
  'use strict';
  const { clamp } = LI.E;
  LI.KD = {
    /** positions for 16:9 and 9:16 */
    L(env) {
      return env.V
        ? {
          CX: { x: 0, y: -700, s: 46, w: 960 },
          AR: { x: 0, y: -330, sp: 72, ly: 175 },
          FAC: { x: 0, ly: 20, y: 105, s: 50, gap: 78 },
          NL: { x0: -450, x1: 450, y: -250, n: 24, lab: 22, r: 0.9 },
          MUL: { x: 0, y: -100, s: 42, w: 960 },
          A7: { x: 0, y: -500, sp: 56, ly: 140 },
          A9: { x: 0, y: -160, sp: 56, ly: 140 },
          ST: { x: 0, y: [80, 165, 250], s: 44, w: 960 },
          SUM: { x: 0, y: [-380, -210, -110, -10], s: [110, 54, 54, 44], w: 960 },
          nx: -360, gy: 560, s: 1.15 }
        : {
          CX: { x: 60, y: -420, s: 50, w: 1300 },
          AR: { x: 60, y: -150, sp: 70, ly: 190 },
          FAC: { x: 60, ly: 180, y: 255, s: 52, gap: 86 },
          NL: { x0: -560, x1: 820, y: -40, n: 24, lab: 28, r: 1 },
          MUL: { x: 130, y: 110, s: 48, w: 1300 },
          A7: { x: -220, y: -200, sp: 52, ly: 170 },
          A9: { x: 470, y: -200, sp: 52, ly: 170 },
          ST: { x: 130, y: [135, 215, 295], s: 50, w: 1250 },
          SUM: { x: 100, y: [-280, -120, -30, 60], s: [120, 60, 60, 46], w: 1300 },
          nx: -800, gy: 262, s: 1.15 };
    },
    cam(env, o = {}) { return Object.assign({ x: env.V ? 0 : -60, y: env.V ? 60 : 0, zoom: 1, rot: 0, tilt: 1 }, o); },
    /** pupils + face toward a world point */
    look(p, target) {
      const e = LI.Nokta.eyes(p)[0];
      const dx = target[0] - e[0], dy = target[1] - e[1], d = Math.hypot(dx, dy) || 1;
      p.lookX = clamp(dx / d * 1.1, -1, 1); p.lookY = clamp(dy / d * 1.1, -1, 1);
      p.turn = clamp(dx / 900, -0.5, 0.5);
      return p;
    },
    /** a short ground stroke under Nokta */
    ground(ctx, env, x, gy) { LI.Ambient.ground(ctx, x - 360, x + 360, gy + 6, { alpha: 0.32 }); },
  };
})(window.LI = window.LI || {});
