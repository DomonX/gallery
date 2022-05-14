import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { User } from 'src/app/auth/models/auth.models';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  public loggedUser$: Observable<User | undefined>;

  constructor(private authService: AuthService, private router: Router) {
    this.loggedUser$ = this.authService.loggedUser$;
  }

  public ngOnInit(): void {}

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
