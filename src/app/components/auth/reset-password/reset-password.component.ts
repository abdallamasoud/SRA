import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenUtils } from '../../../shared/utils/token-utils';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  userId: string = '';
  code: string = '';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userId = params['userId'] || '';
      this.code = params['code'] || '';
      
      // Debug: طباعة معلومات التوكين للتشخيص
      console.log('Reset Password - Query Params:', params);
      TokenUtils.logTokenInfo(this.code, 'Reset Password - Original Code');
      
      if (!this.userId || !this.code) {
        this.errorMessage = 'Invalid or missing reset token. Please request a new password reset link.';
        console.log('Reset Password - Missing userId or code');
      } else {
        // تنظيف ومعالجة التوكين
        this.code = TokenUtils.cleanAndDecodeToken(this.code);
        TokenUtils.logTokenInfo(this.code, 'Reset Password - Cleaned Code');
        
        // التحقق من صحة التوكين
        if (!TokenUtils.isValidToken(this.code)) {
          this.errorMessage = 'Invalid reset token format. Please request a new password reset link.';
          console.log('Reset Password - Invalid token format');
        } else {
          console.log('Reset Password - Token is valid, ready for reset');
        }
      }
    });

    this.initForm();
  }

  initForm(): void {
    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetPasswordForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.resetPasswordForm.controls).forEach(key => {
        const control = this.resetPasswordForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    if (!this.userId || !this.code) {
      this.errorMessage = 'Invalid or missing reset token. Please request a new password reset link.';
      return;
    }

    if (!TokenUtils.isValidToken(this.code)) {
      this.errorMessage = 'Invalid reset token format. Please request a new password reset link.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { password } = this.resetPasswordForm.value;

    // Debug: طباعة البيانات المرسلة للباك إند
    console.log('Sending reset password request:', {
      userId: this.userId,
      codeLength: this.code.length,
      passwordLength: password.length
    });

    this.authService.resetPassword(this.code, password, this.userId).subscribe({
      next: (response) => {
        console.log('Reset password success:', response);
        this.isLoading = false;
        
        // استخدام رسالة النجاح من الباك إند أو رسالة افتراضية
        this.successMessage = response || 'Your password has been reset successfully.';
        
        // Reset the form
        this.resetPasswordForm.reset();

        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Reset password error:', error);
        console.error('Error details:', {
          status: error.status,
          statusText: error.statusText,
          error: error.error,
          message: error.message
        });
        
        // تحسين رسائل الخطأ
        let errorMsg = 'Failed to reset password. Please try again later.';
        
        if (error.message) {
          errorMsg = error.message;
        } else if (error.error && typeof error.error === 'string') {
          errorMsg = error.error;
        } else if (error.error?.message) {
          errorMsg = error.error.message;
        } else if (error.error?.errors && Array.isArray(error.error.errors)) {
          // معالجة أخطاء Validation
          const validationErrors = error.error.errors;
          if (validationErrors.includes('The Code field is required.')) {
            errorMsg = 'Invalid token';
          } else if (validationErrors.some((err: string) => err.toLowerCase().includes('token'))) {
            errorMsg = 'Invalid token';
          } else if (validationErrors.some((err: string) => err.toLowerCase().includes('code'))) {
            errorMsg = 'Invalid token';
          } else {
            errorMsg = validationErrors.join(', ');
          }
        } else if (error.status === 400) {
          errorMsg = 'Invalid token';
        } else if (error.status === 401) {
          errorMsg = 'Invalid token';
        } else if (error.status === 404) {
          errorMsg = 'Invalid token';
        } else if (error.status === 0) {
          errorMsg = 'Cannot connect to server. Please check your internet connection.';
        }
        
        this.errorMessage = errorMsg;
        this.isLoading = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
