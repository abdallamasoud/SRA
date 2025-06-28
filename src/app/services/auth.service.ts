import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface User {
  email: string;
  token?: string;
  roles?: string[];
  userName?: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://localhost:7174/api/Accounts';
  private currentUserKey = 'currentUser';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<{ token: string; roles: string[]; email: string }>(
      `${this.apiUrl}/Login`,
      { email, password }
    ).pipe(
      map(response => {
        const user: User = {
          email: response.email,
          token: response.token,
          roles: response.roles
        };
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        return user;
      }),
      catchError(err => {
        console.error('Login failed', err);
        return throwError(() => new Error('Invalid credentials'));
      })
    );
  }

  register(user: User & { password: string }): Observable<User> {
    const requestBody = {
      userName: user.userName || user.email.split('@')[0],
      name: user.name || user.userName || user.email.split('@')[0],
      email: user.email,
      password: user.password,
      roles: user.roles || ['User']
    };

    return this.http.post<{ token: string; roles: string[]; email: string }>(
      `${this.apiUrl}/Register`,
      requestBody
    ).pipe(
      map(response => {
        const newUser: User = {
          email: response.email,
          token: response.token,
          roles: response.roles
        };
        localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));
        return newUser;
      }),
      catchError(err => {
        console.error('Registration failed', err);
        return throwError(() => new Error('Registration error'));
      })
    );
  }
  forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/forget-password`, { email }).pipe(
    catchError(error => {
      console.error('Forgot password error', error);
      return throwError(() => new Error('Failed to send reset email'));
    })
  );
}

resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/reset-password`, {
    token,
    newPassword
  }).pipe(
    catchError(error => {
      console.error('Reset password error', error);
      return throwError(() => new Error('فشل في إعادة تعيين كلمة المرور'));
    })
  );
}
  logout(): void {
    localStorage.removeItem(this.currentUserKey);
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return this.getCurrentUser()?.token || null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
