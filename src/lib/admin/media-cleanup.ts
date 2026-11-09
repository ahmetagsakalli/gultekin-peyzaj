import "server-only";
import { del } from "@vercel/blob";
import { database } from "./db";
// A network error does not prove the save failed: the database may have committed.
// Keep the files unless their absence from storage has been positively confirmed.
export async function cleanupUncommittedMedia(id: string, urls: string[]) {
  try {
    const rows = await database()`SELECT id FROM jp_media WHERE id = ${id}::uuid`;
    if (!rows.length) await del(urls);
  } catch { /* Prefer an unused upload over breaking a saved draft/history entry. */ }
}
