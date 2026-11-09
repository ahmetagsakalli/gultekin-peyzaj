import type { MetadataRoute } from "next";
import { navigation } from "@/lib/content";
import { publishedPosts } from "@/lib/blog-server";
import { siteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await publishedPosts();
  // Do not publish fictitious or localhost URLs before the domain is confirmed.
  if (!siteUrl) return [];
  return [
    ...navigation.map(({ href }) => href),
    ...blogPosts.map(({ slug }) => `/blog/${slug}`),
  ].map((path) => ({ url: new URL(path, siteUrl).href }));
}
