import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.forgotPasswordForm.controls).forEach(key => {
        const control = this.forgotPasswordForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { email } = this.forgotPasswordForm.value;

    console.log('Sending forgot password request:', { email });

    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        console.log('Forgot password success:', response);
        this.isLoading = false;
        
        // استخدام رسالة النجاح من الباك إند أو رسالة افتراضية
        this.successMessage = response?.message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني';
        
        // Reset the form
        this.forgotPasswordForm.reset();
      },
      error: (error) => {
        console.error('Forgot password error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        
        // للأمان: نعرض رسالة نجاح حتى للأخطاء (إلا مشاكل الاتصال)
        let message = 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني';
        let isError = false;
        
        if (error.status === 0) {
          message = 'لا يمكن الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت.';
          isError = true;
        } else if (error.status === 400) {
          message = 'صيغة البريد الإلكتروني غير صحيحة';
          isError = true;
        }
        
        if (isError) {
          this.errorMessage = message;
        } else {
          this.successMessage = message;
        }
        
        this.isLoading = false;
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
