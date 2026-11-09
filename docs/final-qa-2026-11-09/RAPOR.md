# Gültekin Peyzaj — Yayın öncesi son kontrol

9 Kasım 2026 · Canlı adres: https://gultekin-peyzaj.vercel.app

Tespit edilen sorunlar giderildi ve üretim yayını güncellendi. Kontrol edilen kapsamda yayını engelleyen açık bir hata kalmadı.

Üretim sürümü: `dpl_HVvUvdYxLttj5WPoqzkFKYRSzo8P` — `READY`.

## Düzeltilenler

- Ana sayfa Vercel tarafından yeniden oluşturulurken `/index` adıyla ele alınabiliyordu. Bu durum ana sayfa menü stilini ve sayfaya özel içerik eşleştirmesini etkiliyordu. Ana sayfa adresleri tek kimlikte birleştirildi; şeffaf arama, açık renkli menü ve aktif sayfa vurgusu doğrulandı.
- Mobil menü ikonu için video üzerinde okunur renk ve hafif koyu zemin uygulandı.
- Yeni blogların yalnızca kısa özeti aramaya giriyordu. Yazının tamamı ve panelde yayımlanan hizmet/yazı değişiklikleri arama kapsamına alındı. Tekrarlanan sözcükler tekilleştirilerek arama verisi küçük tutuldu.
- Panelde değiştirilen iletişim bilgilerinin işletme yapılandırılmış verisine de yansıması sağlandı.
- Aynı çalışma klasöründe veritabanı değiştiğinde eski içerik önbelleğinin kullanılmasını önlemek için önbellek veritabanına göre ayrıldı.

## Otomatik kontroller

- **44 uygulama/panel testi + 9 arama/SEO testi: 53 başarılı, 0 başarısız.**
- Üretim derlemesi ve TypeScript kontrolü başarılı.
- 11 sayfada HTTP 200, tek ana başlık, Türkçe dil tanımı, benzersiz başlık/açıklama, canonical, paylaşım görseli ve yapılandırılmış veri kontrol edildi.
- İç bağlantılar, bölüm bağlantıları, telefon ve WhatsApp hedefleri doğru. Kullanılan telefon: **0545 951 23 53**.
- Olmayan sayfalar ve blog yazıları HTTP 404 döndürüyor.
- Admin API anonim erişime kapalı; admin sayfaları noindex ve çerçeve korumasıyla sunuluyor.
- Üretim bağımlılıklarında `npm audit --omit=dev` sonucu **0 bilinen güvenlik açığı**.
- 13 yerel görsel başarıyla çözümlendi: tamamı WebP, en geniş görsel 1920 piksel. Render edilen 15 farklı görsel URL’si ve video/ikon/paylaşım varlıkları erişilebilir.

## Tarayıcı ve panel

**11 sayfa × 360, 390, 768 ve 1440 piksel = 44 ekran kontrolü.** Gerçek viewport genişliği her ölçümde doğrulandı. Yatay taşma, kesilen başlık, kırık görsel veya başlıkla çakışan üst menü bulunmadı.

Mobil menü, Escape ile kapatma, klavye odak göstergesi, Türkçe/ASCII arama ve sonuç bağlantıları denendi. SSS kapalı başlıyor; cevap sorunun hemen altında açılıyor ve önceki cevap kapanıyor. Çalışma adımlarında seçili görsel değişirken bileşen yüksekliği sabit kaldı. Footer ve iletişim alanları mobilde incelendi. Tarayıcıda uygulama hatası görülmedi.

Panel için ayrı bir QA veritabanı ve yerel üretim sunucusu kullanıldı. Gerçek veritabanı ve Blob bağlantısıyla şu akışlar geçti:

