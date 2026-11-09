# GitHub aktarım kaydı — 9 Kasım 2026

Uygulamanın son doğrulanan üretim sürümündeki 103 dosya Vercel dağıtım kaynağından alındı. Dosyalar SHA-1 değerleriyle karşılaştırıldı; kayıt `backups/source-manifest.json` içindedir. Site ve admin kaynak kodu, tüm yayın görselleri/videoları, fontlar ve bağımlılık kilidi eksiksizdir. `package.json` dahil 103 dosyanın tamamı canlı sürüm kaydıyla eşleşir. Sitenin görünümü veya çalışma mantığı değiştirilmedi.

Projenin mevcut `.env.local` bağlantıları, admin giriş bilgileri ve içerik yedeği kullanıcı isteğiyle özel repoya eklendi. Kişisel GitHub/Vercel hesap tokenları ve tarayıcı oturumları proje dosyası değildir ve aktarılmadı. Ortam dosyasındaki geçici Vercel OIDC dağıtım tokenı çıkarıldı; uygulamanın Neon/Blob ve oturum ayarları korundu.

## iCloud dosyalarının tamamlanması

İlk aktarımda iCloud'dan okunamayan beş dosya, bu projenin özgün yazma ve düzenleme kayıtlarından geri alındı:

- `scripts/optimize-favicon.mjs`
- `scripts/optimize-hero-video.mjs`
- `tests/admin/page-media.test.tsx`
- `docs/video-source.json`
- `start-local.command`

Kayıtlardaki son değişiklikler ve biçimlendirme uygulandı; beş dosyanın bayt uzunlukları özgün dosya metadatasıyla eşleşti. Favicon ve video üretim komutları `package.json` içine özgün sıralarıyla geri kondu. Favicon kaynak notları da `docs/favicon-notes.md` olarak eklendi. Önceki yardımcı dosya eksikleri giderildi.

## Kullanım

`node_modules` ve `.next` makineye özel üretilen dosyalardır; VPS'te `npm ci` ve `npm run build` ile oluşturulur. Nginx/systemd örnekleri ve VPS kurulum belgesi bu aktarım için eklendi.

Hazır WebP görseller, faviconlar ve video döngüleri repodadır; siteyi çalıştırmak için yeniden üretilmeleri gerekmez. Görsel/favikon üretim betikleri eski çalışma düzenindeki `../../work/assets` kaynaklarını bekler. Video üretim betiğine kaynak MP4 yolu parametre olarak verilir ve FFmpeg gerekir. Kaynak JPG/PNG arşivi ve eski Lighthouse HTML/JSON dökümleri uygulama reposuna dahil değildir; görsel kaynak kayıtları ve QA özetleri `docs` klasöründedir.

## Aktarım kontrolleri

Temiz `npm ci` ardından üretim derlemesi başarılı oldu. Eksik test dosyasının geri alınmasından sonra 53 testin tamamı (44 panel/içerik, 5 arama, 4 SEO) ve TypeScript kontrolü geçti. Kurtarılan betiklerin JavaScript ve zsh sözdizimi kontrolleri de başarılı. Kaynak karşılaştırmasında 103 üretim dosyasının tamamı değişmeden doğrulandı.
