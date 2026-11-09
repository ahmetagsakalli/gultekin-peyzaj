import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";
import { business } from "@/lib/content";
import { PageHeading } from "@/components/shared";
import { FacebookIcon, InstagramIcon, LocationIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "İletişim",
  description: `Gültekin Peyzaj ile iletişime geçin. Telefon ve WhatsApp: ${business.phone}. Atakum / Samsun.`,
  path: "/iletisim",
});

export default function ContactPage() {
  return (
    <>
      <PageHeading title="Bahçeniz için" accent="konuşalım." />
      <section className="contact-hub container" aria-label="İletişim bilgileri">
        <div className="contact-main">
          <p className="contact-owner"><CmsText>{business.owner}</CmsText></p>
          <CmsAnchor href={business.phoneHref} className="large-phone"><CmsText>{business.phone}</CmsText></CmsAnchor>
          <div className="contact-actions">
            <CmsAnchor href={business.phoneHref} className="button button-green">
              <PhoneIcon /><CmsText> Bizi arayın
            </CmsText></CmsAnchor>
            <CmsAnchor href={business.whatsapp} target="_blank" rel="noopener noreferrer" className="button button-outline">
              <WhatsAppIcon /><CmsText> WhatsApp’tan yazın
            </CmsText></CmsAnchor>
          </div>
          <p className="contact-note"><CmsText>Bahçenizin fotoğraflarını ve ihtiyacınızı WhatsApp üzerinden paylaşabilirsiniz.</CmsText></p>
        </div>
        <div className="contact-channels">
          <CmsAnchor href={business.instagram} target="_blank" rel="noopener noreferrer" className="contact-channel">
            <InstagramIcon />
            <span><strong><CmsText>Instagram</CmsText></strong><span><CmsText>{business.instagramHandle}</CmsText></span></span>
          </CmsAnchor>
          <CmsAnchor href={business.facebook} target="_blank" rel="noopener noreferrer" className="contact-channel">
            <FacebookIcon />
            <span><strong><CmsText>Facebook</CmsText></strong><span><CmsText>{business.name}</CmsText></span></span>
          </CmsAnchor>
          <div className="contact-channel">
            <LocationIcon />
            <span><strong><CmsText>{business.location}</CmsText></strong><span><CmsText>{business.region}</CmsText></span></span>
          </div>
        </div>
      </section>
    </>
  );
}
