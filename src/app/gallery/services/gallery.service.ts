import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { map, Observable, ReplaySubject, withLatestFrom } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GalleryPhoto } from '../models/gallery.models';

@Injectable({
  providedIn: 'root',
})
export class GalleryService {
  private _photos: GalleryPhoto[] = [];
  public get photos(): GalleryPhoto[] {
    return this._photos;
  }

  private _photos$: ReplaySubject<GalleryPhoto[]> = new ReplaySubject(1);

  public get photos$(): Observable<GalleryPhoto[]> {
    return this._photos$.pipe(
      withLatestFrom(this.authService.loggedUser$),
      map(([photos, user]) =>
        photos.filter((photo) => photo.owner === user?.email)
      )
    );
  }

  public set photos(photos: GalleryPhoto[]) {
    this._photos = photos;
    this._photos$.next(photos);
  }

  public get sizeRange(): Observable<[number, number]> {
    return this.photos$.pipe(
      map((photos) => {
        const sizes = photos.map((photo) => photo.size);
        const min = Math.floor(Math.min(...sizes) / 1000);
        const max = Math.floor(Math.max(...sizes) / 1000) + 1;
        return [min, max];
      })
    );
  }

  constructor(
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.photos = [
      { size: 344 * 1000, tags: ['Pies'] },
      { size: 95 * 1000, tags: ['Pies'] },
      { size: 3971 * 1000, tags: ['Budowle', 'Zamek'] },
      { size: 2742 * 1000, tags: ['Natura', 'Zachód'] },
      { size: 2726 * 1000, tags: ['Natura', 'Zachód'] },
      { size: 2733 * 1000, tags: ['Natura', 'Śnieg'] },
      { size: 1206 * 1000, tags: ['Natura', 'Woda'] },
      { size: 946 * 1000, tags: ['Natura', 'Zachód'] },
      { size: 1048 * 1000, tags: ['Natura'] },
      { size: 1191 * 1000, tags: ['Natura'] },
      { size: 1015 * 1000, tags: ['Natura'] },
      { size: 1060 * 1000, tags: ['Budowle'] },
      { size: 1139 * 1000, tags: ['Budowle'] },
      { size: 1327 * 1000, tags: ['Natura', 'Kwiaty'] },
      { size: 1044 * 1000, tags: ['Budowle'] },
      { size: 495 * 1000, tags: ['Pies'] },
    ].map(({ size, tags }, id) => ({
      name: `${id + 1}.jpg`,
      url: `assets/imgs/${id + 1}.jpg`,
      size,
      tags,
      favorite: true,
      owner: 'admin@admin.com',
      lastModification: new Date().getDate(),
      safeUrl: this.sanitizer.bypassSecurityTrustUrl(
        `assets/imgs/${id + 1}.jpg`
      ),
    }));
  }

  public addToFavorites(url: string): void {
    this.photos = this.photos.map((photo) =>
      photo.url === url ? { ...photo, favorite: !photo.favorite } : photo
    );
  }

  public upload(file: File): void {
    const url = URL.createObjectURL(file);

    const userEmail = this.authService.loggedUser?.email;

    if (!userEmail) {
      return;
    }

    const photo: GalleryPhoto = {
      url,
      safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(url),
      name: file.name,
      size: file.size,
      favorite: false,
      lastModification: file.lastModified,
      owner: userEmail,
      tags: [],
    };

    this.photos = [...this.photos, photo];
  }

  public getFavorites(): Observable<GalleryPhoto[]> {
    return this.photos$.pipe(
      map((photos) => photos.filter((photo) => photo.favorite))
    );
  }

  public getPhotos(
    search: string,
    pageData?: [number, number],
    maxSize?: number,
    isFavorite?: boolean
  ): Observable<{ items: GalleryPhoto[]; total: number }> {
    return this.photos$.pipe(
      map((photos) => {
        let currentPhotos = photos;

        currentPhotos = photos.filter(
          (photo) =>
            photo.name.toLowerCase().includes(search.toLowerCase()) ||
            photo.tags.some((tag) =>
              tag.toLowerCase().includes(search.toLowerCase())
            )
        );

        const currentUser = this.authService.loggedUser?.email;

        if (currentUser) {
          currentPhotos = currentPhotos.filter(
            (photo) => photo.owner === currentUser
          );
        } else {
          currentPhotos = [];
        }

        if (maxSize) {
          currentPhotos = currentPhotos.filter(
            (photo) => photo.size <= maxSize * 1000
          );
        }

        if (isFavorite) {
          currentPhotos = currentPhotos.filter((photo) => photo.favorite);
        }

        const total = currentPhotos.length;

        if (!pageData) {
          return { items: currentPhotos, total };
        }

        const start = pageData[0] * pageData[1];
        const end = start + pageData[1];

        return { items: currentPhotos.slice(start, end), total };
      })
    );
  }

  public getCount(): Observable<number> {
    return this.photos$.pipe(map((photos) => photos.length));
  }

  public delete(url: string): void {
    this.photos = this.photos.filter((photo) => photo.url !== url);
  }

  public getTags(): Observable<string[]> {
    return this.photos$.pipe(
      map((photos) => {
        const tags = photos.reduce(
          (acc, photo) => [...acc, ...photo.tags],
          [] as string[]
        );
        return Array.from(new Set(tags));
      })
    );
  }

  public updateTags(url: string, tags: string[]): void {
    this.photos = this.photos.map((photo) =>
      photo.url === url ? { ...photo, tags } : photo
    );
  }
}
