/* ─────────────────────────────────────────────────────────────
   The film's continuous state as pure functions of time.
   12 dots are arranged into rectangles (1×12, 2×6, 3×4; 5 leaves 2 over):
   the sides are the factors of 12. Jumps of 4 on a number line give the
   multiples of 4, and 12 is among them. Then 7 and 9 test two claims:
   1 and the number itself are always factors; factors stop, multiples go on.
   ───────────────────────────────────────────────────────────── */
(function (LI) {
  'use strict';
  const { seg, clamp, lerp, outBack, outCubic, inOut, hump } = LI.E;
  const A = LI.Ang, KD = LI.KD, Ink = LI.Ink;

  const T = (ctx, s, x, y, o = {}) => A.text(ctx, s, x, y, Object.assign({ size: 48 }, o));
  const AMB = { color: A.amber };
  /** text width in the brush font */
  function width(ctx, s, size) { ctx.save(); ctx.font = `${size}px "LI Brush", "Comic Sans MS", cursive`; const w = ctx.measureText(s).width; ctx.restore(); return w; }
  /** write text, shrinking it to fit width w */
  function fit(ctx, s, x, y, size, w, o = {}) { const m = width(ctx, s, size); T(ctx, s, x, y, Object.assign({ size: m > w ? size * w / m : size }, o)); }
  /** a hand-drawn check mark at (x, y) */
  function tick(ctx, x, y, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x, y], [x + 12, y + 14], [x + 38, y - 20]], { w: 7, p, alpha: a, color: LI.AMBER_RGB, seed: 401, taper: [0.05, 0.3] });
  }
  /** a hand-drawn cross over (x, y) */
  function cross(ctx, x, y, r, p, a = 1) {
    if (p <= 0 || a <= 0) return;
    Ink.path(ctx, [[x - r, y - r], [x + r, y + r]], { w: 6, p: clamp(p * 2), alpha: a, color: LI.AMBER_RGB, seed: 411, taper: [0.1, 0.3] });
    Ink.path(ctx, [[x + r, y - r], [x - r, y + r]], { w: 6, p: clamp(p * 2 - 1), alpha: a, color: LI.AMBER_RGB, seed: 412, taper: [0.1, 0.3] });
  }

  /* ── dot arrays ─────────────────────────────────────────── */
  /** position of dot i when n dots sit in rows of `cols`, centred on C */
  function gridPos(n, cols, C, sp, i) {
    const rows = Math.ceil(n / cols), c = i % cols, r = Math.floor(i / cols);
    return [C[0] + (c - (cols - 1) / 2) * sp, C[1] + (r - (rows - 1) / 2) * sp];
  }
  /** a loose pile (scene 1) */
  function pilePos(C, sp, i) {
    const a = i * 2.39996, r = sp * 0.62 * Math.sqrt(i + 0.6);
    return [C[0] + Math.cos(a) * r, C[1] + 20 + Math.sin(a) * r * 0.8];
  }
  const posOf = (n, cols, C, sp, i) => (cols === 'pile' ? pilePos(C, sp, i) : gridPos(n, cols, C, sp, i));
  /** index of the key active at t, and the morph amount for dot i */
  function keyAt(K, t) { let k = 0; while (k + 1 < K.length && t >= K[k + 1][0]) k++; return k; }
  function dotPos(K, n, C, sp, i, t) {
    const k = keyAt(K, t), cur = posOf(n, K[k][1], C, sp, i);
    if (k === 0) return cur;
    const prev = posOf(n, K[k - 1][1], C, sp, i), m = inOut(seg(t, K[k][0] + i * 0.03, K[k][0] + 0.7 + i * 0.03));
    return [lerp(prev[0], cur[0], m), lerp(prev[1], cur[1], m)];
  }
  /** is dot i "left over" (the incomplete last row) for this many columns? */
  const extra = (n, cols, i) => cols !== 'pile' && n % cols !== 0 && i >= Math.floor(n / cols) * cols;
  /** a dot of the array: ink, or amber when left over */
  function bead(ctx, x, y, r, a, hot, seed) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    Ink.dot(ctx, x, y, r, { seed, bleed: 0.3, color: hot > 0.5 ? LI.AMBER_RGB : undefined });
    ctx.restore();
  }
  /** draw an n-dot array following key list K; returns {cols, rows, k, m} */
  function array(ctx, K, n, C, sp, t, a, o = {}) {
    const k = keyAt(K, t), cols = K[k][1];
    const m = k === 0 ? 1 : seg(t, K[k][0] + 0.2, K[k][0] + 1.2);
    for (let i = 0; i < n; i++) {
      let [x, y] = dotPos(K, n, C, sp, i, t), da = a;
      if (o.drop) { const td = o.drop(i), f = seg(t, td, td + 0.55); if (f <= 0) continue; y = lerp(y - 700, y, outCubic(f)); da *= clamp(f * 3); }
      bead(ctx, x, y, sp * 0.24, da, extra(n, cols, i) && m > 0.3 ? 1 : 0, 900 + i * 7 + n);
    }
    // an outline round the full rows once the dots have settled
    if (cols !== 'pile' && m > 0) {
      const full = Math.floor(n / cols), rows = Math.ceil(n / cols);
      if (full > 0) {
        const x0 = C[0] - cols / 2 * sp, x1 = C[0] + cols / 2 * sp, y0 = C[1] - rows / 2 * sp, y1 = y0 + full * sp;
        Ink.path(ctx, [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]], { w: 4, p: m, alpha: 0.55 * a * (o.box ?? 1), seed: 700 + cols + n, taper: [0, 0], wob: 0.15 });
      }
    }
    return { cols, rows: cols === 'pile' ? 0 : Math.ceil(n / cols), k, m };
  }

  /* ── number line ────────────────────────────────────────── */
  const nlx = (NL, v) => NL.x0 + (NL.x1 - NL.x0) * v / NL.n;
  function numberLine(ctx, NL, a, p = 1) {
    if (a <= 0) return;
    Ink.path(ctx, [[NL.x0 - 20, NL.y], [NL.x1 + 30, NL.y]], { w: 5, p, alpha: a, seed: 61, taper: [0, 0.2], wob: 0.1 });
    for (let v = 0; v <= NL.n; v++) {
      const g = seg(p, v / NL.n * 0.9, v / NL.n * 0.9 + 0.1); if (g <= 0) continue;
      const x = nlx(NL, v), big = v % 4 === 0;
      Ink.path(ctx, [[x, NL.y - (big ? 12 : 8)], [x, NL.y + (big ? 12 : 8)]], { w: 3, alpha: a * g, seed: 62 + v, taper: [0, 0] });
      T(ctx, String(v), x, NL.y + 36 * NL.r, { size: NL.lab, alpha: a * g * 0.8 });
    }
  }
  /** an amber jump from u to v on the number line (p: draw-on) */
  function jump(ctx, NL, u, v, p, a, seed) {
    if (p <= 0 || a <= 0) return;
    const x0 = nlx(NL, u), x1 = nlx(NL, v), h = Math.min(110, (x1 - x0) * 0.55), pts = [];
    for (let s = 0; s <= 24; s++) { const k = s / 24; pts.push([lerp(x0, x1, k), NL.y - 8 - h * Math.sin(Math.PI * k)]); }
    Ink.path(ctx, pts, { w: 5, p, alpha: a, color: LI.AMBER_RGB, seed, taper: [0.1, 0.1], wob: 0.1 });
    if (p > 0.95) { const e = pts[24], d = pts[21]; const ang = Math.atan2(e[1] - d[1], e[0] - d[0]);
      [0.5, -0.5].forEach((q, j) => Ink.path(ctx, [e, [e[0] - 18 * Math.cos(ang + q), e[1] - 18 * Math.sin(ang + q)]], { w: 4, alpha: a, color: LI.AMBER_RGB, seed: seed + 3 + j, taper: [0, 0.3] })); }
  }
  /** a marked point on the line (ink ring + dot) */
  function mark(ctx, NL, v, k, a, hot) {
    if (k <= 0 || a <= 0) return;
    const x = nlx(NL, v), r = 11 * outBack(clamp(k));
    ctx.fillStyle = hot ? `rgba(${LI.AMBER_RGB},${a})` : `rgba(${LI.INK_RGB},${0.85 * a})`;
    ctx.beginPath(); ctx.arc(x, NL.y, r, 0, Math.PI * 2); ctx.fill();
  }

  /** Nokta, as a function of time */
  function nokta(t, env) {
    const L = KD.L(env);
    const p = { x: L.nx, y: L.gy, s: L.s, mouth: 0.4, brow: 0.1 };
    const g = outCubic(seg(t, 1.3, 2.3));
    p.born = { body: lerp(0.3, 1, g), legs: outCubic(seg(t, 2.0, 2.6)), arms: outCubic(seg(t, 2.3, 2.8)), tuft: outBack(seg(t, 2.5, 2.9)) };
    if (t < 3.0) { p.sq = lerp(0.4, 1, clamp(LI.E.spring(seg(t, 1.3, 3.0) * 2, 8, 3.4), 0, 1.3)); p.drop = 1 - g; p.wobble = 1 - seg(t, 1.3, 2.8); }
    p.eyeOpen = outCubic(seg(t, 2.8, 3.1));
    KD.look(p, [L.AR.x, L.AR.y]);
    if (t > 30 && t < 46) KD.look(p, [(L.NL.x0 + L.NL.x1) / 2, L.NL.y]);
    if (t > 46 && t < 53) KD.look(p, [L.A7.x, L.A7.y]);
    if (t > 53 && t < 64) KD.look(p, [L.A9.x, L.A9.y]);
    if (t > 64 && t < 80) KD.look(p, [(L.NL.x0 + L.NL.x1) / 2, L.NL.y]);
    if (t > 80 && t < 84) KD.look(p, [L.SUM.x, L.SUM.y[1]]);
    if (t > 2.9 && t < 5.6) { p.hold = 'brush'; p.brushAng = -0.8 + 0.3 * Math.sin(t * 9); p.hands = { R: [1.35, -0.2 + 0.15 * Math.sin(t * 9)] }; }
    const pointing = (a, b) => { if (t > a && t < b) { p.point = 'R'; p.hands = { L: [-1.2, 0.55], R: [1.5, -0.35] }; } };
    pointing(11.0, 13.0); pointing(15.0, 17.0); pointing(19.0, 21.0); pointing(41.8, 44.0); pointing(57.6, 59.6); pointing(66.0, 68.0); pointing(76.0, 77.6); pointing(80.6, 82.4);
    const think = seg(t, 22.8, 23.2) * (1 - seg(t, 24.4, 24.7));
    if (think > 0) { p.hands = { L: [-1.2, 0.55], R: [0.75, -1.05 + 0.08 * Math.sin(t * 14)] }; p.brow = -0.5 * think; p.mouth = 0; p.lookY -= 0.3; }
    if (t > 55.4 && t < 56.6) { p.mouthOpen = 0.55; p.eyeScale = 1.1; }
    const joy = (a, b) => { if (t > a && t < b) { p.squint = 1; p.mouth = 1; p.sq = 1 + 0.1 * hump(t, a, a + 0.6); p.y -= 26 * hump(t, a, a + 0.6); p.hands = { L: [-1.3, -0.35], R: [1.3, -0.35] }; } };
    joy(27.2, 28.8); joy(39.0, 40.6); joy(62.0, 63.6); joy(78.0, 79.6);
    if (t > 84.0) {
      const j = (t - 84.0) % 1.4;
      p.squint = 1; p.mouth = 1; p.turn = 0.15; p.lookX = 0.3; p.lookY = 0;
      p.sq = 1 + 0.1 * Math.sin(Math.PI * clamp(j / 0.6)); p.y -= 40 * Math.sin(Math.PI * clamp(j / 0.6));
      p.hands = { L: [-1.35, -0.6 - 0.2 * Math.sin(t * 6)], R: [1.35, -0.6 + 0.2 * Math.sin(t * 6)] };
      if (t > 89.2) { p.squint = 0; p.lookX = 0; p.lookY = 0.2; p.turn = 0; p.y = L.gy; p.sq = 1; p.hands = { L: [-1.2, 0.55], R: [1.2, -1.0 + 0.25 * Math.sin(t * 10)] }; }
    }
    p.blink = Math.max(hump(t, 5.8, 5.95), hump(t, 18.0, 18.15), hump(t, 33.0, 33.15), hump(t, 50.0, 50.15), hump(t, 70.0, 70.15), hump(t, 81.0, 81.15));
    return p;
  }

  function base(ctx, env, t, cam, drawBefore) {
    const L = KD.L(env);
    LI.Ambient.specks(ctx, env, cam, t, { alpha: 0.22, n: 18, depth: 0.4, seed: 21 });
    LI.Camera.apply(ctx, env, cam);
    KD.ground(ctx, env, L.nx, L.gy);
    if (drawBefore) drawBefore();
    LI.Nokta.draw(ctx, LI.Nokta.follow((tt) => nokta(tt, env), t), t);
    if (t < 1.35 && t > 0.3) { const f = seg(t, 0.3, 1.3); Ink.dot(ctx, L.nx, lerp(-700, L.gy - 14, f * f), 15, { seed: 2, bleed: 0 }); }
    if (t > 1.3) Ink.drops(ctx, L.nx, L.gy - 4, t - 1.3, { n: 9, seed: 5, ground: L.gy + 4, scale: 0.8, alpha: 1 - seg(t, 4, 8) * 0.6 });
    return L;
  }

  LI.Film = { T, AMB, width, fit, tick, cross, gridPos, keyAt, array, extra, nlx, numberLine, jump, mark, nokta, base };
})(window.LI = window.LI || {});
