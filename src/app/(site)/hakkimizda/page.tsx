import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";


import { business } from "@/lib/content";
import { PageHeading } from "@/components/shared";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Hakkımızda",
  description:
    "Gültekin Peyzaj ve Eren Gültekin. Atakum merkezli, Samsun ve çevresinde peyzaj, bahçe bakımı ve budama.",
  path: "/hakkimizda",
});

export default function AboutPage() {
  return (
    <>
      <PageHeading title="Gültekin" accent="Peyzaj" />
      <section className="about-section container" aria-label="İşletmemiz hakkında">
        <div className="story-image">
          <CmsImage
            src="/images/lawn.webp"
            alt="Ağaçlar ve çiçek tarhları arasındaki yeşil çim alan"
            fill
            quality={65}
            sizes="(max-width: 700px) 90vw, 550px"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="about-copy">
          <p><CmsText>
            Gültekin Peyzaj olarak Atakum’dan Samsun ve çevresine hizmet
            veriyoruz. Peyzaj tasarım ve uygulama, periyodik bahçe bakımı ve
            budama işleriyle ilgileniyoruz.
          </CmsText></p>
          <p><CmsText>
            İhtiyacınızı Eren Gültekin’e doğrudan anlatabilir, bahçenizin
            fotoğraflarını WhatsApp üzerinden paylaşabilirsiniz.
          </CmsText></p>
          <div className="about-actions">
            <CmsLink href="/hizmetler" className="button button-green"><CmsText>Hizmetlerimiz</CmsText></CmsLink>
            <CmsAnchor href={business.phoneHref} className="text-link"><CmsText>{business.phone}</CmsText></CmsAnchor>
          </div>
        </div>
      </section>
    </>
  );
}
