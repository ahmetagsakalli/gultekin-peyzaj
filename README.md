# Gültekin Peyzaj

Samsun ve çevresinde hizmet veren Gültekin Peyzaj'ın Next.js sitesi ve yönetim paneli.

- Canlı site: https://gultekin-peyzaj.vercel.app
- Repo: https://github.com/ahmetagsakalli/gultekin-peyzaj
- **VPS kurulumu ve admin giriş bilgileri:** [VPS-KURULUM.md](VPS-KURULUM.md)
- Mevcut proje bağlantıları: `.env.local`
- İçerik ve admin parola özeti yedeği: `backups/cms-2026-11-09.json`

## Kurulum

Node.js 26.13.0 ile doğrulandı. `.nvmrc` bu sürümü belirtir.

```sh
npm ci
npm run dev
```

Site http://localhost:3000 üzerinde açılır. Üretim için:

```sh
npm run build
npm start
```

Sunucu `127.0.0.1:3000` üzerinde dinler. VPS üzerinde Nginx ve HTTPS kurulumu için [kurulum belgesini](VPS-KURULUM.md) kullanın. `SITE_URL` değerini kendi HTTPS alan adınıza göre değiştirip yeniden derleyin.

## İçerik ve panel

Ana sayfa, hizmetler, hakkımızda, iletişim, blog listesi ve altı blog yazısı bulunur. `/admin` üzerinden sayfa yazıları ve görselleri, bloglar, taslak/yayın ve yayın geçmişi yönetilir.

Metinler ve panel kayıtları Neon PostgreSQL üzerinde; panelden yüklenen görseller Vercel Blob üzerinde tutulur. Bu bağlantılar `.env.local` içinde hazırdır. VPS'e geçiş uygulamanın barındırmasını taşır; mevcut veritabanı ve görsel depolaması kullanılmaya devam eder. Normal kurulumda yedeği tekrar içeri aktarmak gerekmez.

İşletmenin telefon ve WhatsApp numarası **0545 951 23 53**. İşletme Eren Gültekin'e aittir; Atakum / Samsun merkezlidir. Sokak adresi, çalışma saatleri ve kuruluş yılı doğrulanmadığı için eklenmemiştir.

## Dosyalar

- `src/app/(site)`: Ziyaretçi sayfaları ve stiller.
- `src/app/admin`, `src/app/api/admin`: Yönetim paneli ve API.
- `src/lib/content.ts`, `src/lib/blog.ts`: Varsayılan içerik.
- `src/lib/admin`: Panel yetkilendirmesi ve içerik işlemleri.
- `public/images`, `public/videos`, `src/fonts`: Yerel WebP görseller, hero video döngüleri ve yazı tipleri.
- `deploy`: Nginx ve systemd örnekleri.
- `tests`, `scripts`: Testler ve geliştirme araçları.
- `backups`: İçerik yedeği ve canlı sürüm dosya doğrulama listesi.

Stok görseller tamamlanmış işletme projeleri olarak sunulmaz. Görsel kaynakları `docs/image-sources.json`, ikon kaynakları `docs/icon-license.md`, font lisansı `src/fonts/OFL.txt` içindedir. Hero videoları ve tüm yayın görselleri hazır olarak repoda bulunur; kurulum için yeniden üretilmeleri gerekmez.

## Kontroller

```sh
npm run typecheck
npm run test:admin
npm run test:search
npm run test:seo
```

Canlı yayın öncesi yapılan incelemenin kaydı [docs/final-qa-2026-11-09/RAPOR.md](docs/final-qa-2026-11-09/RAPOR.md) dosyasındadır. Bu aktarımın kapsamı ve iCloud dosyalarının kurtarma kaydı [AKTARIM-NOTLARI.md](AKTARIM-NOTLARI.md) içinde belirtilmiştir.
