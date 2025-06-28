import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
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
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      farmName: ['', Validators.required],
      role: [null, Validators.required] // 0 = Owner, 1 = Engineer, 2 = Farmer
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  testClick() {
  console.log('Any click inside the form');
}

  onSubmit(): void {
    console.log('Form submitted');
    console.log('Form values:', this.registerForm.value);
    console.log('Form valid:', this.registerForm.valid);

    if (this.registerForm.invalid) {
      console.warn('Form is invalid', this.registerForm.value);
      console.log('Form errors:', this.registerForm.errors);
      Object.keys(this.registerForm.controls).forEach(field => {
        const control = this.registerForm.get(field);
        console.log(`${field} errors:`, control?.errors);
        control?.markAsTouched();
      });
      return;
    }

    const formValues = this.registerForm.value;
    const newUser = {
      userName: formValues.userName,
      name: formValues.name,
      email: formValues.email,
      password: formValues.password,
      farmName: formValues.farmName,
      role: Number(formValues.role) // تأكد إنه رقم
    };

    console.log('Sending new user data:', newUser);

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(newUser).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Registration error details:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error response:', error.error);
        this.errorMessage = error.error?.message || error.message || 'Registration failed. Try again.';
        this.isLoading = false;
      }
    });
  }
}
