import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GalleryService } from 'src/app/gallery/services/gallery.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  @ViewChild('file') fileInput!: HTMLInputElement;

  constructor(
    private galleryService: GalleryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {}

  public onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const arr = Array.from(target.files ?? []);
    arr.map((i) => {
      this.galleryService.upload(i);
    });
    this.fileInput.value = '';
    this.openSnack(arr.length);
  }

  public onDropFiles(
    event: MouseEvent & { dataTransfer: DataTransfer | null }
  ): void {
    this.prevent(event);
    const arr = Array.from(event?.dataTransfer?.files ?? []);
    arr.map((i) => {
      this.galleryService.upload(i);
    });

    this.openSnack(arr.length);
  }

  public prevent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private openSnack(amount: number): void {
    let plural = '';
    if (amount === 0) {
      plural = 'zdjęć';
    }
    if (amount === 1) {
      plural = 'zdjęcie';
    }
    if (amount > 1 && amount < 5) {
      plural = 'zdjęcia';
    }
    if (amount > 4) {
      plural = 'zdjęć';
    }
    this.snackBar.open(`Dodano ${amount} ${plural}`, '', {
      duration: 2000,
    });
  }
}
