"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { normalizeSearch, searchSite, type SearchEntry } from "@/lib/search";
import { SearchIcon } from "./icons";

export function SiteSearch({
  entries,
  onOpen,
}: {
  entries: SearchEntry[];
  onOpen: () => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsId = useId();
  const results = searchSite(entries, query);
  const visible = open && normalizeSearch(query).length >= 2;

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      )
        setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return (
    <form
      ref={rootRef}
      role="search"
      aria-label="Site içi arama"
      className="site-search"
      onSubmit={(event) => {
        event.preventDefault();
        setOpen(true);
        rootRef.current
          ?.querySelector<HTMLAnchorElement>(".search-result")
          ?.focus();
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          inputRef.current?.focus();
          setOpen(false);
        }
        if (
          event.target === inputRef.current &&
          event.key === "ArrowDown" &&
          visible
        ) {
          event.preventDefault();
          rootRef.current
            ?.querySelector<HTMLAnchorElement>(".search-result")
            ?.focus();
        }
      }}
    >
      <label className="search-field">
        <SearchIcon />
        <span className="sr-only">Site içinde ara</span>
        <input
          ref={inputRef}
          type="search"
          placeholder="Site içinde ara"
          value={query}
          maxLength={80}
          autoComplete="off"
          spellCheck={false}
          aria-controls={visible ? resultsId : undefined}
          onFocus={() => {
            setOpen(true);
            onOpen();
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
        />
      </label>
      <span className="sr-only" role="status">
        {visible
          ? results.length
            ? `${results.length} sonuç bulundu.`
            : "Sonuç bulunamadı."
          : ""}
      </span>
      {visible && (
        <div
          id={resultsId}
          className="search-results"
          aria-label="Arama sonuçları"
        >
          {results.length ? (
            <ul>
              {results.map((result) => (
                <li key={result.href}>
                  <Link
                    className="search-result"
                    href={result.href}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    <span>{result.kind}</span>
                    <strong>{result.title}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aramanızla eşleşen içerik bulunamadı.</p>
          )}
        </div>
      )}
    </form>
  );
}
