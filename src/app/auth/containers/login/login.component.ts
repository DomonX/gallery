import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public form: FormGroup;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  public ngOnInit(): void {}

  public login(): void {
    if (!this.form.valid) {
      return;
    }
    const res = this.authService.login(
      this.form.value.email,
      this.form.value.password
    );

    if (res) {
      this.router.navigate(['/']);
    } else {
      this.snack.open('Błędne dane logowania', '', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }
  }

  public register(): void {
    if (!this.form.valid) {
      return;
    }
    const res = this.userService.register(this.form.value);
    if (res) {
      this.snack.open('Zarejestrowano', '', {
        duration: 2000,
        verticalPosition: 'top',
      });
    } else {
      this.snack.open('Użytkownik już istnieje', '', {
        duration: 2000,
        verticalPosition: 'top',
      });
    }
  }
}
