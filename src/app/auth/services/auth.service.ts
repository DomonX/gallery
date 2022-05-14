import { Injectable } from '@angular/core';
import { map, Observable, ReplaySubject, take } from 'rxjs';
import { User } from '../models/auth.models';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _loggedUser: User | undefined = undefined;

  private _loggedUser$: ReplaySubject<User | undefined> = new ReplaySubject<
    User | undefined
  >(1);

  public get loggedUser(): User | undefined {
    return this._loggedUser;
  }

  private set loggedUser(_: User | undefined) {
    this._loggedUser = _;
    this._loggedUser$.next(_);
    if (_) {
      localStorage.setItem('loggedUser', JSON.stringify(_));
    } else {
      localStorage.removeItem('loggedUser');
    }
  }

  public get loggedUser$(): Observable<User | undefined> {
    return this._loggedUser$.asObservable();
  }

  constructor(private userService: UserService) {
    this.load();
  }

  public getLoggedUser(): Observable<User | undefined> {
    return this._loggedUser$;
  }

  public login(email: string, password: string): boolean {
    const users = this.userService.users;

    this.loggedUser = users.find(
      (user) => user.email === email && user.password === password
    );

    return !!this.loggedUser;
  }

  public logout(): void {
    this.loggedUser = undefined;
  }

  private load(): void {
    this.loggedUser = JSON.parse(localStorage.getItem('loggedUser') ?? 'null');
  }
}
