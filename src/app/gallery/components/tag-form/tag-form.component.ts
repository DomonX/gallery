import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  ReplaySubject,
  startWith,
  tap,
} from 'rxjs';
import { GalleryService } from '../../services/gallery.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss'],
})
export class TagFormComponent implements OnInit {
  @Input() public value = [];

  @ViewChild('manualInput') public input!: ElementRef<HTMLInputElement>;

  public tags$: Observable<string[]> = this.galleryService.getTags();
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public currentTags: string[] = [];
  public tagControl: FormControl = new FormControl();
  public filteredTags$: Observable<string[]>;

  private currentTagsChanges$: BehaviorSubject<void> =
    new BehaviorSubject<void>(undefined);

  constructor(
    private galleryService: GalleryService,
    private snack: MatSnackBar,
    private dialog: MatDialogRef<TagFormComponent>
  ) {
    this.filteredTags$ = combineLatest([
      this.tagControl.valueChanges.pipe(startWith('')),
      this.tags$,
      this.currentTagsChanges$,
    ]).pipe(
      map(([value, tags]) =>
        tags.filter(
          (tag) =>
            (!value ||
              tag.toLowerCase().includes(value.trim().toLowerCase())) &&
            !this.currentTags.includes(tag)
        )
      )
    );
  }

  ngOnInit(): void {}

  public addTag(tag: string): void {
    if (tag.length > 20) {
      this.snack.open('Nazwa taga nie moze być dłuższa niż 20', 'Close', {
        duration: 3000,
      });
      return;
    }
    this.currentTags.push(tag);
    this.input.nativeElement.value = '';
    this.tagControl.setValue('');
  }

  public removeTag(tag: string): void {
    this.currentTags = this.currentTags.filter((i) => i !== tag);
    this.currentTagsChanges$.next();
  }
}
