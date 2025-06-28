import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    console.log('Sending login request:', { email });

    this.authService.login(email, password).subscribe({
      next: user => {
        console.log('Login success:', user);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: error => {
        console.error('Login error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        
        // تحسين رسائل الخطأ
        let errorMsg = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
        
        if (error.message) {
          errorMsg = error.message;
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.status === 404) {
          errorMsg = 'البريد الإلكتروني غير مسجل في النظام';
        } else if (error.status === 401) {
          errorMsg = 'كلمة المرور غير صحيحة';
        } else if (error.status === 400) {
          errorMsg = 'بيانات غير صحيحة';
        } else if (error.status === 0) {
          errorMsg = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
        }
        
        this.errorMessage = errorMsg;
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
