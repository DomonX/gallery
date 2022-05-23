import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [UploadComponent],
  imports: [CommonModule, MatIconModule, MatSnackBarModule],
  exports: [UploadComponent],
})
export class UploadModule {}
