import { describe, expect, it } from "vitest";
import { blogPosts } from "../src/lib/blog";
import { business, services } from "../src/lib/content";
import { emptyCms, normalizePage, resolveImage, resolveText, textKey, type CmsState } from "../src/lib/cms-shared";
import { buildSearchEntries } from "../src/lib/search-index";
import { searchSite } from "../src/lib/search";
import { publishedBusinessSchema } from "../src/lib/seo";

describe("Published content stays consistent outside the page body", () => {
  it("keeps homepage content scoped to home after Vercel ISR uses the /index alias", () => {
    const state: CmsState = { ...emptyCms, pageMedia: { "/": { texts: { [textKey("Doğaya")]: "Bahçenize" }, images: { "/images/hero.webp": null } } } };
    expect(normalizePage("/index")).toBe("/");
    expect(normalizePage("/index/")).toBe("/");
    expect(resolveText(state, "/index", "Doğaya")).toBe("Bahçenize");
    expect(resolveImage(state, "/index/", "/images/hero.webp")).toBeNull();
    expect(normalizePage("/blog/index")).toBe("/blog/index/");
  });
  it("finds new blog content beyond the generated summary without duplicating repeated words", () => {
    const post = { ...blogPosts[0], slug: "yeni-yazi", title: "Yeni yazı", description: "Bahçe ".repeat(25), intro: "", sections: [], body: `${"Bahçe ".repeat(500)} Ormangülü yetiştirme` };
    const entries = buildSearchEntries([post]);
    expect(searchSite(entries, "ormangulu")[0].href).toBe("/blog/yeni-yazi");
    expect(entries.find(entry => entry.href === "/blog/yeni-yazi")!.searchText.length).toBeLessThan(100);
  });

  it("searches the published service and article edits in their page scope", () => {
    const post = blogPosts[0];
    const state: CmsState = { ...emptyCms, pageMedia: {
      "/hizmetler/": { texts: { [textKey(services[0].title)]: "Yeni bitkilendirme", [textKey(services[0].description)]: "Defne çitleri" } },
      [`/blog/${post.slug}/`]: { texts: { [textKey(post.title)]: "Yerel bitkiler", [textKey(post.sections[0].paragraphs[0])]: "Ortanca ve kamelya" } },
    } };
    const entries = buildSearchEntries([post], state);
    expect(searchSite(entries, "defne").some(entry => entry.title === "Yeni bitkilendirme")).toBe(true);
    expect(searchSite(entries, "kamelya")[0].title).toBe("Yerel bitkiler");
  });

  it("reflects shared contact edits in search and structured data", () => {
    const state: CmsState = { ...emptyCms, texts: { [textKey(business.phone)]: "0555 111 22 33", [textKey(business.region)]: "Örnek bölge" }, links: { [business.phoneHref]: "tel:+905551112233", [business.facebook]: "https://www.facebook.com/example" } };
    expect(searchSite(buildSearchEntries([], state), "0555 111")[0].href).toBe("/iletisim");
    const schema = publishedBusinessSchema(state);
    expect(schema.telephone).toBe("+905551112233");
    expect(schema.contactPoint[0].telephone).toBe(schema.telephone);
    expect(schema.sameAs[1]).toBe("https://www.facebook.com/example");
    expect(schema.areaServed.name).toBe("Örnek bölge");
    expect(publishedBusinessSchema(emptyCms).telephone).toBe(business.phoneHref.slice(4));
  });
});
