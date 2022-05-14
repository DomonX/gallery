import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: MainComponent,
      },
    ]),
  ],
})
export class MainModule {}
