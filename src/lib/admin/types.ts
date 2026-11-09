export type ContentField = { id: string; label: string; text: string };
export type ContentDocument = { id: string; title: string; group: string; path: string; fields: ContentField[]; images: string[] };
export type ImageSlot = { src: string; alt: string; pages: string[] };
export type CmsRegistry = { documents: ContentDocument[]; texts: Record<string, string>; images: ImageSlot[] };
