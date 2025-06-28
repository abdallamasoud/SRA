import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { TokenUtils } from '../../../shared/utils/token-utils';

@Component({
  selector: 'app-restpassword',
  templateUrl: './restpassword.component.html',
  styleUrls: ['./restpassword.component.css']
})
export class RestpasswordComponent implements OnInit {
  restPasswordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  token: string = '';
  userId: string = '';
  code: string = '';

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
      console.log('Rest Password - Query Params:', params);
      TokenUtils.logTokenInfo(this.code, 'Rest Password - Original Code');
      
      if (!this.userId || !this.code) {
        this.errorMessage = 'Invalid or missing reset token. Please request a new password reset link.';
        console.log('Rest Password - Missing userId or code');
      } else {
        // تنظيف ومعالجة التوكين
        this.code = TokenUtils.cleanAndDecodeToken(this.code);
        TokenUtils.logTokenInfo(this.code, 'Rest Password - Cleaned Code');
        
        // التحقق من صحة التوكين
        if (!TokenUtils.isValidToken(this.code)) {
          this.errorMessage = 'Invalid reset token format. Please request a new password reset link.';
          console.log('Rest Password - Invalid token format');
        } else {
          console.log('Rest Password - Token is valid, ready for reset');
        }
      }
    });
    this.initForm();
  }

  initForm(): void {
    this.restPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  passwordsMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.restPasswordForm.invalid) {
      Object.keys(this.restPasswordForm.controls).forEach(key => {
        const control = this.restPasswordForm.get(key);
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

    const { newPassword } = this.restPasswordForm.value;

    // Debug: طباعة البيانات المرسلة للباك إند
    console.log('Sending rest password request:', {
      userId: this.userId,
      codeLength: this.code.length,
      passwordLength: newPassword.length
    });

    this.authService.resetPassword(this.code, newPassword, this.userId).subscribe({
      next: (response) => {
        console.log('Rest password success:', response);
        this.isLoading = false;
        
        // استخدام رسالة النجاح من الباك إند أو رسالة افتراضية
        this.successMessage = response || 'Your password has been reset successfully!';
        
        this.restPasswordForm.reset();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Rest password error:', error);
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

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
} 