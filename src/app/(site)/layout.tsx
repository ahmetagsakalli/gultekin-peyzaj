import { CmsGallery } from "@/components/cms-gallery";
import { Header } from "@/components/header";
import { Footer } from "@/components/shared";
import { CmsProvider, CmsScope } from "@/components/cms";
import { publicContent } from "@/lib/admin/content";
import { publishedPosts } from "@/lib/blog-server";
import { buildSearchEntries } from "@/lib/search-index";
import "./globals.css";

export const revalidate = 300;
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [state, posts] = await Promise.all([publicContent(), publishedPosts()]);
  // Article bodies belong to article pages, not every page's client payload.
  const clientState = { ...state, pageMedia: Object.fromEntries(Object.entries(state.pageMedia || {}).map(([path, page]) => {
    const { blogPost: _body, ...media } = page;
    return [path, media];
  })) };
  const entries = buildSearchEntries(posts, state);
  return <CmsProvider state={clientState}>
    <a className="skip-link" href="#icerik">İçeriğe geç</a>
    <CmsScope page="shared"><Header searchEntries={entries} /></CmsScope>
    <main id="icerik">{children}<CmsGallery /></main>
    <CmsScope page="shared"><Footer /></CmsScope>
  </CmsProvider>;
}
