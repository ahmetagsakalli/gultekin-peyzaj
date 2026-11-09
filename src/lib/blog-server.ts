import "server-only";
import { cache } from "react";
import { publicContent } from "./admin/content";
import { posts } from "./posts";
import { blogEntries, blogPost } from "./blog-shared";

// Only the published snapshot is used by public pages and metadata.
export const publishedPosts = cache(async () => [
  ...blogEntries(await publicContent()).map(blogPost), ...posts,
]);
