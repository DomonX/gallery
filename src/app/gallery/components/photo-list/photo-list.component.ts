import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { GalleryPhoto } from '../../models/gallery.models';
import { ImagePreviewComponent } from '../image-preview/image-preview.component';

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss'],
})
export class PhotoListComponent implements OnInit {
  @Input() public photos: GalleryPhoto[] = [];
  @Input() public page: number = 0;
  @Input() public pageSize: number = 0;
  @Input() public totalItems: number = 0;
  @Input() public readonly: boolean = false;

  @Output() public onPageChange: EventEmitter<[number, number]> =
    new EventEmitter<[number, number]>();

  @Output() public onFavoriteClick: EventEmitter<string> =
    new EventEmitter<string>();

  @Output() public onDeleteClick: EventEmitter<string> =
    new EventEmitter<string>();

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {}

  public trackByFn(index: number, item: GalleryPhoto): string {
    return item.url;
  }

  public deleteImage(url: string): void {
    this.photos = this.photos.filter((i) => i.url !== url);
    this.onDeleteClick.emit(url);
  }

  public previewImage(photo: GalleryPhoto): void {
    const dialogRef = this.dialog.open(ImagePreviewComponent, {
      maxHeight: '90vh',
      maxWidth: '90vw',
    });
    dialogRef.componentInstance.url = photo.safeUrl;
  }

  public favoriteClick(url: string): void {
    this.photos = this.photos.map((i) =>
      i.url === url ? { ...i, favorite: !i.favorite } : i
    );
    this.onFavoriteClick.emit(url);
  }

  public onPage(event: PageEvent): void {
    this.onPageChange.emit([event.pageIndex, event.pageSize]);
  }
}
