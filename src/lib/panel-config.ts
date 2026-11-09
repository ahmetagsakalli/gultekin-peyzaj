// Public brand configuration. Credentials are server-only environment values.
export const panelConfig = {
  name: "Gültekin Peyzaj",
  logo: "/images/logo.webp",
  loginImage: "/images/hero.webp",
  loginCaption: "Doğaya değer katarız.",
};
export type PanelService = { id: string; title: string; description: string } & (
  { included: true } | { included: false; href: string; action: string; destination: string; price: { label: string; detail: string } }
);
const contactFor = (service: string) => `https://wa.me/905456273330?text=${encodeURIComponent(`Merhaba, Gültekin Peyzaj sitemiz için ${service} hizmeti hakkında bilgi ve teklif almak istiyorum.`)}`;
function available(id: string, title: string, description: string, label = "Özel teklif", detail = "Kapsama göre"): PanelService {
  return { id, title, description, included: false, price: { label, detail }, href: contactFor(title), action: "Teklif al", destination: "Koçyiğit Yazılım WhatsApp" };
}
// Prices and customer benefits explicitly set by the provider on 2026-11-09.
export const panelServices: readonly PanelService[] = [
  { id: "pages", included: true, title: "Sayfa düzenleme", description: "Sitedeki yazıları ve görselleri önizleme üzerinden güncelleyin." },
  { id: "drafts", included: true, title: "Taslak, yayın ve geçmiş", description: "Değişiklikleri hazırlayın, yayınlayın ve geçmişten geri alın." },
  { id: "blog", included: true, title: "Blog yönetimi", description: "Yazı ve kapak görseli ekleyin; hazır olduğunda yayınlayın." },
  { id: "media", included: true, title: "Görsel yükleme", description: "Fotoğraflar otomatik olarak küçültülür ve WebP biçiminde saklanır." },
  { id: "google-business", included: true, title: "Google İşletme ve yorumlar", description: "İşletme profilinizi sitenizle bağlayın, gerçek müşteri yorumlarını gösterin." },
  { id: "search-console", included: true, title: "Google Search Console kurulumu", description: "Arama sorgularınızı, Google tıklamalarını ve dizine eklenme durumunu takip edin." },
  { id: "analytics", included: true, title: "Ziyaretçi istatistikleri", description: "Google Analytics 4 ile trafik kaynaklarını ve ziyaret edilen sayfaları takip edin." },
  { id: "maintenance", included: true, title: "Bakım ve teknik destek", description: "Sitenizin teknik kontrolleri, güncellemeleri ve kararlaştırılan destek işleri." },
  available("quote-form", "Teklif alma ve talep takibi", "Bahçe düzenleme ve bakım taleplerini siteden alın, panelden takip edin.", "3.000 ₺", "Tek seferlik"),
  available("appointments", "Keşif randevusu", "Müşterileriniz yerinde keşif için uygun gün ve saat seçebilsin.", "3.000 ₺", "Tek seferlik"),
  available("project-comparison", "Öncesi ve sonrası proje galerisi", "Tamamladığınız bahçelerin önceki ve sonraki hâllerini karşılaştırmalı gösterin.", "1.000 ₺", "Tek seferlik"),
  available("local-seo", "Yerel SEO çalışması", "Samsun ve çevresindeki aramalar için işletme profilinizi ve hizmet sayfalarınızı geliştirin.", "3.000 ₺", "Aylık"),
  available("blog-content", "Blog içerik desteği", "Peyzaj ve bahçe bakımı konularında düzenli yazılar ve yayın planı hazırlayalım.", "2.000 ₺", "Aylık"),
  available("google-ads", "Google Ads yönetimi", "Peyzaj ve bahçe bakımı aramalarına yönelik kampanya, takip ve raporlama.", "3.000 ₺", "Aylık yönetim"),
  available("meta-ads", "Instagram ve Facebook reklamları", "Hizmet bölgenize yönelik görsel ve video reklamları planlayıp yönetelim.", "3.000 ₺", "Aylık yönetim"),
];
export const serviceFooter = {
  note: "Reklam bütçesi yönetim ücretlerine dahil değildir. Blog yazılarının sayısı ve yayın planı birlikte belirlenir.",
  contactHref: contactFor("ek hizmetler"),
};
