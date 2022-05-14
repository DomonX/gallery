import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  combineLatest,
  Observable,
  ReplaySubject,
  startWith,
  switchMap,
  map,
} from 'rxjs';
import { GalleryPhoto } from '../../models/gallery.models';
import { GalleryService } from '../../services/gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  public photos$: Observable<GalleryPhoto[]>;
  public rangeSize$: Observable<[number, number]>;
  public count$: Observable<number>;

  public searchControl: FormControl = new FormControl();
  public sizeControl: FormControl = new FormControl();

  public pageData$: ReplaySubject<[number, number]> = new ReplaySubject<
    [number, number]
  >(1);

  constructor(private galleryService: GalleryService) {
    const photoData$ = combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.pageData$.pipe(startWith([0, 5] as [number, number])),
      this.sizeControl.valueChanges.pipe(startWith(undefined)),
    ]).pipe(
      switchMap(([value, page, size]) =>
        this.galleryService.getPhotos(value, page, size)
      )
    );

    this.photos$ = photoData$.pipe(map((data) => data.items));

    this.count$ = photoData$.pipe(map((data) => data.total));

    this.rangeSize$ = this.galleryService.sizeRange;
  }

  ngOnInit(): void {}

  public favoriteClick(url: string): void {
    this.galleryService.addToFavorites(url);
  }

  public pageChange(page: [number, number]): void {
    this.pageData$.next(page);
  }

  public deleteClick(url: string): void {
    this.galleryService.delete(url);
  }
}
