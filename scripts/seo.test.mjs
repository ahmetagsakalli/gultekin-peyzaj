import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import { parseSiteUrl } from "../src/lib/site-url.ts";

test("no public domain is invented when SITE_URL is empty", () => {
  assert.equal(parseSiteUrl(undefined), undefined);
  assert.equal(parseSiteUrl("  "), undefined);
});

test("the configured origin is normalized without a trailing slash", () => {
  assert.equal(
    parseSiteUrl(" https://www.example.com/ "),
    "https://www.example.com",
  );
});

test("invalid public origins fail instead of producing incorrect canonicals", () => {
  for (const value of [
    "example.com",
    "http://example.com",
    "https://localhost",
    "https://127.0.0.1",
    "https://[::1]",
    "https://example.com/blog",
    "https://example.com?ref=1",
    "https://example.com#home",
    "https://user:pass@example.com",
  ])
    assert.throws(() => parseSiteUrl(value), value);
});

test("public URLs activate only for a configured domain", () => {
  const moduleUrl = new URL("../src/lib/site-url.ts", import.meta.url).href;
  for (const [domain, expected] of [
    ["", "undefined"],
    ["https://seo-audit.invalid", "https://seo-audit.invalid/blog/test"],
  ]) {
    const output = execFileSync(
      process.execPath,
      [
        "--experimental-strip-types",
        "--input-type=module",
        "-e",
        `import { publicUrl } from ${JSON.stringify(moduleUrl)}; console.log(publicUrl('/blog/test'));`,
      ],
      {
        env: { ...process.env, SITE_URL: domain },
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
      },
    );
    assert.equal(output.trim(), expected);
  }
});
