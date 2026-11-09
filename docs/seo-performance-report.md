# SEO ve hız kontrolü — 5 Kasım 2026

## Sonuç

Yerel üretim derlemesi (`next build` + `next start`, `http://localhost:3001`) üzerinde Lighthouse 13.6.0 kullanıldı. Mobil ölçümler Lighthouse’ın varsayılan mobil cihaz ve yavaş ağ simülasyonu, masaüstü ölçümü desktop profiliyle yapıldı. Ölçümler sırayla çalıştırıldı; her Lighthouse çalışması yeni tarayıcı oturumu kullandı. Resim dönüştürme önbelleği sunucuda korunur. Bunlar canlı site PageSpeed/CrUX saha verileri veya Google sıralama puanları değildir.

| Sayfa | Hız | Erişilebilirlik | En iyi uygulamalar | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Ana sayfa — mobil | 100 | 100 | 100 | 100 | 1.0 sn | 0.000 |
| Ana sayfa — masaüstü | 99 | 100 | 100 | 100 | 0.9 sn | 0.000 |
| Hizmetler | 98 | 100 | 100 | 100 | 2.4 sn | 0.000 |
| Hakkımızda | 99 | 100 | 100 | 100 | 2.0 sn | 0.000 |
| İletişim | 100 | 100 | 100 | 100 | 0.8 sn | 0.000 |
| Blog listesi | 96 | 100 | 100 | 100 | 2.7 sn | 0.000 |
| Bahçe düzenlemesine nereden başlamalı? | 96 | 100 | 100 | 100 | 2.7 sn | 0.000 |
| Çim biçerken nelere dikkat edilmeli? | 97 | 100 | 100 | 100 | 2.5 sn | 0.000 |
| Bahçe sulamasında doğru alışkanlıklar | 97 | 100 | 100 | 100 | 2.7 sn | 0.000 |
| Budama zamanı her bitkide aynı değil | 96 | 100 | 100 | 100 | 2.7 sn | 0.000 |
| Sonbaharda çim alanı gözden geçirmek | 97 | 100 | 100 | 100 | 2.7 sn | 0.000 |
| Bitki seçmeden önce toprağı tanıyın | 98 | 100 | 100 | 100 | 2.4 sn | 0.000 |

Ana sayfanın üç mobil tekrarında hız puanları: **100, 100, 100**. Medyan LCP: **0.9 sn**. Bütün final ölçümlerde CLS 0; Lighthouse çalıştırma uyarısı yok.

## Düzeltilenler

- Hizmet, hakkımızda, blog listesi ve blog yazısının ilk ekran fotoğrafı erken ve yüksek öncelikle yükleniyor. Aşağıdaki resimler gecikmeli yüklenmeye devam ediyor.
- Uygun tarayıcılara AVIF, diğerlerine WebP sunuluyor. Kaynak fotoğraflar ve videolar korunuyor. İlk ekran fotoğraflarında tarayıcıya sunulan kalite 65. Mobil hizmet fotoğrafı yaklaşık 61 KB → 23 KB, blogun ilk fotoğrafı 72 KB → 26 KB oldu (aktarım boyutları).
- Blog listesinde h1’den h3’e atlanan başlık sırası düzeltildi. Erişilebilirlik 98’den 100’e çıktı. Görsel başlık biçimi korundu.
- 11 sayfanın tamamına sayfaya özel Open Graph/Twitter başlık ve açıklamaları eklendi. Ana sayfada Organization, altı yazıda BlogPosting yapılandırılmış verisi var.
- `SITE_URL` ayarına bağlı canonical, sitemap ve robots altyapısı eklendi. Alan adı boşken uydurma veya localhost canonical/sitemap URL’si üretilmiyor.
- 11 sayfada HTTP 200, tek h1, Türkçe dil bilgisi, benzersiz başlık/açıklama, paylaşım metni tutarlılığı ve görsel alt alanları kontrol edildi. İç bağlantılar ve bölüm bağlantıları geçerli. Olmayan sayfa ve blog yazısı 404 dönüyor.
- Üretim derlemesi, TypeScript, dört SEO ayar testi ve beş site arama testi başarılı. Mobil blog görünümünde yatay taşma yok. Ana sayfa videosu 23,52 saniyelik sessiz döngü olarak oynuyor.

## Ölçümün sınırları ve yayın

- İlk resim dönüşümü de ölçüldü: sunucuda AVIF önbelleği yokken hizmetler 96, blog 95 hız puanı verdi. Bu raporlar `audit-avif-cold-*` adıyla ayrıca tutuldu. Final tablosu sonraki ziyaretlerin sunucu resim önbelleğini kullandığı ölçümlerdir; tarayıcı önbelleği her ölçümde sıfırdır.
- Ana sayfanın en büyük dosyası video: mobil 3,01 MB, masaüstü 6,59 MB. Açılışta öncelikle poster yüklenir; video sayfanın yüklenmesinden sonra başlar. Videonun kalitesi veya ileri–geri döngüsü değiştirilmedi.
- Gerçek alan adı belli olunca `.env.example` temel alınarak `SITE_URL` ayarlanmalı ve yeniden build alınmalı. Canonical adresler ve 11 URL’lik sitemap o zaman gerçek alan adıyla oluşacak.
- Yayın sonrası gerçek HTTPS alan adında PageSpeed ölçümü ve Search Console/sitemap kurulumu gerekir. Barındırma, önbellek ve gerçek kullanıcı bağlantıları yerel sonuçtan farklı olabilir.
- Otomatik erişilebilirlik puanı manuel WCAG uygunluk denetiminin yerine geçmez. Yapılandırılmış verilerde doğrulanmamış sokak adresi, saat, puan veya tarih yok; Google zengin sonuç görünümü garantisi verilmez.

## Rapor dosyaları

- [Ana sayfa mobil Lighthouse](audit-final-mobile-1.report.html)
- [Ana sayfa masaüstü Lighthouse](audit-final-desktop.report.html)
- [Tüm ölçümlerin ham sonuçları](seo-performance-results.json)
- [11 sayfalık SEO ve bağlantı kontrolü](seo-route-audit.json)
- [Alan adı ayarıyla canonical/sitemap derleme kontrolü](seo-domain-check.json)
- [Güncel önizleme](preview-seo-performance.jpg)

Her tablonun ham Lighthouse JSON ve HTML karşılığı `audit-final-*` adlarıyla bu klasördedir. Başlangıç raporları `audit-baseline-*`, yalnızca yükleme önceliği düzeltmesi sonrası ara ölçümler `audit-priority-*` adlarıyla saklandı.

## Teknik kaynaklar

- [Google: PageSpeed laboratuvar ve saha verileri](https://developers.google.com/speed/docs/insights/v5/about)
- [Chrome: Lighthouse puanlama](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
- [Next.js: robots.txt](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)
- [Google: Article yapılandırılmış veri](https://developers.google.com/search/docs/appearance/structured-data/article)
