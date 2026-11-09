# Yazı tipi — 7 Kasım 2026

Kullanıcının paylaştığı örnek, aynı metinle oluşturulan font örnekleriyle görsel olarak karşılaştırıldı. Daha sonra kullanıcının verdiği https://steelatelier.com/ adresinin HTML ve CSS kaynağında doğrulandı: ilgili başlık `--font-heading-family: "Playfair Display", serif` ve `--font-heading-weight: 400` kullanıyor.

Playfair Display site genelinde, menü ve form alanları dahil, `next/font/local` üzerinden sunulur. Başlıklarda regular ağırlık ve daha açık harf aralığı kullanılır. Paylaşım görseli de aynı aileyi kullanır.

- Kaynak: https://github.com/google/fonts/tree/main/ofl/playfairdisplay
- Aile: https://fonts.google.com/specimen/Playfair+Display
- Lisans: `src/fonts/Playfair-Display-OFL.txt` (SIL Open Font License).
- Tarayıcı fontu: `src/fonts/playfair-display.woff2`, 62.712 bayt, 400–900 değişken ağırlık.
- Latin ve Latin Extended karakterleri, noktalama işaretleri, avro ve marka simgesi korunarak WOFF2 biçimine sıkıştırıldı.
- Türkçe `ÇĞİÖŞÜçğıöşü` gliflerinin hem web hem paylaşım görseli fontunda bulunduğu doğrulandı.
- Font yerel sunulur, `swap` ve ölçüsü ayarlanmış Times New Roman yedeği kullanılır.

## Kontroller

- Üretim derlemesi ve TypeScript başarılı.
- Ana sayfa 360, 390, 768 ve 1440 pikselde yatay taşma olmadan kontrol edildi. Mobil blog yazısı ve footer imzası da kontrol edildi.
- Canlı sayfada fontun yüklendiği ve `playfair` ailesinin kullanıldığı doğrulandı.
- Mobil Lighthouse ilk ölçümü: performans 83, erişilebilirlik 100, en iyi uygulamalar 100, SEO 100. Ana iş parçacığında 570 ms engellenme görüldüğü için tekrar ölçüldü.
- Tekrar ölçümü: performans 99, erişilebilirlik 100, en iyi uygulamalar 100, SEO 100; LCP 1,2 sn, TBT 20 ms, CLS 0. Her iki rapor `docs/playfair-lighthouse*2026-11-07.report.*` olarak saklandı; laboratuvar ölçümleri çalışma koşullarına göre değişebilir.
