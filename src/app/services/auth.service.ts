import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TokenUtils } from '../shared/utils/token-utils';

export interface User {
  email: string;
  token?: string;
  roles?: string[];
  userName?: string;
  name?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // جرب هذه الـ URLs إذا لم يعمل الحالي:
  // private apiUrl = 'http://localhost:5000/api/Accounts';
  // private apiUrl = 'https://localhost:44300/api/Accounts';
  // private apiUrl = 'http://localhost:3000/api/Accounts';
  private apiUrl = 'https://localhost:7174/api/Accounts';
  private currentUserKey = 'currentUser';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    console.log('AuthService - Login Request:', { email });
    
    return this.http.post<{ token: string; roles: string[]; email: string }>(
      `${this.apiUrl}/Login`,
      { email, password }
    ).pipe(
      map(response => {
        console.log('AuthService - Login Success:', response);
        
        // استخدام TokenUtils لمعالجة التوكين القادم من الباك إند
        TokenUtils.logTokenInfo(response.token, 'AuthService - Login Token from Backend');
        
        const user: User = {
          email: response.email,
          token: response.token,
          roles: response.roles
        };
        
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
        return user;
      }),
      catchError(error => {
        console.error('AuthService - Login error:', error);
        console.error('Error response:', error.error);
        
        let errorMessage = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.status === 404) {
          errorMessage = 'البريد الإلكتروني غير مسجل في النظام';
        } else if (error.status === 401) {
          errorMessage = 'كلمة المرور غير صحيحة';
        } else if (error.status === 400) {
          errorMessage = 'بيانات غير صحيحة';
        } else if (error.status === 0) {
          errorMessage = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  register(user: any): Observable<User> {
    console.log('AuthService - Register Request:', user);
    
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
        console.log('AuthService - Register Success:', response);
        
        // استخدام TokenUtils لمعالجة التوكين القادم من الباك إند
        TokenUtils.logTokenInfo(response.token, 'AuthService - Register Token from Backend');
        
        const newUser: User = {
          email: response.email,
          token: response.token,
          roles: response.roles
        };
        
        localStorage.setItem(this.currentUserKey, JSON.stringify(newUser));
        return newUser;
      }),
      catchError(err => {
        console.error('AuthService - Registration error:', err);
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
  }

  forgotPassword(email: string): Observable<any> {
    console.log('AuthService - Forgot Password Request:', { email });
    
    // محاولة endpoints مختلفة - الأكثر شيوعاً
    const endpoints = [
      `${this.apiUrl}/forgot-password`,  // الأكثر شيوعاً
      `${this.apiUrl}/forget-password`,  // بديل شائع
      `${this.apiUrl}/ForgotPassword`,   // الحالي
      `${this.apiUrl}/forgotpassword`    // بدون شرطة
    ];
    
    console.log('AuthService - Trying endpoints:', endpoints);
    console.log('AuthService - Using endpoint:', `${this.apiUrl}/forgot-password`);
    console.log('AuthService - Request Body:', { email });
    
    // جرب الـ endpoint الأكثر شيوعاً أولاً
    return this.http.post(`${this.apiUrl}/forget-password`, { email }).pipe(
      map(response => {
        console.log('AuthService - Forgot Password Success:', response);
        console.log('AuthService - Response Type:', typeof response);
        console.log('AuthService - Response Keys:', Object.keys(response || {}));
        return response;
      }),
      catchError(error => {
        console.error('AuthService - Forgot Password error:', error);
        console.error('AuthService - Error Status:', error.status);
        console.error('AuthService - Error Status Text:', error.statusText);
        console.error('AuthService - Error URL:', error.url);
        console.error('AuthService - Error Name:', error.name);
        console.error('AuthService - Error Message:', error.message);
        console.error('AuthService - Error Error:', error.error);
        console.error('AuthService - Error Error Type:', typeof error.error);
        
        // للأمان: دائماً نعرض رسالة نجاح حتى لو كان البريد غير موجود
        // هذا يمنع المهاجمين من معرفة أي بريد إلكتروني مسجل في النظام
        let errorMessage = 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني';
        
        // إذا كان هناك خطأ في الاتصال، نعرض رسالة خطأ
        if (error.status === 0) {
          errorMessage = 'لا يمكن الاتصال بالخادم. يرجى المحاولة مرة أخرى.';
          console.log('AuthService - Network error, showing connection error');
        } else if (error.status === 400) {
          errorMessage = 'صيغة البريد الإلكتروني غير صحيحة';
          console.log('AuthService - Bad request, showing format error');
        } else {
          // لأي خطأ آخر، نعرض رسالة نجاح عامة للأمان
          console.log('AuthService - Other error, showing generic success for security');
        }
        
        console.log('AuthService - Final Message:', errorMessage);
        
        // نرجع رسالة نجاح بدلاً من خطأ للأمان
        return new Observable(observer => {
          observer.next({ 
            success: true, 
            message: errorMessage 
          });
          observer.complete();
        });
      })
    );
  }

  resetPassword(token: string, newPassword: string, userId?: string): Observable<any> {
    console.log('AuthService - Reset Password Request:', { 
      token: token.substring(0, 10) + '...',
      userId: userId || 'not provided'
    });
    
    // استخدام TokenUtils لمعالجة التوكين
    TokenUtils.logTokenInfo(token, 'AuthService - Original Token');
    
    // تنظيف ومعالجة التوكين للباك إند
    const processedToken = TokenUtils.processTokenForBackend(token);
    TokenUtils.logTokenInfo(processedToken, 'AuthService - Processed Token');
    
    // التحقق من صحة التوكين
    if (!TokenUtils.isValidToken(processedToken)) {
      console.error('AuthService - Invalid token format');
      return throwError(() => new Error('Invalid token'));
    }
    
    const requestBody: any = {
      code: processedToken,  // استخدام التوكين المعالج
      newPassword: newPassword,
      password: newPassword
    };
    
    if (userId) {
      requestBody.userId = userId;
    }
    
    console.log('AuthService - Request Body:', requestBody);
    
    return this.http.post(`${this.apiUrl}/reset-password`, requestBody, { 
      responseType: 'text' 
    }).pipe(
      map(response => {
        console.log('AuthService - Reset Password Success:', response);
        return response;
      }),
      catchError(error => {
        console.error('AuthService - Reset Password error:', error);
        console.error('AuthService - Error details:', error.error);
        let errorMessage = 'فشل في إعادة تعيين كلمة المرور';
        
        if (error.error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.errors && Array.isArray(error.error.errors)) {
          // معالجة أخطاء Validation
          const validationErrors = error.error.errors;
          if (validationErrors.includes('The Code field is required.')) {
            errorMessage = 'Invalid token';
          } else if (validationErrors.some((err: string) => err.toLowerCase().includes('token'))) {
            errorMessage = 'Invalid token';
          } else if (validationErrors.some((err: string) => err.toLowerCase().includes('code'))) {
            errorMessage = 'Invalid token';
          } else {
            errorMessage = validationErrors.join(', ');
          }
        } else if (error.status === 400) {
          errorMessage = 'Invalid token';
        } else if (error.status === 401) {
          errorMessage = 'Invalid token';
        } else if (error.status === 404) {
          errorMessage = 'Invalid token';
        } else if (error.status === 0) {
          errorMessage = 'لا يمكن الاتصال بالخادم';
        }
        
        return throwError(() => new Error(errorMessage));
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
    const user = this.getCurrentUser();
    if (!user?.token) {
      return null;
    }
    
    // استخدام TokenUtils لمعالجة التوكين من localStorage
    TokenUtils.logTokenInfo(user.token, 'AuthService - Token from localStorage');
    
    // تنظيف ومعالجة التوكين للاستخدام
    const processedToken = TokenUtils.cleanAndDecodeToken(user.token);
    TokenUtils.logTokenInfo(processedToken, 'AuthService - Processed Token for Frontend');
    
    // التحقق من صحة التوكين
    if (!TokenUtils.isValidToken(processedToken)) {
      console.error('AuthService - Invalid token in localStorage, logging out');
      this.logout();
      return null;
    }
    
    return processedToken;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
