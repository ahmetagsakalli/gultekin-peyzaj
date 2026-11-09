import { normalizePage, type CmsState, type GalleryImage } from "./cms-shared";
export const defaultGallery = (_page: string): GalleryImage[] => [];
export const pageGallery = (state: CmsState, page: string) => state.pageMedia?.[normalizePage(page)]?.gallery ?? defaultGallery(page);
