# Son kontrol — SEO ve hız

11 sayfa üretim sürümünde ölçüldü. Ana sayfa mobil üç tekrarda 100, masaüstünde 99; iç sayfalar mobilde 96–100 hız puanı aldı. SEO, erişilebilirlik ve en iyi uygulamalar tüm final ölçümlerde 100. Ayrıntılar ve önce/sonra kayıtları [seo-performance-report.md](seo-performance-report.md) içinde.

İlk ekran resim önceliği, AVIF/WebP sunumu, blog başlık sırası, sayfaya özel paylaşım bilgileri, yapılandırılmış veriler ve alan adına bağlı canonical/sitemap/robots altyapısı tamamlandı. Canlı alan adı henüz ayarlanmadı ve yayın yapılmadı.

---

# Son düzenleme — logo, menü, site araması ve footer

- Header şeffaf kaldı; logoya açık renkli küçük zemin verildi ve okunabilir boyuta getirildi. Menü bağlantıları hover/klavye odağında hareketli alt çizgi gösteriyor.
- Header telefonu yerine sayfalar, üç hizmet ve altı blog yazısının içeriğini arayan yerel arama eklendi. Türkçe/ASCII yazım, başlık önceliği, kelime başlangıcı ve çok kelimeli arama destekleniyor. Dış arama servisi kullanılmıyor.
- Klavyede aşağı ok ile sonuca odaklanma, Escape ile kapatıp alana dönme, sonuçtan blog yazısına geçiş ve sonuç bulunamadı durumu tarayıcıda doğrulandı. Mobil menü ve arama paneli birbirini kapatıyor.
- Footer dört sütunla sıkılaştırıldı; hizmet bağlantıları ve WhatsApp eklendi. Mobilde ortalı, iki sütunlu bağlantılar ve ayrı iletişim alanı var. Sabit ikonlar son satırla çakışmıyor.
- “Web tasarım, uygulama ve geliştirme” altında `https://kocyigityazilim.com` bağlantısı eklendi.
- 360, 390, 768 ve 1440 piksel görünüm kontrol edildi. Üretim derlemesi, TypeScript ve `npm run test:search` içindeki beş kontrol başarılı.
- Önizlemeler: `preview-header-search.jpg`, `preview-footer-credit.jpg`, `preview-footer-credit-mobile.jpg`.

---

# Önceki düzenleme — hero video döngüsü

- 8,28 saniyelik kaynak çekim, 23,52 saniyelik ileri–geri döngüye dönüştürüldü. Ana hareket 0,75× hızda; yön değişimlerinde 0,8 saniyelik hız rampaları var. Ara kareler hareket kestirimiyle hazırlanıyor.
- Döngü 588 kare, 25 fps, sessiz H.264. İki uçta tekrarlanan kareler çıkarıldı. Tarayıcı tarafında zaman atlatma veya ters oynatma zamanlayıcısı kullanılmıyor.
- Masaüstü 1600×900 / 6.589.561 bayt; mobil 608×1080 / 3.012.324 bayt. Hızlı başlangıç metadatası dosyanın başında.
- İki dosya da tam olarak çözüldü; döngü birleşimindeki kare farkı normal hareket farkından düşük. Sayısal kontrol: `hero-loop-check.json`.
- Yerel masaüstü önizlemede 23,52 saniyelik yeni dosyanın sessiz ve döngüde oynadığı doğrulandı; oynatma süresi tur sonunda yeniden başladı.
- Üretim derlemesi ve TypeScript kontrolü başarılı. Yeniden üretim komutu ve kaynak kaydı README ile `video-source.json` içinde.

---

# Önceki düzenleme — bölüm boşlukları

- Bitişik bölümlerin birleşerek büyüyen üst/alt boşlukları giderildi. Ana sayfadaki hizmetler, çalışma adımları, blog ve SSS arasındaki mesafe masaüstünde 72, tablette 64, mobilde 48 piksel.
- Başlık altları, hizmet kartları ve iç sayfalardaki geniş alt boşluklar azaltıldı.
- 1440 ve 390 pikselde ana sayfa boşlukları tarayıcıdan ölçüldü; yatay taşma yok. Mobil hizmet sayfasında başlık ve header çakışmıyor.
- Üretim derlemesi ve TypeScript kontrolü başarılı. Önizleme: `preview-spacing.jpg`.

---

# Önceki düzenleme — yeşil footer ve ana sayfa tanıtımının kaldırılması

- Ana sayfadaki “Bahçenize emek, doğaya değer” başlıklı fotoğraflı tanıtım bölümü kaldırıldı.
- Footer tüm sayfalarda tam genişlikte koyu yeşil (`#203e2e`); bağlantı ve metinler açık yeşil/beyaz. Logonun kendi renklerini koruyan açık renkli bir yüzey kullanılıyor.
- Mobil footer ortalı. Sabit iletişim ikonları için alt boşluk footer içinde ayrıldı; sayfanın altında beyaz şerit bırakılmıyor.
- Çalışma adımları ilk tasarımdaki gibi numaralı ve açıklamalı; seçim yalnızca tıklamayla değişiyor.
- Üretim derlemesi ve TypeScript kontrolü başarılı.

---

