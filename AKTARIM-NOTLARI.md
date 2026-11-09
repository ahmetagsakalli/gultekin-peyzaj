# GitHub aktarım kaydı — 9 Kasım 2026

## Uygulama ve bağlantılar

Doğrulanan üretim sürümündeki 103 dosya dağıtım kaynağından alındı; özgün SHA-1 değerleri `backups/source-manifest.json` içindedir. Site ve admin kaynak kodu, yayın görselleri/videoları, fontlar ve bağımlılık kilidi korunmuştur. `.vercelignore` dosyasına yeni ham arşiv, yedek ve kurulum klasörlerini Vercel dağıtım paketinden çıkarmak için kurallar eklenmiştir; bunlar GitHub reposunda tutulur.

Kullanıcının istediği `.env.local` bağlantıları, admin giriş bilgileri ve içerik yedeği özel repoya eklendi. Kişisel GitHub/Vercel hesap tokenları ve tarayıcı oturumları proje dosyası değildir; aktarılmadı. Geçici Vercel OIDC dağıtım tokenı çıkarıldı; uygulamanın Neon/Blob ve oturum ayarları korundu.

## Tamamlanan arşiv

- `assets/source/`: Eski `work/assets` klasöründeki 29 dosyanın tamamı. JPG/PNG kaynakları, logo ve favicon kaynağı, kaynak videolar, posterler, alternatif fotoğraflar, font kaynağı ve kaynak adresi kayıtları.
- `docs/`: Özgün proje klasöründeki 197 doküman, Lighthouse HTML/JSON raporu, kontrol kaydı ve ekran görüntüsünün tamamı.
- `backups/archive-manifest.json`: Bu 226 arşiv dosyasının boyutları ve SHA-256 değerleri.
- `backups/media-archive-manifest.json`: Ham medyanın eski dosya boyutlarıyla karşılaştırması.

İlk aktarımda iCloud'dan okunamayan favicon/video betikleri, sayfa medyası testleri, video kaynak kaydı ve yerel başlatma betiği projenin özgün yazma/düzenleme kayıtlarından geri alındı. Npm komutları da geri kondu.

Ham medyanın okunabilen dosyaları doğrudan kopyalandı. İndirilemeyen stok dosyalar kayıtlı özgün adreslerinden yeniden alındı; logo/favicon ve önizleme dosyaları bu projenin orijinal üretim kayıtlarından kurtarıldı. İki PNG poster aynı kaynak MP4 ve aynı FFmpeg komutlarıyla tekrar üretildi. Yeniden indirilen iki kullanılmayan alternatif fotoğrafın (`candidate-a.jpg`, `candidate-b.jpg`) bayt boyutları CDN'nin güncel çıktısında biraz farklıdır; kaynak fotoğrafları ve adresleri aynıdır. Kullanılan yayın görselleri değişmedi.

## Araçların kullanımı

Görsel ve favicon betikleri artık repo içindeki `assets/source` klasörünü kullanır:

```sh
npm run optimize:images
npm run optimize:favicon
npm run optimize:video -- assets/source/revision/garden-path-source.mp4
```

Video üretimi için FFmpeg gerekir; özel konum `FFMPEG_BIN` ile verilebilir. Hazır yayın dosyaları zaten `public` ve `src/app` altındadır. Üretim betiklerinin çalıştırılması bu dosyaları yeniden oluşturur.

`node_modules`, `.next` ve geçici video kodlama çıktıları yeniden üretilebilen çalışma dosyalarıdır. Node bağımlılıkları `npm ci`, site derlemesi `npm run build` ile oluşturulur. Kaynak medya ve raporlar artık repo içindedir.

## Kontroller

53 test (44 panel/içerik, 5 arama, 4 SEO) ve TypeScript kontrolü geçti. Kurtarılan betiklerin sözdizimi kontrolleri başarılı. Kaynakları repo içine alan görsel/favikon betikleri ayrı bir geçici klasörde çalıştırılarak doğrulandı; yayın dosyaları bu kontrol sırasında değiştirilmedi. Arşiv dosyaları GitHub'a aktarıldıktan sonra Git nesne özetleriyle karşılaştırılır.
