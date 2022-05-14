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
  ) {}

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

        currentPhotos = photos.filter((photo) =>
          photo.name.toLowerCase().includes(search.toLowerCase())
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
}