- Giriş, yanlış şifre, oturum çerezi, origin/CSRF koruması ve çıkış.
- Taslak kaydı, ziyaretçiden taslak izolasyonu, aynı anda düzenleme çakışması ve yayınlama.
- Geçmiş sürümün önce taslağa, sonra yayına alınması.
- Görsel yükleme, WebP varyantları, sayfa izolasyonu, kaldırma/sıfırlama ve galeri sıralaması.
- Yeni blog oluşturma, önizleme, yayın, yeniden dağıtım gerektirmeden yeni adres/sitemap oluşması, düzenleme ve kaldırma.
- QA şifresi değiştiğinde eski oturumların geçersiz olması.

Metin önizlemesinden düzenleme, yeni blog/kapak yükleme ve yayın akışı tarayıcıdan da doğrulandı. Mobil panel ve ek hizmet tablosunda taşma yok. Görsel açıklaması giriş alanı panelde gösterilmiyor; mevcut alternatif metinler korunuyor.

**Temizlik:** QA veritabanı, 15 test Blob dosyası ve geçici QA şifre dosyası kaldırıldı; test sunucuları kapatıldı. Üretim içerik sürümü 8 olarak kaldı. Gerçek içerik ve giriş şifresi değiştirilmedi.

## Lighthouse sonuçları

Gerçek canlı adres, Chrome Lighthouse; mobilde Lighthouse’ın standart mobil benzetimi. Ana sayfanın son stil düzeltmesinden sonra son sürüm yeniden ölçüldü. Diğer sayfaların ölçümleri aynı turdaki önceki üretim sürümünden; son değişiklik yalnızca ana sayfa adres eşleştirmesini düzeltiyor.

| Sayfa | Ekran | Performans | Erişilebilirlik | Teknik kalite | SEO | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Ana sayfa | Mobil | 99 | 100 | 100 | 100 | 0 |
| Ana sayfa | Masaüstü | 100 | 100 | 100 | 100 | 0 |
| Hizmetlerimiz | Mobil | 100 | 100 | 100 | 100 | 0 |
| Hakkımızda | Mobil | 98 | 100 | 100 | 100 | 0 |
| İletişim | Mobil | 100 | 100 | 100 | 100 | 0 |
| Blog | Mobil | 98 | 100 | 100 | 100 | 0 |
| Blog yazısı | Mobil | 96 | 100 | 100 | 100 | 0 |

Son ana sayfa ölçümünde LCP mobilde **1,03 sn**, masaüstünde **0,59 sn**. TBT mobilde **132,5 ms**, masaüstünde **0 ms**. Tüm ölçülen sayfalarda CLS **0**.

Ölçümler test makinesinin anlık yüküyle dalgalandı: önceki üretim sürümünde üç ana sayfa mobil ölçümü 76/95/100 (ortanca 95), masaüstü ölçümleri 75/100/100 (ortanca 100) oldu. İlk turda 72 de görüldü. Ham raporlar saklandı; yalnızca en iyi koşu seçilmedi. Son üretim sürümünün sonuçları tabloda yer alıyor. Bunlar laboratuvar ölçümleridir; gerçek kullanıcı Core Web Vitals verisi veya Google sıralaması değildir. Bağımsız PageSpeed API denemesi günlük kota nedeniyle HTTP 429 döndü.

## Hesap ve alan adı durumu

Site mevcut Vercel adresinde çalışıyor. Özel alan adı bağlantısı, Google Analytics, Search Console ve Google İşletme hesabı bağlantıları bu turda kurulmadı/doğrulanmadı. Panelde bu hizmetlerin “Sitenizde var” grubunda görünmesi kullanıcının istediği hizmet sunumudur; hesapların teknik olarak bağlandığına dair kanıt değildir.

## Kanıt dosyaları

- `regression.json`, `search-seo-tests.txt`, `build.log`
- `routes-final.json`, `responsive-final.json`, `images.json`, `extra-assets.json`
- `connected.json`, `cleanup.json`, `npm-audit.json`
- `release-scores.json` ve `*.report.json` / `*.report.html` Lighthouse raporları
- `home-mobile-final.png`, `home-desktop-final.png`, `final-preview.png`, `admin-blog-mobile.png`
