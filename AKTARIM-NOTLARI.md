# GitHub aktarım kaydı — 9 Kasım 2026

Uygulamanın son doğrulanan üretim sürümündeki 103 dosya Vercel dağıtım kaynağından alındı. Dosyalar SHA-1 değerleriyle karşılaştırıldı; kayıt `backups/source-manifest.json` içindedir. Site ve admin kaynak kodu, tüm yayın görselleri/videoları, fontlar ve bağımlılık kilidi eksiksizdir. Bu aktarımda sitenin görünümü veya çalışma mantığı değiştirilmedi.

Projenin mevcut `.env.local` bağlantıları, admin giriş bilgileri ve içerik yedeği kullanıcı isteğiyle özel repoya eklendi. Kişisel GitHub/Vercel hesap tokenları ve tarayıcı oturumları proje dosyası değildir ve aktarılmadı. Ortam dosyasındaki geçici Vercel OIDC dağıtım tokenı çıkarıldı; uygulamanın Neon/Blob ve oturum ayarları korundu.

## Yardımcı dosyalar

iCloud'da kalan bazı eski geliştirme dosyaları okunamadı: `scripts/optimize-favicon.mjs`, `scripts/optimize-hero-video.mjs`, `tests/admin/page-media.test.tsx`, `docs/video-source.json` ve `start-local.command`. Boş dosyalar repoya alınmadı. Favicon ve video üretimine ait çalıştırılamayan iki npm komutu kaldırıldı; canlı sürüm manifestine göre `package.json` içindeki tek fark budur. Hazır favicon ve videolar repodadır. Başlatma için `npm run dev` / `npm start` kullanılır.

Aktarılabilen panel testlerinin bir kısmı aynı junior-panel başlangıç paketinden dosya yolları uyarlanarak tamamlandı. Bu repodaki testler ayrıca çalıştırıldı. Önceki QA raporundaki test sayısı tam eski çalışma klasörüne aittir.

`scripts/optimize-images.mjs` yeniden görsel üretmek için eski çalışma klasöründeki `../../work/assets` kaynaklarını bekler. Kaynak JPG/PNG arşivi bu uygulama reposunda bulunmaz; hazır WebP dosyaları doğrudan kullanılır. Eski Lighthouse HTML/JSON dökümleri aktarılmadı; QA özetleri eklendi. Bunlar VPS kurulumu için gerekli değildir.

`node_modules` ve `.next` makineye özel üretilen dosyalardır; VPS'te `npm ci` ve `npm run build` ile oluşturulur. Nginx/systemd örnekleri ve VPS kurulum belgesi bu aktarım için eklendi.

## Aktarım kontrolleri

Temiz `npm ci` ardından üretim derlemesi başarılı oldu. Son aktarımda TypeScript kontrolü ve 45 test (36 panel/içerik, 5 arama, 4 SEO) geçti. Uygulama dosyaları canlı sürüm manifestiyle karşılaştırıldı; belgelenen iki npm komutu dışında kaynak kodda fark yok.
