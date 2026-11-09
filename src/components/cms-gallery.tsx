"use client";
import Image from "next/image";
import { useCms, useCmsPage } from "./cms";
import { pageGallery } from "@/lib/page-galleries";
export function CmsGallery() {
  const items = pageGallery(useCms(), useCmsPage());
  if (!items.length) return null;
  return <section className="cms-gallery section-space container" aria-label="Fotoğraflar">
    {items.map(item => <div className="cms-gallery-image" key={item.id}><Image src={item.url} alt={item.alt} fill sizes="(max-width: 700px) 90vw, 400px" data-gallery-id={item.id} loader={({ width }) => item.variants.find(variant => variant.width >= width)?.url || item.url} /></div>)}
  </section>;
}
