import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";


import type { BlogPost } from "@/lib/blog";

export function BlogGrid({
  posts,
  headingLevel = "h3",
  prioritizeFirstImage = false,
}: {
  posts: BlogPost[];
  headingLevel?: "h2" | "h3";
  prioritizeFirstImage?: boolean;
}) {
  const Heading = headingLevel;
  return (
    <div className="blog-grid">
      {posts.map((post, index) => (
        <CmsScope page={`/blog/${post.slug}/`} key={post.slug}><article className="blog-card">
          <CmsLink href={`/blog/${post.slug}`}>
            <div className="blog-card-image">
              <CmsImage
                src={post.image}
                media={post.cover}
                alt={post.alt}
                fill
                quality={65}
                sizes="(max-width: 700px) 90vw, (max-width: 1000px) 45vw, 420px"
                loading={prioritizeFirstImage && index === 0 ? "eager" : "lazy"}
                fetchPriority={
                  prioritizeFirstImage && index === 0 ? "high" : undefined
                }
              />
            </div>
            <Heading className="blog-card-title"><CmsText>{post.title}</CmsText></Heading>
          </CmsLink>
        </article></CmsScope>
      ))}
    </div>
  );
}
