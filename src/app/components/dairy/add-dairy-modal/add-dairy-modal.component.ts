import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DairyService, Dairy } from '../../../services/dairy.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-dairy-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-dairy-modal.component.html',
  styleUrls: ['./add-dairy-modal.component.css']
})
export class AddDairyModalComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();

  dairyForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  // Sample data for dropdowns
  animalTypes = ['Cow', 'Buffalo', 'Goat'];

  constructor(private fb: FormBuilder, private dairyService: DairyService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.dairyForm = this.fb.group({
      code: ['', Validators.required],
      animalType: ['Cow', Validators.required],
      noFamily: ['', Validators.required],
      weight: [null, [Validators.required, Validators.min(0)]],
      weightDate: [today, Validators.required],
      dateFertilization: [today, Validators.required],
      expectedDate: ['', Validators.required]
    });

    // Calculate expected date (9 months after fertilization for cows)
    this.dairyForm.get('dateFertilization')?.valueChanges.subscribe(date => {
      if (date) {
        const fertilizationDate = new Date(date);
        const expectedDate = new Date(fertilizationDate);
        expectedDate.setMonth(expectedDate.getMonth() + 9); // 9 months gestation for cows
        this.dairyForm.get('expectedDate')?.setValue(expectedDate.toISOString().split('T')[0]);
      }
    });
  }

  onSubmit(): void {
    if (this.dairyForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.dairyForm.controls).forEach(key => {
        const control = this.dairyForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const newDairy: Dairy = {
      ...this.dairyForm.value,
      milk: [] // Initialize with empty milk records
    };

    this.dairyService.createDairy(newDairy).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit(true); // Refresh the list
      },
      error: (error) => {
        console.error('Error creating dairy animal', error);
        this.errorMessage = 'Failed to create dairy animal. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit(false); // Don't refresh the list
  }
}
