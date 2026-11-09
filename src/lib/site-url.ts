/** Set at build time, once the public domain has been confirmed. */
export function parseSiteUrl(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  const url = new URL(value.trim());
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    url.hostname === "localhost" ||
    url.hostname.endsWith(".localhost") ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "[::1]"
  ) {
    throw new Error(
      "SITE_URL, yol veya sorgu içermeyen gerçek HTTPS site adresi olmalı.",
    );
  }
  return url.origin;
}

export const siteUrl = parseSiteUrl(process.env.SITE_URL);

export function publicUrl(path: string): string | undefined {
  return siteUrl ? new URL(path, siteUrl).href : undefined;
}
