import assert from "node:assert/strict";
import test from "node:test";
import { normalizeSearch, searchSite } from "../src/lib/search.ts";

const entries = [
  {
    title: "Bahçe bakımı",
    href: "/hizmetler#bakim",
    kind: "Hizmet",
    text: "Bahçe bakımı çim biçme sulama",
  },
  {
    title: "Çim biçerken nelere dikkat edilmeli?",
    href: "/blog/cim",
    kind: "Blog",
    text: "Çim biçerken nelere dikkat edilmeli? Bahçe sulama",
  },
  {
    title: "İletişim",
    href: "/iletisim",
    kind: "Sayfa",
    text: "İletişim Eren Gültekin Atakum Samsun 0545 951 23 53",
  },
].map(({ text, ...entry }) => ({
  ...entry,
  searchText: normalizeSearch(text),
}));

test("Türkçe büyük/küçük harfler ve ASCII yazım eşleşir", () => {
  assert.equal(
    normalizeSearch("IĞDIR İLETİŞİM ÇİM ağaç"),
    "igdir iletisim cim agac",
  );
  assert.equal(searchSite(entries, "İLETİŞİM")[0].href, "/iletisim");
  assert.equal(searchSite(entries, "iletisim")[0].href, "/iletisim");
});
test("Başlık eşleşmesi içerik eşleşmesinden önce gelir", () => {
  assert.equal(searchSite(entries, "cim")[0].href, "/blog/cim");
  assert.deepEqual(
    searchSite(
      [
        {
          title: "Biçim",
          href: "/bicim",
          kind: "Sayfa",
          searchText: normalizeSearch("biçim seçim"),
        },
      ],
      "cim",
    ),
    [],
  );
});
test("Birden fazla sözcüğün tamamı aranır", () => {
  assert.deepEqual(
    searchSite(entries, "bahce bicme").map((entry) => entry.href),
    ["/hizmetler#bakim"],
  );
  assert.equal(searchSite(entries, "bahce samsun").length, 0);
});
test("Boş, kısa veya bulunamayan aramada sonuç üretilmez", () => {
  for (const query of ["", "  ", "x", "!!!", "bulunmayanicerik"]) {
    assert.deepEqual(searchSite(entries, query), []);
  }
});
test("Telefon ve bölge araması iletişime ulaştırır", () => {
  assert.equal(searchSite(entries, "0545 951")[0].href, "/iletisim");
  assert.equal(searchSite(entries, "samsun")[0].href, "/iletisim");
});
