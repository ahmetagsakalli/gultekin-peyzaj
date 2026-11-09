"use client";
import { createContext, useContext, useEffect, useState, type ReactNode, type ComponentProps } from "react";
import { usePathname } from "next/navigation";
import NextLink from "next/link";
import NextImage, { type ImageProps } from "next/image";
import { emptyCms, normalizePage, textKey, resolveImage, resolveText, type CmsState, type MediaOverride } from "@/lib/cms-shared";
const ScopeContext = createContext<string | undefined>(undefined);
export function CmsScope({ page, children }: { page: string; children: ReactNode }) { return <ScopeContext.Provider value={page}>{children}</ScopeContext.Provider>; }
export function useCmsPage() { const scope = useContext(ScopeContext); const path = usePathname(); return normalizePage(scope || path || "/"); }
export function usePageImage(src: string) { return resolveImage(useCms(), useCmsPage(), src); }
const CmsContext = createContext<CmsState>(emptyCms);
const PreviewContext = createContext(false);
export function CmsProvider({ state, children }: { state: CmsState; children: ReactNode }) {
  const [preview, setPreview] = useState(false), [previewState, setPreviewState] = useState<CmsState>();
  useEffect(() => {
    let active = true;
    try {
      const isPreview = window.parent !== window && window.parent.location.origin === window.location.origin && /^\/admin(?:\/|$)/.test(window.parent.location.pathname) && new URLSearchParams(window.location.search).has("editorPreview");
      if (isPreview) void fetch("/api/admin/content/", { cache: "no-store", signal: AbortSignal.timeout(20000) }).then(async response => {
        if (!response.ok) throw new Error("Draft preview unavailable");
        const result = await response.json();
        if (active) { setPreviewState(result.state); setPreview(true); }
      }).catch(() => { if (active) { document.documentElement.dataset.cmsPreviewError = "true"; document.dispatchEvent(new Event("jp-cms-error")); } });
    } catch { /* Cross-origin frames never load drafts. */ }
    return () => { active = false; delete document.documentElement.dataset.cmsPreviewError; };
  }, []);
  useEffect(() => { if (!preview) return; document.documentElement.dataset.cmsPreviewReady = "true"; document.dispatchEvent(new Event("jp-cms-ready")); return () => { delete document.documentElement.dataset.cmsPreviewReady; }; }, [preview]);
  return <CmsContext.Provider value={previewState || state}><PreviewContext.Provider value={preview}>{children}</PreviewContext.Provider></CmsContext.Provider>;
}
export function useCms() { return useContext(CmsContext); }
export function CmsText({ children }: { children: ReactNode }) {
  const state = useCms(), page = useCmsPage();
  const preview = useContext(PreviewContext);
  function replace(node: ReactNode, index?: number): ReactNode {
    if (typeof node === "string") {
      const value = resolveText(state, page, node);
      const output = value === node ? node : `${node.match(/^\s*/)?.[0] || ""}${value}${node.match(/\s*$/)?.[0] || ""}`;
      return preview && node.trim() ? <span key={index} data-cms-text={textKey(node)} data-cms-page={page} style={{ display: "contents", color: "inherit" }}>{output}</span> : output;
    }
    if (Array.isArray(node)) return node.map(replace);
    return node;
  }
  return replace(children);
}
export function useImageUrl(src: string) { return usePageImage(src)?.url || src; }
export function CmsImage({ media, ...props }: ImageProps & { media?: MediaOverride }) {
  const page = useCmsPage();
  const markers = { "data-cms-image": typeof props.src === "string" ? props.src : "", "data-cms-page": page };
  const override = usePageImage(typeof props.src === "string" ? props.src : "");
  const replacement = override === undefined ? media : override;
  if (replacement === null) return <span data-cms-hidden hidden />;
  if (!replacement) return <NextImage {...props} {...markers} />;
  return <NextImage {...props} {...markers} src={replacement.url} alt={replacement.alt || props.alt} loader={({ width }) => replacement.variants.find(item => item.width >= width)?.url || replacement.url} />;
}

export function useTranslatedText() {
  const state = useCms(), page = useCmsPage();
  return (value: string) => resolveText(state, page, value);
}

function translatedHref(state: CmsState, page: string, href: string) {
  const local = state.pageLinks?.[page] || {};
  const base = href.split("?")[0];
  const replacement = local[href] || state.links?.[href] || local[base] || state.links?.[base];
  return replacement ? `${replacement}${href.includes("?") && !replacement.includes("?") ? href.slice(href.indexOf("?")) : ""}` : href;
}
export function CmsLink(props: ComponentProps<typeof NextLink>) {
  const state = useCms(), page = useCmsPage();
  return <NextLink {...props} href={typeof props.href === "string" ? translatedHref(state, page, props.href) : props.href} />;
}
export function CmsAnchor(props: ComponentProps<"a">) {
  const state = useCms(), page = useCmsPage();
  return <a {...props} href={props.href ? translatedHref(state, page, props.href) : undefined} />;
}
