import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './containers/gallery/gallery.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { MatDialogModule } from '@angular/material/dialog';

import { MatPaginatorModule } from '@angular/material/paginator';
import { PhotoListComponent } from './components/photo-list/photo-list.component';
import { FavoriteComponent } from './containers/favorite/favorite.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GalleryComponent,
    ImagePreviewComponent,
    PhotoListComponent,
    FavoriteComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: GalleryComponent },
      {
        path: 'favorite',
        component: FavoriteComponent,
      },
    ]),
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  exports: [GalleryComponent],
})
export class GalleryModule {}
