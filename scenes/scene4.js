/* SAHNE 4 — ÖNERME (46–64 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 4, start: 46, end: 64, name: 'A claim and its reason', nameTr: 'Önerme ve gerekçe', concept: '1 and the number are always factors', conceptTr: '1 ve sayının kendisi hep çarpandır', render });
})(window.LI = window.LI || {});
