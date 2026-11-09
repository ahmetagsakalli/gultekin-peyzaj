export type SearchEntry = {
  title: string;
  href: string;
  kind: "Sayfa" | "Hizmet" | "Blog";
  searchText: string;
};

export function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchSite(entries: SearchEntry[], query: string) {
  const normalized = normalizeSearch(query);
  if (normalized.length < 2) return [];
  const words = normalized.split(" ");
  return entries
    .filter((entry) =>
      words.every(
        (word) =>
          entry.searchText.startsWith(word) ||
          entry.searchText.includes(` ${word}`),
      ),
    )
    .map((entry) => {
      const title = normalizeSearch(entry.title);
      return {
        entry,
        score:
          (title.includes(normalized) ? 10 : 0) +
          words.filter((word) => title.includes(word)).length,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ entry }) => entry);
}
