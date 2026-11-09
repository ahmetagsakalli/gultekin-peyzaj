"use client";
import { CmsText, CmsImage, CmsLink, CmsAnchor, CmsScope } from "@/components/cms";




import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { business, navigation } from "@/lib/content";
import { SiteSearch } from "./site-search";
import type { SearchEntry } from "@/lib/search";
import { normalizePage } from "@/lib/cms-shared";

export function Header({ searchEntries }: { searchEntries: SearchEntry[] }) {
  const pathname = normalizePage(usePathname());
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <header className={`header-wrap${pathname === "/" ? " header-home" : ""}`}>
      <div className="site-header">
        <CmsLink
          href="/"
          className="brand"
          aria-label="Gültekin Peyzaj ana sayfa"
          onClick={() => setOpen(false)}
        >
          <CmsImage
            src="/images/logo.webp"
            alt="Gültekin Peyzaj"
            width={100}
            height={90}
            sizes="(max-width: 950px) 70px, 92px"
            loading="eager"
            className="brand-image"
          />
        </CmsLink>
        <nav className="desktop-nav" aria-label="Ana menü">
          {navigation.map((item) => (
            <CmsLink
              key={item.href}
              href={item.href}
              aria-current={normalizePage(pathname) === normalizePage(item.href) ? "page" : undefined}
            >
              <CmsText>{item.label}</CmsText>
            </CmsLink>
          ))}
        </nav>
        <SiteSearch
          key={pathname}
          entries={searchEntries}
          onOpen={() => setOpen(false)}
        />
        <button
          className="menu-toggle"
          type="button"
          ref={buttonRef}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          onClick={() => setOpen((value) => !value)}
        >
          <span className={open ? "menu-lines is-open" : "menu-lines"}>
            <i />
            <i />
          </span>
        </button>
        {open && (
          <nav id="mobile-menu" className="mobile-menu" aria-label="Mobil menü">
            {navigation.map((item) => (
              <CmsLink
                key={item.href}
                href={item.href}
                aria-current={normalizePage(pathname) === normalizePage(item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                <CmsText>{item.label}</CmsText>
              </CmsLink>
            ))}
            <CmsAnchor
              href={business.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-menu-contact"
              onClick={() => setOpen(false)}
            ><CmsText>
              WhatsApp’tan yazın
            </CmsText></CmsAnchor>
          </nav>
        )}
      </div>
    </header>
  );
}
