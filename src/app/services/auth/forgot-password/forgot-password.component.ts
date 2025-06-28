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
      this.successMessage = response?.message || 'Password reset instructions have been sent to your email.';
      
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
      
      // تحسين رسائل الخطأ
      let errorMsg = 'Failed to process your request. Please try again later.';
      
      if (error.message) {
        errorMsg = error.message;
      } else if (error.error?.message) {
        errorMsg = error.error.message;
      } else if (error.status === 404) {
        // فقط إذا كان الإيميل بصيغة صحيحة لكن غير موجود في قاعدة البيانات
        errorMsg = 'Not found';
      } else if (error.status === 0) {
        errorMsg = 'Cannot connect to server. Please check your internet connection.';
      }
      
      this.errorMessage = errorMsg;
      this.isLoading = false;
    }
  });
} 