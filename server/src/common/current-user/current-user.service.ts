import { Injectable } from '@nestjs/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthUser } from '../../security/auth-user';

@Injectable()
export class CurrentUserService {
  private _currentUser$: BehaviorSubject<AuthUser> = new BehaviorSubject<AuthUser>(null);

  get currentUser$(): Observable<AuthUser> {
    return this._currentUser$.asObservable();
  }

  get currentUser(): AuthUser {
    return this._currentUser$.getValue();
  }

  setCurrentUser(user: AuthUser | null): void {
    this._currentUser$.next(user);
  }
}
