# Gültekin Peyzaj — canlı yayın kontrolü

5 Kasım 2026 tarihinde https://gultekin-peyzaj.vercel.app adresine yayınlandı.

- Hesap: ahmetagsakalli; çalışma alanı: Güncel Yayın (`guncel-yayin`).
- Proje: `gultekin-peyzaj`.
- Vercel dağıtım kimliği: `dpl_4gRCCydasidNUb3eCizs7SMoHDjn`.
- Durum: READY / production. Sabit canlı adres, oturum açmadan HTTP 200 döndürüyor.
- Next.js 16.4.5, Node.js 26.x; Vercel’de derleme ve TypeScript kontrolü başarılı. 17 statik rota üretildi.
- `SITE_URL=https://gultekin-peyzaj.vercel.app`, production ortamına kaydedildi.
- 50 dosya / 12.35 MB kaynak paketi gönderildi. Ortam dosyaları, yerel çalışma dosyaları ve raporlar yüklenmedi.

## Kontroller

11 içerik sayfası HTTP 200, tek H1 ve `lang="tr"` ile açılıyor. Canonical ve Open Graph URL’leri canlı adresi kullanıyor; localhost/test alan adı yok. `/sitemap.xml` 11 URL içeriyor ve `/robots.txt` bu dosyayı gösteriyor. Olmayan sayfa HTTP 404 döndürüyor.

Paylaşım görseli ve ikon HTTP 200; Next.js resim optimizasyonu AVIF sunuyor. İki video dosyası da Range isteğine HTTP 206 yanıt veriyor. Tarayıcıda 390 pikselde yatay taşma yok; mobil menü, site içi arama, tek cevap açılan SSS ve iletişim bağlantıları kontrol edildi. Mobilde dikey video, masaüstünde yatay video sessiz oynuyor.

## Canlı Lighthouse ölçümleri

Lighthouse 13.6.0, aynı bilgisayardan gerçek HTTPS adresinde; her ölçüm ayrı tarayıcı önbelleğiyle ve sırayla yapıldı. Vercel’in CDN/görsel önbelleği sonraki isteklerde korunur. Bu sonuçlar gerçek kullanıcı Core Web Vitals verisi veya Google sıralaması değildir.

| Ölçüm | Performans | Erişilebilirlik | En iyi uygulamalar | SEO |
|---|---:|---:|---:|---:|
| İlk mobil | 99 | 100 | 100 | 92 |
| İlk masaüstü | 80 | 100 | 100 | 100 |
| Mobil tekrar | 95 | 100 | 100 | 100 |
| Masaüstü tekrar | 97 | 100 | 100 | 100 |

İlk mobil ölçümünde `robots.txt` isteği zaman aşımına uğradı; dosyanın içeriği ayrıca doğrulandı ve sonraki ölçümlerde denetim geçti. İlk masaüstü ölçümünde ilk görsel dönüşümü/ağ gecikmesi görüldü (hero poster isteği yaklaşık 3.9 saniye); önbellek oluştuktan sonraki ölçüm 97 oldu. İlk sonuçlar da raporda korunmuştur; skorların her bağlantıda sabit kalacağı garanti edilmez. Son mobil LCP 1.6 saniye, masaüstü LCP 0.7 saniye; iki ölçümde de CLS 0.

Ham sonuçlar: `live-performance-results.json`, `live-*.report.json` ve HTML raporları. Rota kontrolü: `live-route-audit.json`. Önizlemeler: `live-desktop-preview.png`, `live-mobile-preview.png`.

## Sonraki yayınlar

Proje yerel Vercel CLI ile bağlıdır; Git üzerinden otomatik dağıtım kurulmadı. Doğru hesap/proje bağlantısı doğrulandıktan sonra proje klasöründen `vercel deploy --prod --scope guncel-yayin` kullanılabilir. Özel alan adı bağlanırsa production `SITE_URL` yeni adresle güncellenip yeniden derlenmelidir.

## 7 Kasım 2026 — iletişim güncellemesi

Tek telefon ve WhatsApp numarası **0545 951 23 53** oldu. Önceki numara görünen metinlerden, arama indeksinden, SEO bilgilerinden ve paylaşım görselinden çıkarıldı. Facebook marka ikonu, kullanıcının verdiği bağlantıyla footer ve iletişim sayfasına eklendi.

Dağıtım: `dpl_9qrZZbFePchVHfsKptUHee3arnKC`, production / READY. 11 canlı içerik sayfasında eski numaranın bulunmadığı; telefon, WhatsApp ve Facebook hedeflerinin doğru olduğu doğrulandı. Yerel derleme/TypeScript, 5 arama testi ve 4 SEO testi başarılı. 390 piksel mobil footer ve masaüstü görünümü kontrol edildi.

Canlı iletişim sayfası mobil Lighthouse: performance: 100, accessibility: 100, best-practices: 100, seo: 100. Sonuçlar `contact-update-lighthouse-2026-11-07.report.html` ve JSON dosyasında; bağlantı kontrolleri `contact-update-2026-11-07.json` dosyasında.
