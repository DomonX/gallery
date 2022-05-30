import { SafeResourceUrl } from '@angular/platform-browser';

export interface GalleryPhoto {
  url: string;
  safeUrl: SafeResourceUrl;
  favorite: boolean;
  name: string;
  size: number;
  lastModification: number;
  owner: string;
  tags: string[];
}