# Son ekleme — bağlantılı hizmet kartları ve çalışma adımları

- Kullanıcının iki ekran referansı, açık renkli iki bileşene uyarlandı. Hizmet kartları gerçek hizmet bölümlerine, değerlendirme kartı iletişim sayfasına bağlanıyor.
- Dört aşamalı bölümde seçilen adımın fotoğrafı değişiyor. Tıklama ve Enter ile seçim kontrol edildi; aynı anda tek adım aktif. Bölüm yüksekliği seçimden önce ve sonra 548 piksel.
- 360, 390, 768 ve 1440 piksel genişlikte yatay taşma yok. Mobil ve tablet kartları görsel olarak incelendi.
- Hizmet kartından `/hizmetler#bakim` bölümüne geçiş doğrulandı. Başlıklar ortalı. Genel bölüm çerçeveleri ve ayırıcı çizgiler eklenmedi.
- Üretim derlemesi ve TypeScript kontrolü başarılı. Sayfalar statik olarak üretiliyor.
- Yerel üretim önizlemesinde mobil Lighthouse tekrar ölçümü: performans 100, erişilebilirlik 100, en iyi uygulamalar 100, SEO 100. LCP 0,8 sn, TBT 40 ms, CLS 0. Rapor: `garden-components-mobile-check.report.*`.
- İlk mobil ölçüm 78 performans verdi (`garden-components-mobile.report.*`); tarayıcıyla eşzamanlı yerleşim kontrolleri sona erdikten sonraki tekrar 100 verdi. Yerel laboratuvar sonuçları koşullara göre değişebilir; iki kayıt da saklandı.
- Önizlemeler: `preview-garden-network.jpg`, `preview-garden-process.jpg`.
- Yeni paket, dış servis veya yayın eklenmedi. Yerel site: `http://localhost:3000`.

---

# Kontrol kaydı — 5 Kasım 2026, blog ve son düzenlemeler

## Güncel sonuç

- Başlıklar ortalandı; açılış başlığı küçültüldü. Hero açıklaması, konum etiketi ve duraklatma düğmesi kaldırıldı.
- Header şeffaf. Sol altta telefon, sağ altta WhatsApp marka ikonlu bağlantı bulunuyor.
- Blog listesine altı Türkçe yazı ve ayrı yazı sayfaları eklendi. Ana sayfa üç yazı gösteriyor. İçerik kaynakları yazıların sonunda bağlantılı.
- SSS her satırda bir soru olacak şekilde tek sütun. Başlangıçta kapalı, aynı anda tek cevap açık. Her cevap doğrudan ilgili sorunun altında açılıyor; ortak cevap alanı kaldırıldı.
- Yeşil “Bahçeniz için konuşalım” bölümü tüm sayfalardan kaldırıldı.
- Footer mobilde ortalı; menü ve iletişim bağlantıları düzenlendi.

## Doğrulama

- Üretim derlemesi ve TypeScript kontrolü başarılı.
- On bir sayfa doğrudan adresinden HTTP 200 veriyor, her sayfada tek h1 var. Olmayan blog yazısı HTTP 404 dönüyor. Kayıt: `blog-route-checks.json`.
- 360, 390, 768 ve 1440 piksel genişliklerde ana sayfa; mobil ve tablette blog listesi ile mobil yazı görünümü kontrol edildi. Yatay taşma görülmedi.
- Mobil menüden bloga ve listeden yazıya geçiş çalışıyor.
- SSS klavye ile açılıp kapanıyor. Başka soruya geçişte yalnızca bir cevap açık kalıyor. Son düzeltmede cevaplar kendi sorularının altına taşındı; aynı anda tek açık cevap davranışı ve kapatılabilmesi tarayıcıda yeniden kontrol edildi.
- Telefon ve WhatsApp bağlantıları sırasıyla `tel:+905412837015` ve `https://wa.me/905412837015`. İkinci telefon bağlantısı korunuyor.
- Mobil footer ve sabit köşe düğmeleri görsel olarak kontrol edildi. Alt içerik için güvenli alan boşluğu var.

## Güncel Lighthouse ölçümü

Üretim önizlemesi `http://localhost:3001` üzerinde ölçüldü. Bunlar yerel laboratuvar sonuçlarıdır.

| Ölçüm | Performans | Erişilebilirlik | En iyi uygulamalar | SEO |
|---|---:|---:|---:|---:|
| Masaüstü | 96 | 100 | 100 | 100 |

LCP 1,4 sn, toplam bloklama 0 ms, CLS 0. Raporlar `blog-revision-desktop.report.*`; bu ölçüm SSS cevaplarının kendi sorularının altına taşınmasından öncedir. Son SSS görünümü `preview-faq-inline.jpg` dosyasındadır.

Mobil Lighthouse bu son revizyonda yeniden çalıştırılmadı. Önceki tasarımın mobil 90 / 100 / 100 / 100 sonuçları `redesign-mobile.report.*` içinde tarihsel kayıt olarak saklanıyor; son sürümün mobil ölçümü sayılmamalı. Diğer `redesign-*` ve daha eski raporlar önceki sürümlere aittir.

## Yerel kullanım

Önizleme `http://localhost:3000` adresinde. İnternete yayın yapılmadı.
