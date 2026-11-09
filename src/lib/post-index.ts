import { blogPosts } from "./blog";
// Existing article URLs are reserved when deriving a new article URL.
export const postIndex = blogPosts.map(({ slug, title }) => ({ slug, title }));
