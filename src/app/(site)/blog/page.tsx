import { BlogGrid } from "@/components/blog-grid";
import { PageHeading } from "@/components/shared";
import { publishedPosts } from "@/lib/blog-server";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata({
  title: "Bahçe Bakımı ve Peyzaj Blogu",
  description:
    "Bahçe düzenleme, çim bakımı, sulama, budama ve toprak hakkında Gültekin Peyzaj blog yazıları.",
  path: "/blog",
});
export default async function BlogPage() {
  const blogPosts = await publishedPosts();
  return (
    <>
      <PageHeading title="Bahçeden" accent="notlar." />
      <section className="blog-index container" aria-label="Blog yazıları">
        <BlogGrid posts={blogPosts} headingLevel="h2" prioritizeFirstImage />
      </section>
    </>
  );
}
