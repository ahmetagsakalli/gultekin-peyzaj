import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";

import { services, serviceWhatsAppHref } from "@/lib/content";
import { WhatsAppIcon } from "@/components/icons";
import { PageHeading } from "@/components/shared";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Samsun Peyzaj ve Bahçe Bakım Hizmetleri",
  description:
    "Samsun’da peyzaj tasarım ve uygulama, periyodik bahçe bakımı, çim biçme, sulama ve budama hizmetleri.",
  path: "/hizmetler",
});

export default function ServicesPage() {
  return (
    <>
      <PageHeading title="Bahçenize gereken" accent="ilgi ve bakım." />
      <nav className="service-jump-nav container" aria-label="Hizmete geçin">
        {services.map((service) => (
          <CmsAnchor key={service.id} href={`#${service.id}`}><CmsText>{service.shortTitle}</CmsText></CmsAnchor>
        ))}
      </nav>
      <div className="service-details frame">
        {services.map((service, index) => (
          <section
            id={service.id}
            key={service.id}
            className="service-detail"
            aria-labelledby={`${service.id}-title`}
          >
            <div className="detail-copy">
              <h2 id={`${service.id}-title`}><CmsText>{service.title}</CmsText></h2>
              <p><CmsText>{service.description}</CmsText></p>
              <ul>
                {service.details.map((detail) => (
                  <li key={detail}><CmsText>{detail}</CmsText></li>
                ))}
              </ul>
              <CmsAnchor
                href={serviceWhatsAppHref(service.id)}
                className="button button-green"
                target="_blank"
                rel="noopener noreferrer"
              >
                <WhatsAppIcon /><CmsText> Bu hizmet için görüşelim
              </CmsText></CmsAnchor>
            </div>
            <div className="detail-photo">
              <CmsImage
                src={service.image}
                alt={service.alt}
                fill
                quality={65}
                sizes="(max-width: 700px) 90vw, 550px"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : undefined}
              />
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
