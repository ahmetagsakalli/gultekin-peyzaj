# VPS kurulumu

## Teslim edilenler

Next.js sitesi, admin paneli, altı blog yazısı, yerel fotoğraf/video/font dosyaları ve mevcut `.env.local` bağlantı ayarları bu repodadır. Admin adresi `/admin`, mevcut giriş şifresi **`Gultekin55*`**. 9 Kasım 2026 tarihinde veritabanındaki parola özetiyle eşleştiği doğrulandı.

`backups/cms-2026-11-09.json`: yayınlanan içerik (sürüm 8), taslak, yayın geçmişi, medya kayıtları ve admin parola özeti. Aktif giriş oturumları taşınmaz. Normal kuruluma yedeği aktarmak gerekmez; `.env.local` mevcut veritabanına bağlıdır.

**Mevcut mimari:** uygulama VPS'te çalışır; veritabanı Neon PostgreSQL, panel yüklemeleri Vercel Blob üzerinde kalır. Bunlar Vercel uygulama barındırmasından bağımsızdır. Veritabanı veya Blob hesabını silmeyin. Yerel PostgreSQL'e ya da sunucu diskine geçiş ayrıca bağlantı ve yükleme kodu değişikliği gerektirir.

## Hızlı kurulum

Node.js **26.13.0** ve npm kullanılarak doğrulandı; `.nvmrc` aynı sürümü içerir. Linux sunucuda Node.js'in kendi mimarinize uygun sürümünü kurun. Nginx, systemd ve HTTPS kullanılacaktır.

```sh
git clone https://github.com/ahmetagsakalli/gultekin-peyzaj.git
cd gultekin-peyzaj
npm ci
```

`.env.local` dosyasında `SITE_URL` değerini gerçek HTTPS alan adınızla değiştirin. Örnek: `SITE_URL=https://gultekinpeyzaj.com`. Alan adının size ait olduğunu ve DNS'in VPS'e yönlendiğini doğrulayın. Mevcut Neon ve Blob bağlantılarını kullanacaksanız diğer değerleri değiştirmeyin.

```sh
npm run build
npm start
```

Uygulama `127.0.0.1:3000` üzerinde çalışır. Başka port için `npm start -- --port 3002` kullanılabilir. `SITE_URL` değişikliğinden sonra yeniden build alın. `.env.local` dosyasını shell ile `source` etmeyin; Next.js kendisi okur ve bcrypt içindeki kaçışları çözer.

## Kalıcı servis (Ubuntu/Debian örneği)

Uygulamayı `/srv/gultekin-peyzaj` altına koyun ve `gultekin` adlı normal bir sistem kullanıcısına ait yapın. Sisteminizdeki Node yolunu `command -v node` ile kontrol edin; `/usr/bin/node` değilse servis dosyasındaki `ExecStart` yolunu düzeltin.

```sh
sudo useradd --system --create-home --shell /usr/sbin/nologin gultekin
sudo mkdir -p /srv/gultekin-peyzaj
# Repo dosyalarını .env.local dahil /srv/gultekin-peyzaj içine kopyalayın.
sudo chown -R gultekin:gultekin /srv/gultekin-peyzaj
cd /srv/gultekin-peyzaj
sudo -u gultekin npm ci
sudo -u gultekin npm run build
sudo cp deploy/gultekin-peyzaj.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now gultekin-peyzaj
curl -f http://127.0.0.1:3000/
```

`deploy/nginx.conf` içindeki `example.com` adreslerini gerçek alan adınızla değiştirin. Dosyayı Nginx'in `sites-available` klasörüne koyup `sites-enabled` altında etkinleştirin. `sudo nginx -t` başarılı olduktan sonra Nginx'i yeniden yükleyin. DNS hazır olduğunda Certbot ile alan adınıza HTTPS sertifikası alın. Admin oturum çerezleri üretimde Secure olduğu için paneli **HTTPS üzerinden** kullanın.

Nginx örneği Host başlığını korur (panelin istek doğrulaması için gereklidir), yüklemelere 12 MB sınır verir, kullanıcıdan gelen Vercel IP başlığını temizler ve Next.js yanıtlarını ayrıca önbelleğe almaz. Tek uygulama süreci kullanın; birden çok instance için paylaşımlı içerik/cache invalidation kurulumu gerekir.

## Kontrol ve geri dönüş

```sh
systemctl status gultekin-peyzaj
journalctl -u gultekin-peyzaj -n 80 --no-pager
curl -I https://ALAN-ADINIZ/
curl -I https://ALAN-ADINIZ/admin
curl -f https://ALAN-ADINIZ/sitemap.xml
```

Ana sayfa, hizmetler, hakkımızda, blog ve iletişim sayfalarını açın; admin girişini, görsel yüklemeyi, taslak ve yayın akışını kontrol edin. Bu ayarlar mevcut veritabanına bağlı olduğundan panelde yayınlanan değişiklikler eski Vercel sitesiyle de paylaşılır.

Güncellemeden önce mevcut commit'i `git rev-parse HEAD` ile kaydedin. Yeni sürüm sorun çıkarırsa `git checkout <önceki-commit>`, `npm ci`, `npm run build` ve `sudo systemctl restart gultekin-peyzaj` ile geri dönün. Bu işlem kodu geri alır; içerik değişiklikleri panelin yayın geçmişinden ayrı geri alınır.
