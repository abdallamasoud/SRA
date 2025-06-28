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
    // Mock login for testing when backend is not available
    console.log('Attempting to login with:', { email, password });
    
    // Simulate API call delay
    return new Observable(observer => {
      setTimeout(() => {
        // Simulate successful login
        const mockResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          roles: ['User'],
          email: email
        };
        
        const user: User = {
          email: mockResponse.email,
          token: mockResponse.token,
          roles: mockResponse.roles
        };
        
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        observer.next(user);
        observer.complete();
      }, 1000);
    });

    // Uncomment the following code when backend is available
    /*
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
    */
  }

  register(user: any): Observable<User> {
    // Mock registration for testing when backend is not available
    console.log('Attempting to register user:', user);
    
    // Simulate API call delay
    return new Observable(observer => {
      setTimeout(() => {
        // Simulate successful registration
        const mockResponse = {
          token: 'mock-jwt-token-' + Date.now(),
          roles: ['User'],
          email: user.email
        };
        
        const newUser: User = {
          email: mockResponse.email,
          token: mockResponse.token,
          roles: mockResponse.roles
        };
        
        localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));
        observer.next(newUser);
        observer.complete();
      }, 1000);
    });

    // Uncomment the following code when backend is available
    /*
    const requestBody = {
      userName: user.userName,
      name: user.name,
      email: user.email,
      password: user.password,
      farmName: user.farmName,
      role: user.role
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
        let errorMessage = 'Registration failed. Please try again.';
        
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.status === 400) {
          errorMessage = 'Invalid registration data. Please check your information.';
        } else if (err.status === 409) {
          errorMessage = 'User already exists with this email or username.';
        } else if (err.status === 0) {
          errorMessage = 'Cannot connect to server. Please check your internet connection.';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
    */
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forget-password`, { email }).pipe(
      catchError(error => {
        console.error('Forgot password error', error);
        return throwError(() => new Error('Failed to send reset email'));
      })
    );
  }

  resetPassword(userId: string, code: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      userId,
      code,
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
