import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";

import { business } from "@/lib/content";
import { publishedPosts } from "@/lib/blog-server";
import { publicContent } from "@/lib/admin/content";
import { WhatsAppIcon } from "@/components/icons";
import { HeroVideo } from "@/components/hero-video";
import { BlogGrid } from "@/components/blog-grid";
import { Faq } from "@/components/faq";
import { GardenNetwork } from "@/components/garden-network";
import { GardenProcess } from "@/components/garden-process";
import { StructuredData } from "@/components/structured-data";
import {
  publishedBusinessSchema,
  pageMetadata,
  siteTitle,
  siteDescription,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: siteTitle,
  description: siteDescription,
  path: "/",
});

export default async function HomePage() {
  const [blogPosts, state] = await Promise.all([publishedPosts(), publicContent()]);
  return (
    <>
      <StructuredData data={publishedBusinessSchema(state)} />
      <section className="home-hero" aria-labelledby="hero-heading">
        <HeroVideo />
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content container">
          <h1 id="hero-heading"><CmsText>
            Doğaya
            </CmsText><br />
            <span><CmsText>değer katarız.</CmsText></span>
          </h1>
          <div className="button-row">
            <CmsAnchor
              href={business.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-lime"
            >
              <WhatsAppIcon /><CmsText> Bahçeniz için görüşelim
            </CmsText></CmsAnchor>
            <CmsLink href="/hizmetler" className="hero-link"><CmsText>
              Hizmetlerimiz
            </CmsText></CmsLink>
          </div>
        </div>
      </section>
      <section
        className="home-services section-space container"
        aria-labelledby="services-title"
      >
        <h2 id="services-title" className="section-title"><CmsText>
          Peyzajdan </CmsText><span><CmsText>bahçe bakımına.</CmsText></span>
        </h2>
        <GardenNetwork />
        <div className="section-action">
          <CmsLink href="/hizmetler" className="text-link"><CmsText>
            Tüm hizmetlerimiz
          </CmsText></CmsLink>
        </div>
      </section>
      <section
        className="process-section section-space container"
        aria-labelledby="process-title"
      >
        <h2 id="process-title" className="section-title"><CmsText>
          Bahçeniz için </CmsText><span><CmsText>nasıl ilerliyoruz?</CmsText></span>
        </h2>
        <GardenProcess />
      </section>
      <section
        className="home-blog section-space container"
        aria-labelledby="blog-title"
      >
        <h2 id="blog-title" className="section-title"><CmsText>
          Bahçeden </CmsText><span><CmsText>notlar.</CmsText></span>
        </h2>
        <BlogGrid posts={blogPosts.slice(0, 3)} />
        <div className="section-action">
          <CmsLink href="/blog" className="text-link"><CmsText>
            Tüm yazılar
          </CmsText></CmsLink>
        </div>
      </section>
      <section
        className="faq-section section-space container"
        aria-labelledby="faq-title"
      >
        <h2 id="faq-title" className="section-title"><CmsText>
          Merak ediyor </CmsText><span><CmsText>olabilirsiniz.</CmsText></span>
        </h2>
        <Faq />
      </section>
    </>
  );
}
