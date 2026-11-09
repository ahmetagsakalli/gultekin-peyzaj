import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";


import { services } from "@/lib/content";
import { LeafIcon } from "@/components/icons";

export function GardenNetwork() {
  return (
    <div className="garden-network">
      <div className="garden-source">
        <div className="garden-source-photo">
          <CmsImage
            src="/images/hero.webp"
            alt="Çim alan, ağaçlar ve ahşap pergolayla düzenlenmiş bir bahçe"
            fill
            sizes="(max-width: 600px) 90vw, 330px"
          />
        </div>
        <h3><CmsText>Her şey bahçenizle başlar.</CmsText></h3>
      </div>

      <div className="garden-connection" aria-hidden="true">
        <svg viewBox="0 0 100 24" fill="none" preserveAspectRatio="none">
          <path d="M0 12H100" />
        </svg>
        <span />
      </div>

      <div className="garden-plan">
        <div className="garden-plan-symbol">
          <LeafIcon />
        </div>
        <h3><CmsText>Birlikte değerlendirelim.</CmsText></h3>
        <CmsLink href="/iletisim" className="text-link"><CmsText>
          Bahçenizi anlatın
        </CmsText></CmsLink>
      </div>

      <svg
        className="garden-branches"
        viewBox="0 0 100 376"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 188H24C76 188 24 56 76 56H100" />
        <path d="M0 188H100" />
        <path d="M0 188H24C76 188 24 320 76 320H100" />
        <circle cx="24" cy="188" r="4" />
      </svg>

      <ul className="garden-service-list">
        {services.map((service) => (
          <li key={service.id}>
            <CmsLink href={`/hizmetler#${service.id}`} className="garden-service">
              <div className="garden-service-photo">
                <CmsImage
                  src={service.image}
                  alt=""
                  fill
                  sizes="(max-width: 950px) and (min-width: 601px) 240px, 100px"
                />
              </div>
              <h3><CmsText>{service.title}</CmsText></h3>
              <span className="garden-service-dot" aria-hidden="true" />
            </CmsLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
