import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";


import { business, navigation, services } from "@/lib/content";
import { FacebookIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from "./icons";

export function Footer() {
  return (
    <>
      <footer className="site-footer" id="alt-bilgi">
        <div className="container">
          <div className="footer-top">
            <div className="footer-brand">
              <CmsLink href="/" aria-label="Gültekin Peyzaj ana sayfa">
                <CmsImage
                  src="/images/logo.webp"
                  alt="Gültekin Peyzaj"
                  width={100}
                  height={90}
                  sizes="100px"
                />
              </CmsLink>
              <p><CmsText>Doğaya değer katarız.</CmsText></p>
              <span><CmsText>{business.location}</CmsText></span>
            </div>
            <div className="footer-links footer-services">
              <h2><CmsText>Hizmetlerimiz</CmsText></h2>
              <nav aria-label="Hizmetler">
                {services.map((service) => (
                  <CmsLink key={service.id} href={`/hizmetler#${service.id}`}>
                    <CmsText>{service.title}</CmsText>
                  </CmsLink>
                ))}
                <CmsLink href="/hizmetler#bakim"><CmsText>Çim biçme ve sulama</CmsText></CmsLink>
              </nav>
            </div>
            <div className="footer-links">
              <h2><CmsText>Gültekin Peyzaj</CmsText></h2>
              <nav aria-label="Alt menü">
                {navigation.slice(1).map((item) => (
                  <CmsLink key={item.href} href={item.href}>
                    <CmsText>{item.label}</CmsText>
                  </CmsLink>
                ))}
              </nav>
            </div>
            <div className="footer-contact">
              <h2><CmsText>İletişim</CmsText></h2>
              <CmsAnchor href={business.phoneHref}><CmsText>{business.phone}</CmsText></CmsAnchor>
              <CmsAnchor
                href={business.whatsapp}
                className="footer-social"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon /><CmsText> WhatsApp’tan yazın
              </CmsText></CmsAnchor>
              <CmsAnchor
                href={business.instagram}
                className="footer-social"
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon /><CmsText> Instagram
              </CmsText></CmsAnchor>
              <CmsAnchor
                href={business.facebook}
                className="footer-social"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FacebookIcon /><CmsText> Facebook
              </CmsText></CmsAnchor>
            </div>
          </div>
          <div className="footer-bottom">
            <span><CmsText>© </CmsText>{new Date().getFullYear()}<CmsText> Gültekin Peyzaj</CmsText></span>
            <span><CmsText>Samsun ve çevresi</CmsText></span>
            <p className="footer-credit">
              <span><CmsText>Web tasarım, uygulama ve geliştirme</CmsText></span>
              <CmsAnchor
                href="https://kocyigityazilim.com"
                target="_blank"
                rel="noopener noreferrer"
              ><CmsText>
                kocyigityazilim.com
              </CmsText></CmsAnchor>
            </p>
          </div>
        </div>
      </footer>
      <nav className="floating-contact" aria-label="Hızlı iletişim">
        <CmsAnchor
          href={business.phoneHref}
          className="floating-phone"
          aria-label="Gültekin Peyzaj’ı arayın"
          title={business.phone}
        >
          <PhoneIcon />
        </CmsAnchor>
        <CmsAnchor
          href={business.whatsapp}
          className="floating-whatsapp"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp’tan yazın"
          title="WhatsApp’tan yazın"
        >
          <WhatsAppIcon />
        </CmsAnchor>
      </nav>
    </>
  );
}

export function PageHeading({
  title,
  accent,
}: {
  title: string;
  accent?: string;
}) {
  return (
    <section className="page-heading container">
      <h1>
        <CmsText>{title}</CmsText>
        {accent && (
          <>
            <br />
            <span><CmsText>{accent}</CmsText></span>
          </>
        )}
      </h1>
    </section>
  );
}
