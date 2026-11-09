import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";
import type { Metadata } from "next";


import { notFound } from "next/navigation";
import { BlogGrid } from "@/components/blog-grid";
import { publishedPosts } from "@/lib/blog-server";
import { publicContent } from "@/lib/admin/content";
import { resolveText, resolveImage } from "@/lib/cms-shared";
import { business, services } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { publicUrl } from "@/lib/site-url";
import { StructuredData } from "@/components/structured-data";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = true;
export const revalidate = 300;
export async function generateStaticParams() {
  return (await publishedPosts()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const blogPosts = await publishedPosts();
  const post = blogPosts.find(item => item.slug === slug);
  if (!post) notFound();
  const state = await publicContent();
  const page = `/blog/${post.slug}/`;
  return pageMetadata({
    title: resolveText(state, page, post.title),
    description: post.description,
    path: `/blog/${post.slug}`,
    image: resolveImage(state, page, post.image)?.url || post.image,
    imageAlt: post.alt,
    article: true,
  });
}
export default async function BlogArticle({ params }: Props) {
  const slug = (await params).slug;
  const blogPosts = await publishedPosts();
  const post = blogPosts.find(item => item.slug === slug);
  if (!post) notFound();
  const relatedService = services.find((service) => service.id === post.serviceId);
  const state = await publicContent();
  const page = `/blog/${post.slug}/`;
  const cover = resolveImage(state, page, post.image);
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: resolveText(state, page, post.title),
          description: post.description,
          inLanguage: "tr-TR",
          mainEntityOfPage: publicUrl(`/blog/${post.slug}`),
          image: cover === null ? undefined : cover?.url || post.cover?.url || publicUrl(post.image),
          publisher: {
            "@type": "Organization",
            name: business.name,
            url: publicUrl("/"),
          },
        }}
      />
      <article className="blog-article">
        <header className="article-heading container">
          <CmsLink href="/blog" className="text-link"><CmsText>
            Blog
          </CmsText></CmsLink>
          <h1><CmsText>{post.title}</CmsText></h1>
        </header>
        <div className="article-cover container">
          <CmsImage
            src={post.image}
            media={post.cover}
            alt={post.alt}
            fill
            quality={65}
            sizes="(max-width: 700px) 100vw, 1100px"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <div className="article-body">
          {post.body ? post.body.split(/\n\s*\n/).map((paragraph, i) => <p key={i}><CmsText>{paragraph}</CmsText></p>) : <p><CmsText>{post.intro}</CmsText></p>}
          {post.sections.map((section) => (
            <section key={section.title}>
              <h2><CmsText>{section.title}</CmsText></h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}><CmsText>{paragraph}</CmsText></p>
              ))}
            </section>
          ))}
          {post.sources.length > 0 && <aside className="article-sources" aria-label="Yazının kaynakları">
            <h2><CmsText>Kaynaklar</CmsText></h2>
            <ul>
              {post.sources.map((source) => (
                <li key={source.url}>
                  <CmsAnchor
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CmsText>{source.title}</CmsText>
                  </CmsAnchor>
                </li>
              ))}
            </ul>
          </aside>
          }
          {relatedService && (
            <aside className="article-service" aria-label="İlgili hizmet">
              <CmsLink href={`/hizmetler#${relatedService.id}`} className="text-link">
                {relatedService.title}<CmsText> hizmetimizi inceleyin
              </CmsText></CmsLink>
            </aside>
          )}
        </div>
      </article>
      <section
        className="related-posts section-space container"
        aria-labelledby="related-title"
      >
        <h2 id="related-title"><CmsText>Diğer yazılar</CmsText></h2>
        <BlogGrid
          posts={blogPosts
            .filter((item) => item.slug !== post.slug)
            .slice(0, 3)}
        />
      </section>
    </>
  );
}
