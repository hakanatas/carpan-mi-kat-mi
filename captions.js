/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 6. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 9.8, tr: '12 noktayı dikdörtgen biçiminde dizelim', en: 'Let’s arrange 12 dots in a rectangle',
      note: 'Elimizde 12 nokta var. Bu noktaları sıra sıra dizerek kaç farklı dikdörtgen kurabiliriz?' },
    { scene: 2, start: 10.8, end: 14.4, tr: 'Tek sıra: 1 × 12 = 12', en: 'One row: 1 × 12 = 12',
      note: 'Hepsini tek sıraya dizelim: 1 sıra, her sırada 12 nokta. 1 çarpı 12, 12 eder.' },
    { scene: 2, start: 14.8, end: 18.4, tr: '2 sıra: 2 × 6 = 12', en: 'Two rows: 2 × 6 = 12',
      note: 'İki sıraya dizersek her sırada 6 nokta olur: 2 çarpı 6, 12.' },
    { scene: 2, start: 18.8, end: 22.4, tr: '3 sıra: 3 × 4 = 12', en: 'Three rows: 3 × 4 = 12',
      note: 'Üç sıraya dizersek her sırada 4 nokta olur: 3 çarpı 4, 12. Kenar uzunlukları 12’nin çarpanlarıdır.' },
    { scene: 2, start: 22.8, end: 26.6, tr: '5’erli dizersek 2 nokta artar: 5 çarpan değil', en: 'In rows of 5, 2 dots are left: 5 is not a factor',
      note: 'Bir varsayımda bulunalım: 5 de çarpan olabilir mi? 5’erli dizince 2 nokta artıyor, dikdörtgen tamamlanmıyor. Demek ki 5, 12’nin çarpanı değil.' },
    { scene: 2, start: 27.0, end: 30.2, tr: '12’nin çarpanları: 1, 2, 3, 4, 6, 12', en: 'The factors of 12: 1, 2, 3, 4, 6, 12',
      note: 'Başka dikdörtgen kurulamıyor. 12’nin çarpanları 1, 2, 3, 4, 6 ve 12.' },
    { scene: 3, start: 30.8, end: 38.4, tr: '0’dan başlayıp 4’er 4’er atlayalım', en: 'Start at 0 and jump by 4',
      note: 'Şimdi sayı doğrusunda sıfırdan başlayıp dörder dörder atlayalım: 4, 8, 12, 16, 20, 24.' },
    { scene: 3, start: 38.8, end: 41.6, tr: 'Bunlar 4’ün katları', en: 'These are the multiples of 4',
      note: 'Bu sayılar 4’ün katlarıdır. Her biri 4’ün bir doğal sayıyla çarpımıdır.' },
    { scene: 3, start: 42.0, end: 45.8, tr: '12, 4’ün katı; 4 de 12’nin çarpanı', en: '12 is a multiple of 4; 4 is a factor of 12',
      note: '12 hem burada hem de orada var. 12, 4’ün katıdır; 4 de 12’nin çarpanıdır. Çarpan ve kat aynı çarpmanın iki yüzü.' },
    { scene: 4, start: 46.8, end: 52.6, tr: '7 nokta: yalnızca tek sıra olur', en: '7 dots: only one row works',
      note: '7 noktayla deneyelim. 2’şerli, 3’erli dizince hep 1 nokta artıyor. Yalnızca tek sıra: 7’nin çarpanları 1 ve 7.' },
    { scene: 4, start: 53.0, end: 57.4, tr: '9 nokta: tek sıra ya da 3 × 3 kare', en: '9 dots: one row, or a 3 × 3 square',
      note: '9 noktayla tek sıra da olur, 3’e 3’lük bir kare de. 9’un çarpanları 1, 3 ve 9.' },
    { scene: 4, start: 57.8, end: 63.6, tr: '1 ve sayının kendisi her zaman çarpandır', en: '1 and the number itself are always factors',
      note: 'Bir önerme söyleyelim: 1 ve sayının kendisi her zaman o sayının çarpanıdır. Gerekçesi: her sayı tek sıra dizilebilir, 1 çarpı sayı.' },
    { scene: 5, start: 64.6, end: 70.8, tr: '12’nin çarpanları 12’yi geçmez', en: 'No factor of 12 is bigger than 12',
      note: 'Sayı doğrusunda 12’nin çarpanlarına bakalım: hepsi 12’ye kadar. Çarpanlar sınırlıdır.' },
    { scene: 5, start: 71.0, end: 73.2, tr: 'Ama 4’ün katları hiç bitmez', en: 'But the multiples of 4 never end',
      note: '4’ün katlarıysa sonsuza kadar devam eder; ne kadar atlarsak atlayalım bir sonraki kat vardır.' },
    { scene: 5, start: 73.6, end: 79.8, tr: '7 için de doğru: çarpanlar biter, katlar bitmez', en: 'True for 7 too: factors stop, multiples go on',
      note: 'Aynı gerekçe 7 için de geçerli mi? 7’nin çarpanları 1 ve 7, katları 7, 14, 21 diye sonsuza gider. Evet, geçerli.' },
    { scene: 6, start: 80.6, end: 86.4, tr: '3 × 4 = 12: 3 ve 4 çarpan, 12 kat', en: '3 × 4 = 12: 3 and 4 are factors, 12 is a multiple',
      note: 'Aklında kalsın: 3 çarpı 4, 12 ise 3 ve 4, 12’nin çarpanlarıdır; 12 de 3’ün ve 4’ün katıdır.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Çarpanlar sınırlı, katlar sonsuz!', en: 'Factors are few, multiples are endless!',
      note: 'Bir sayının çarpanları sınırlıdır, katları ise sonsuzdur.' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
