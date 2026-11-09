# Gültekin Peyzaj yönetim paneli

Panel adresi: `/admin`. Junior Panel temel alınarak mevcut siteye bağlanmıştır.

## Kullanım

- **Sayfalar:** Sayfayı seçin; önizlemedeki yazıya veya görsele tıklayın. Görseller sekmesinden değiştirme, kaldırma, orijinale dönme ve sayfaya galeri ekleme işlemleri yapılabilir.
- **Taslağa kaydet:** Değişiklik yalnızca yönetim panelinde görünür. Sayfa yenilense de taslak korunur.
- **Yayınla:** Birikmiş taslak değişikliklerini birlikte yayınlar. Site önbelleği ve site haritası yenilenir.
- **Geçmiş:** Önceki kaydı taslağa yükler. Yayındaki içeriğin değişmesi için ayrıca Yayınla seçilir.
- **Taslağı kaldır:** Yayındaki içeriğe döner.
- **Yeni yazı:** Başlık, içerik ve kapak görseliyle blog yazısı oluşturur. Kaydettikten sonra Yayınla seçilir. Yeni yazı için kod dağıtımı gerekmez. Başlık sonradan değişse de yazının adresi korunur.
- **Şifre değiştir:** Değişiklikten sonra bütün eski oturumları kapatır; yeni şifreyle tekrar giriş gerekir.

Mevcut altı blog yazısı kendi sayfa önizlemelerinden düzenlenir. Sonradan eklenen yazılar blog düzenleme ekranından yönetilir. Site üzerinde form bulunmadığından Talepler modülü eklenmemiştir. Logo, görseller ve metinler düzenlenebilir; hero videosu bu panelin görsel yükleme alanından değiştirilmez.

## Altyapı

Neon Postgres kalıcı içerik, taslak, yayın geçmişi ve yönetici oturumlarını tutar. Vercel Blob görselleri saklar. Yüklenen tek kare JPG, PNG, WebP ve AVIF dosyaları en fazla 4 MB olabilir; sunucuda WebP'ye dönüştürülür, büyütülmeden farklı boyutlarda hazırlanır.

Gerekli sunucu değişkenleri `.env.example` içindedir. Gerçek değerler Vercel ortamında ve yerel `.env.local` dosyasında saklanır; istemci paketine eklenmez. `ADMIN_PASSWORD_HASH` yalnızca ilk kurulum içindir; mevcut yönetici şifresi veritabanındadır. `npm run db:migrate` mevcut içeriği silmeden şemayı hazırlar. Başlangıç şifresi kaynak dosyalara yazılmaz.

Oturum süresi 12 saattir. Çerez HttpOnly ve SameSite=Strict kullanır; üretimde Secure'dur. Yazma istekleri oturum, aynı kaynak ve CSRF doğrulamasından geçer. Çakışan taslak sürümleri 409 ile reddedilir. Panel ve API arama motorlarına kapalıdır.

## Doğrulama — 9 Kasım 2026

- 39 yönetim paneli testi; mevcut arama ve SEO testleri.
- TypeScript kontrolü ve üretim derlemesi.
- Bağlı Neon ve Blob üzerinde: giriş/yanlış şifre/çıkış, CSRF ve kaynak kontrolü, taslak kalıcılığı ve gizliliği, sürüm çakışması, yayın, geçmişten geri yükleme, gerçek görsel yükleme ve WebP varyantları, sayfaya özel görsel değişikliği, galeri sıralama ve son görseli kaldırma.
- Yeni blog taslağı, yayın sonrası yeni adresin dağıtım olmadan açılması, site haritası, sabit adresle başlık güncelleme ve kaldırma.
- Şifre değişiminde eski oturumların geçersizleşmesi; kurulum şifresinin geri yüklenmesi.
- Üretim dağıtımı tamamlandı: https://gultekin-peyzaj.vercel.app/admin. Canlı ortamda gerçek giriş, Secure/HttpOnly çerezi, noindex, metin taslağı ve yayın izolasyonu, Sharp/Blob görsel yüklemesi, oturumsuz API erişiminin reddedilmesi doğrulandı. Ana sayfa, hizmetler, hakkımızda, iletişim, blog, yazı, robots, sitemap ve paylaşım görseli 200 yanıtı verdi. Doğrulama kayıtları ve yüklemeleri temizlendi.

`scripts/admin/verify-connected.mjs` yerel üretim önizlemesinde gerçek depolama bağlantısını sınar. Yalnızca ayrılmış test ortamında çalıştırılmalıdır; içerik ve şifre değişiklikleri yapar, sonunda başlangıç içeriği ve şifreyi geri yükler. Şifreyi dosyaya veya rapora yazmayın.
