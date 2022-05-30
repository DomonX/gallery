import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { GalleryPhoto } from 'src/app/gallery/models/gallery.models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public photos: GalleryPhoto[] = [];
  public allPhotos: GalleryPhoto[] = [];

  public range = [0, 5];

  constructor(private sanitizer: DomSanitizer) {
    this.allPhotos = new Array(40).fill(0).map((i, id) => ({
      favorite: true,
      url: `https://picsum.photos/id/${id}/800/800`,
      safeUrl: this.sanitizer.bypassSecurityTrustUrl(
        `https://picsum.photos/id/${id}/800/800`
      ),
      lastModification: new Date().getDate(),
      name: 'Przykładowy plik',
      size: 0,
      owner: 'Jan Kowalski',
      tags: [],
    }));

    this.photos = this.allPhotos.slice(this.range[0], this.range[1]);
  }

  public ngOnInit(): void {}

  public pageChange(event: [number, number]): void {
    this.range = [event[1] * event[0], event[1] * event[0] + event[1]];
    this.photos = this.allPhotos.slice(this.range[0], this.range[1]);
  }
}
