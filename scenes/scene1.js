/* SAHNE 1 — ON İKİ NOKTA (0–10 s)  12 dots fall into a pile.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, outBack, clamp } = LI.E;
  const KD = LI.KD, F = () => LI.Film, Ink = LI.Ink, A = LI.Ang;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  /* key lists: [time, dots per row] ('pile' = loose heap) */
  const K12 = [[0, 'pile'], [10.6, 12], [14.6, 6], [18.6, 4], [22.6, 5], [26.6, 4]];
  const K7 = [[46.6, 7], [48.8, 2], [50.4, 3], [52.0, 7]];
  const K9 = [[53.0, 9], [55.0, 3], [60.2, 9]];

  /** a text that is on screen between a and b (fades in/out) */
  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  /** one of several timed lines at the same place */
  function lines(ctx, t, P, list, o = {}) {
    const f = F();
    list.forEach(([a, b, s, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.fit(ctx, s, P.x, P.y, P.s, P.w, Object.assign({ alpha: al, halo: true, p: seg(t, a, a + 1.2) }, hot ? f.AMB : {}, o));
    });
  }

  /** side lengths on a finished rectangle: columns on top, rows on the left */
  function sides(ctx, n, cols, C, sp, a) {
    if (a <= 0 || cols === 'pile' || n % cols) return;
    const rows = n / cols, f = F();
    f.T(ctx, String(cols), C[0], C[1] - rows / 2 * sp - 34, Object.assign({ size: 40, alpha: a }, f.AMB));
    f.T(ctx, String(rows), C[0] - cols / 2 * sp - 34, C[1], Object.assign({ size: 40, alpha: a }, f.AMB));
  }

  /* ── part 1: twelve dots, rectangles, the factor list (0–46 s) ── */
  function twelve(ctx, env, t) {
    const L = KD.L(env), f = F(), AR = L.AR, C = [AR.x, AR.y];
    const a = seg(t, 3.9, 4.0) * (1 - seg(t, 30.0, 30.8)); if (a <= 0) return;
    const st = f.array(ctx, K12, 12, C, AR.sp, t, a, { drop: (i) => 4.0 + i * 0.4 });
    if (st.k >= 1) sides(ctx, 12, st.cols, C, AR.sp, a * seg(t, K12[st.k][0] + 0.9, K12[st.k][0] + 1.3));
    const P = { x: AR.x, y: AR.y + AR.ly, s: env.V ? 46 : 52, w: env.V ? 900 : 1000 };
    lines(ctx, t, P, [[9.2, 10.4, '12 nokta'], [11.2, 14.4, '1 × 12 = 12'], [15.2, 18.4, '2 × 6 = 12'], [19.2, 22.4, '3 × 4 = 12'],
      [23.4, 26.4, '5’erli sıralar: 2 nokta artar', true], [27.2, 30.2, '3 × 4 = 12']]);
  }

  function factorList(ctx, env, t) {
    const L = KD.L(env), FAC = L.FAC, f = F();
    const a = seg(t, 11.2, 11.8) * (1 - seg(t, 45.4, 46.2)); if (a <= 0) return;
    f.T(ctx, '12’nin çarpanları', FAC.x, FAC.ly, { size: FAC.s * 0.8, alpha: a, halo: true });
    const V = [1, 2, 3, 4, 5, 6, 12], AT = { 1: 11.6, 12: 11.9, 2: 15.6, 6: 15.9, 3: 19.6, 4: 19.9, 5: 23.6 };
    const w5 = seg(t, 23.4, 23.9) * (1 - seg(t, 27.0, 27.6));
    const W = V.map((v) => (v === 5 ? FAC.gap * w5 : FAC.gap)), tot = W.reduce((s, w) => s + w, 0);
    let x = FAC.x - tot / 2;
    const done = seg(t, 27.6, 28.0) * (1 - seg(t, 29.6, 30.2));
    V.forEach((v, i) => {
      const cx = x + W[i] / 2; x += W[i];
      const k = seg(t, AT[v], AT[v] + 0.5), al = a * k * (v === 5 ? w5 : 1); if (al <= 0) return;
      const pulse = done * Math.sin(Math.PI * clamp((t - 27.6 - i * 0.12) / 0.5));
      f.T(ctx, String(v), cx, FAC.y - 16 * (1 - outBack(k)), Object.assign({ size: FAC.s * (1 + 0.25 * Math.max(0, pulse)), alpha: al }, v === 5 ? f.AMB : {}));
      if (v === 5) f.cross(ctx, cx, FAC.y, 22, seg(t, 24.8, 25.4), al);
      // 4 is also a factor: ring it when 12 turns up among the multiples of 4
      if (v === 4) { const r = seg(t, 42.2, 43.0); if (r > 0) A.arc(ctx, [cx, FAC.y], FAC.s * 0.62, 90, 450, { p: r, alpha: a, w: 5, seed: 44 }); }
    });
    f.tick(ctx, x + 30, FAC.y, seg(t, 28.0, 28.5), a);
  }

  /* ── number line: multiples of 4 (30–46 s) ── */
  function multiples(ctx, env, t) {
    const L = KD.L(env), NL = L.NL, f = F();
    const a = seg(t, 30.6, 31.2) * (1 - seg(t, 45.4, 46.2)); if (a <= 0) return;
    f.numberLine(ctx, NL, a, seg(t, 30.6, 32.0));
    for (let k = 0; k < 6; k++) {
      const ts = 32.2 + k * 1.0, v = 4 * k + 4;
      f.jump(ctx, NL, v - 4, v, seg(t, ts, ts + 0.6), a, 120 + k * 5);
      f.mark(ctx, NL, v, seg(t, ts + 0.5, ts + 0.8), a, true);
      const la = seg(t, ts + 0.3, ts + 0.7) * (1 - seg(t, 40.6, 41.2)) * a;
      if (la > 0) f.T(ctx, `${k + 1} × 4`, (f.nlx(NL, v - 4) + f.nlx(NL, v)) / 2, NL.y - Math.min(110, (f.nlx(NL, v) - f.nlx(NL, v - 4)) * 0.55) - 30, { size: NL.lab, alpha: la });
    }
    const r = seg(t, 42.2, 43.0); if (r > 0) A.arc(ctx, [f.nlx(NL, 12), NL.y], 30, 90, 450, { p: r, alpha: a, w: 5, seed: 45 });
    lines(ctx, t, L.MUL, [[38.6, 46.0, '4’ün katları: 4, 8, 12, 16, 20, 24, ...', true]]);
  }

  /* ── 7 and 9: a claim and its reason (46–64 s) ── */
  function sevenNine(ctx, env, t) {
    const L = KD.L(env), f = F();
    const a7 = seg(t, 46.4, 47.0) * (1 - seg(t, 63.4, 64.2)), a9 = seg(t, 52.8, 53.4) * (1 - seg(t, 63.4, 64.2));
    if (a7 > 0) {
      f.array(ctx, K7, 7, [L.A7.x, L.A7.y], L.A7.sp, t, a7, { drop: (i) => 46.4 + i * 0.12 });
      const P = { x: L.A7.x, y: L.A7.y + L.A7.ly, s: env.V ? 42 : 46, w: env.V ? 900 : 560 };
      lines(ctx, t, P, [[47.2, 48.7, '1 × 7 = 7'], [49.4, 50.3, '2’şerli: 1 artar', true], [51.0, 51.9, '3’erli: 1 artar', true], [52.6, 63.6, '7’nin çarpanları: 1, 7']]);
    }
    if (a9 > 0) {
      f.array(ctx, K9, 9, [L.A9.x, L.A9.y], L.A9.sp, t, a9, { drop: (i) => 52.8 + i * 0.1 });
      const P = { x: L.A9.x, y: L.A9.y + L.A9.ly, s: env.V ? 42 : 46, w: env.V ? 900 : 560 };
      lines(ctx, t, P, [[53.6, 54.9, '1 × 9 = 9'], [55.6, 57.4, '3 × 3 = 9: bir kare!', true], [57.6, 63.6, '9’un çarpanları: 1, 3, 9']]);
    }
    const S = L.ST;
    lines(ctx, t, { x: S.x, y: S.y[0], s: S.s, w: S.w }, [[57.8, 63.6, 'Önerme: 1 ve sayının kendisi her zaman çarpandır']]);
    lines(ctx, t, { x: S.x, y: S.y[1], s: S.s, w: S.w }, [[59.8, 63.6, 'Gerekçe: her sayı tek sıra dizilir: 1 × sayı', true]]);
  }

  /* ── factors stop, multiples go on (64–80 s) ── */
  function limits(ctx, env, t) {
    const L = KD.L(env), NL = L.NL, f = F();
    const a = seg(t, 64.2, 64.8) * (1 - seg(t, 79.6, 80.4)); if (a <= 0) return;
    f.numberLine(ctx, NL, a, seg(t, 64.2, 65.4));
    const bracket = (v, p, al, seed) => {
      if (p <= 0 || al <= 0) return;
      const x0 = f.nlx(NL, 0), x1 = f.nlx(NL, v), y = NL.y + 70 * NL.r;
      Ink.path(ctx, [[x0, y - 12], [x0, y], [x1, y], [x1, y - 12]], { w: 5, p, alpha: al, color: LI.AMBER_RGB, seed, taper: [0, 0] });
    };
    const more = (v0, p, al) => { // an open arrow off the end of the line
      if (p <= 0 || al <= 0) return;
      const x0 = f.nlx(NL, v0), x1 = NL.x1 + 40, y = NL.y - 70;
      Ink.path(ctx, [[x0, NL.y - 14], [x1, y]], { w: 5, p, alpha: al, color: LI.AMBER_RGB, seed: 77 + v0, taper: [0.1, 0.1] });
      f.T(ctx, '...', x1 + 30, y - 6, Object.assign({ size: 44, alpha: al * seg(p, 0.7, 1) }, f.AMB));
    };
    // 12 and 4
    const pa = a * (1 - seg(t, 72.8, 73.4));
    if (pa > 0) {
      [1, 2, 3, 4, 6, 12].forEach((v, j) => f.mark(ctx, NL, v, seg(t, 65.4 + j * 0.25, 65.7 + j * 0.25), pa, false));
      bracket(12, seg(t, 66.8, 67.6), pa, 91);
      for (let k = 0; k < 6; k++) { const ts = 69.0 + k * 0.45, v = 4 * k + 4; f.jump(ctx, NL, v - 4, v, seg(t, ts, ts + 0.4), pa, 140 + k * 5); f.mark(ctx, NL, v, seg(t, ts + 0.3, ts + 0.5), pa, true); }
      more(24, seg(t, 71.8, 72.4), pa);
    }
    // 7
    const pb = a * seg(t, 73.4, 73.8);
    if (pb > 0) {
      [1, 7].forEach((v, j) => f.mark(ctx, NL, v, seg(t, 73.8 + j * 0.3, 74.1 + j * 0.3), pb, false));
      bracket(7, seg(t, 74.4, 75.0), pb, 92);
      for (let k = 0; k < 3; k++) { const ts = 75.2 + k * 0.6, v = 7 * k + 7; f.jump(ctx, NL, v - 7, v, seg(t, ts, ts + 0.5), pb, 160 + k * 5); f.mark(ctx, NL, v, seg(t, ts + 0.4, ts + 0.6), pb, true); }
      more(21, seg(t, 77.0, 77.6), pb);
    }
    lines(ctx, t, L.MUL, [[67.4, 70.9, '12’nin çarpanları 12’yi geçmez'], [71.0, 73.2, '4’ün katları hiç bitmez', true],
      [75.0, 79.8, '7’nin çarpanları 7’yi geçmez · katları hiç bitmez']]);
    const tk = seg(t, 77.8, 78.3) * (1 - seg(t, 79.4, 79.8));
    if (tk > 0) { const P = L.MUL, m = f.width(ctx, '7’nin çarpanları 7’yi geçmez · katları hiç bitmez', P.s);
      if (env.V) f.tick(ctx, P.x - 19, P.y + 62, tk, 1); else f.tick(ctx, P.x + Math.min(m, P.w) / 2 + 24, P.y, tk, 1); }
  }

  /* ── summary (80–92 s) ── */
  function summary(ctx, env, t) {
    const L = KD.L(env), S = L.SUM, f = F(), a = END(t); if (t < 80.2) return;
    const W = [['3 × 4 = 12', 80.4], ['3 ve 4, 12’nin çarpanları', 81.4], ['12, 3’ün ve 4’ün katı', 82.6, true], ['çarpanlar sınırlı · katlar sonsuz', 83.8]];
    W.forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.fit(ctx, s, S.x, S.y[i], S.s[i], S.w, Object.assign({ alpha: al, halo: true, p: seg(t, t0, t0 + 1.2) }, hot ? f.AMB : {}));
    });
    // a small 3 × 4 array beside (or above) the equation
    const C = env.V ? [0, -560] : [S.x - 420, S.y[0]], sp = env.V ? 30 : 32, k = seg(t, 80.4, 81.0) * a;
    if (k > 0) for (let i = 0; i < 12; i++) { const [x, y] = f.gridPos(12, 4, C, sp, i); const g = seg(t, 80.4 + i * 0.04, 80.8 + i * 0.04);
      if (g > 0) Ink.dot(ctx, x, y, 8 * outBack(g), { seed: 950 + i, bleed: 0.3, alpha: a }); }
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  function context(ctx, env, t) {
    lines(ctx, t, KD.L(env).CX, [
      [4.6, 10.3, '12 noktayla kaç farklı dikdörtgen kurabiliriz?'],
      [10.6, 22.5, 'Dikdörtgenin kenarları 12’nin çarpanlarıdır'],
      [22.8, 26.8, 'Varsayım: 5 de 12’nin çarpanı olabilir mi?', true],
      [27.0, 30.3, 'Başka dikdörtgen yok: liste tamam'],
      [30.6, 41.4, '4’er 4’er atlayalım: 4’ün katları'],
      [41.8, 46.0, '12, 4’ün katı · 4, 12’nin çarpanı', true],
      [46.6, 55.2, '7 noktayla hangi dikdörtgenler kurulur?'],
      [55.4, 57.4, 'Ya 9 nokta?'],
      [64.4, 73.0, 'Çarpanlar sınırlı mı, katlar sonsuz mu?'],
      [73.4, 79.8, 'Aynı gerekçe 7 için de geçerli mi?'],
    ]);
  }

  LI.world = function (ctx, env, t) {
    context(ctx, env, t); twelve(ctx, env, t); factorList(ctx, env, t); multiples(ctx, env, t);
    sevenNine(ctx, env, t); limits(ctx, env, t); summary(ctx, env, t);
  };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'Twelve dots', nameTr: 'On iki nokta', concept: 'How many rectangles?', conceptTr: 'Kaç dikdörtgen?', render });
})(window.LI = window.LI || {});
