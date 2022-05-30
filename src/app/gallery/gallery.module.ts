import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent } from './containers/gallery/gallery.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ImagePreviewComponent } from './components/image-preview/image-preview.component';
import { MatDialogModule } from '@angular/material/dialog';

import { MatPaginatorModule } from '@angular/material/paginator';
import { FavoriteComponent } from './containers/favorite/favorite.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadModule } from '../main/components/upload/upload.module';
import { PhotoListModule } from './components/photo-list/photo-list.module';
import { TagFormComponent } from './components/tag-form/tag-form.component';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';

import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    GalleryComponent,
    ImagePreviewComponent,
    FavoriteComponent,
    TagFormComponent,
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
    MatSelectModule,
    MatSliderModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    UploadModule,
    PhotoListModule,
    FormsModule,
    MatChipsModule,
    MatAutocompleteModule,
  ],
  exports: [GalleryComponent],
})
export class GalleryModule {}
