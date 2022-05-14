import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { User } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _users$: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);
  private _users: User[] = [];

  private _sequence: number = 0;

  public get users$(): Observable<User[]> {
    return this._users$.asObservable();
  }

  public set users(_: User[]) {
    this._users = _;
    this._users$.next(this._users);
    localStorage.setItem('users', JSON.stringify(this._users));
  }

  public get users(): User[] {
    return this._users;
  }

  constructor() {
    this.load();
  }

  public register(user: { email: string; password: string }): boolean {
    if (
      !user.email ||
      !user.password ||
      this.users.find((u) => u.email === user.email)
    ) {
      return false;
    }
    this._sequence = this._sequence === -Infinity ? 1 : this._sequence + 1;
    this.users = [...this._users, { ...user, id: this._sequence }];
    return true;
  }

  private load(): void {
    this._users = JSON.parse(localStorage.getItem('users') ?? '[]');
    this._users$.next(this._users);
    this._sequence = Math.max(...this._users.map((i) => i.id));
  }
}
