import type { Metadata } from "next";
import { business } from "@/lib/content";
import { publicUrl } from "@/lib/site-url";
import { resolveImage, resolveText, type CmsState } from "@/lib/cms-shared";

export const siteTitle = "Gültekin Peyzaj | Samsun Peyzaj ve Bahçe Bakımı";
export const siteDescription =
  "Samsun ve çevresinde peyzaj tasarım ve uygulama, periyodik bahçe bakımı ve budama. Gültekin Peyzaj, Atakum.";

export function pageMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
  imageAlt = "Gültekin Peyzaj — Samsun ve çevresinde peyzaj ve bahçe bakımı",
  article = false,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  article?: boolean;
}): Metadata {
  const url = publicUrl(path);
  const fullTitle = title === siteTitle ? title : `${title} | ${business.name}`;
  return {
    title: { absolute: fullTitle },
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      title: fullTitle,
      description,
      locale: "tr_TR",
      siteName: business.name,
      type: article ? "article" : "website",
      ...(url ? { url } : {}),
      images: [{ url: image, alt: imageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [{ url: image, alt: imageAlt }],
    },
  };
}

// Only confirmed business details; no invented street address, hours or ratings.
export const businessSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: business.name,
  description: siteDescription,
  url: publicUrl("/"),
  logo: publicUrl("/images/logo.webp"),
  telephone: business.phoneHref.replace("tel:", ""),
  sameAs: [business.instagram, business.facebook],
  areaServed: { "@type": "AdministrativeArea", name: business.region },
  contactPoint: [{
    "@type": "ContactPoint",
    telephone: business.phoneHref.replace("tel:", ""),
    contactType: "customer service",
    availableLanguage: "Turkish",
  }],
};

export function publishedBusinessSchema(state: CmsState) {
  const href = (original: string) => state.pageLinks?.shared?.[original] || state.links?.[original] || original;
  const telephone = href(business.phoneHref).replace("tel:", "");
  const logo = resolveImage(state, "shared", "/images/logo.webp");
  return {
    ...businessSchema,
    name: resolveText(state, "shared", business.name),
    telephone,
    logo: logo === null ? undefined : logo?.url || businessSchema.logo,
    sameAs: [href(business.instagram), href(business.facebook)],
    areaServed: { ...businessSchema.areaServed, name: resolveText(state, "shared", business.region) },
    contactPoint: [{ ...businessSchema.contactPoint[0], telephone }],
  };
}
