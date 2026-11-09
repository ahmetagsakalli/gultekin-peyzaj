import { blogPosts, type BlogPost } from "./blog";
import { business, navigation, services } from "./content";
import { normalizeSearch, type SearchEntry } from "./search";
import { emptyCms, normalizePage, resolveText, type CmsState } from "./cms-shared";

const pageText: Record<string, string> = {
  "/": "Gültekin Peyzaj doğaya değer katarız bahçe hizmetleri",
  "/hizmetler":
    "Peyzaj tasarımı uygulama periyodik bahçe bakımı çim biçme sulama budama",
  "/hakkimizda": `Gültekin Peyzaj ${business.owner} ${business.location} ${business.region}`,
  "/blog": "Bahçeden notlar bahçe bakım yazıları",
  "/iletisim": "telefon WhatsApp Instagram Facebook ulaşım iletişim",
};

// Search matches word prefixes; repeated words need not travel to every page.
function searchWords(value: string) {
  return [...new Set(normalizeSearch(value).split(" "))].join(" ");
}

export function buildSearchEntries(posts: BlogPost[] = blogPosts, state: CmsState = emptyCms): SearchEntry[] {
  const text = (page: string, value: string) => resolveText(state, page, value);
  return [
  ...navigation.map((page) => ({
    title: text("shared", page.label),
    href: page.href,
    kind: "Sayfa" as const,
    searchText: searchWords(`${text("shared", page.label)} ${pageText[page.href]} ${Object.values(state.pageMedia?.[normalizePage(page.href)]?.texts || {}).join(" ")} ${page.href === "/iletisim" ? [business.phone, business.owner, business.location, business.region].map(value => text("shared", value)).join(" ") : ""}`),
  })),
  ...services.map((service) => ({
    title: text("/hizmetler", service.title),
    href: `/hizmetler#${service.id}`,
    kind: "Hizmet" as const,
    searchText: searchWords(
      [service.title, service.description, ...service.details].map(value => text("/hizmetler", value)).join(" "),
    ),
  })),
  ...posts.map((post) => ({
    title: text(`/blog/${post.slug}`, post.title),
    href: `/blog/${post.slug}`,
    kind: "Blog" as const,
    searchText: searchWords(
      [post.title, post.description, post.intro, ...(post.body ? post.body.split(/\n\s*\n/) : []), ...post.sections.flatMap(section => [section.title, ...section.paragraphs])].map(value => text(`/blog/${post.slug}`, value)).join(" "),
    ),
  })),
  ];
}

export const searchEntries = buildSearchEntries();
