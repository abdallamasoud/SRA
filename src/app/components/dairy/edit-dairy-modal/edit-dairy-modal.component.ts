import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DairyService, Dairy } from '../../../services/dairy.service';

@Component({
  selector: 'app-edit-dairy-modal',
  templateUrl: './edit-dairy-modal.component.html',
  styleUrls: ['./edit-dairy-modal.component.css']
})
export class EditDairyModalComponent implements OnInit, OnChanges {
  @Input() dairy: Dairy | null = null;
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dairy'] && this.dairy) {
      this.updateForm();
    }
  }

  initForm(): void {
    this.dairyForm = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      animalType: ['', Validators.required],
      noFamily: ['', Validators.required],
      weight: [null, [Validators.required, Validators.min(0)]],
      weightDate: ['', Validators.required],
      dateFertilization: ['', Validators.required],
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

    if (this.dairy) {
      this.updateForm();
    }
  }

  updateForm(): void {
    if (this.dairy) {
      // Format the dates to YYYY-MM-DD for the date inputs
      const weightDate = this.dairy.weightDate ?
        new Date(this.dairy.weightDate).toISOString().split('T')[0] :
        new Date().toISOString().split('T')[0];

      const dateFertilization = this.dairy.dateFertilization ?
        new Date(this.dairy.dateFertilization).toISOString().split('T')[0] :
        new Date().toISOString().split('T')[0];

      const expectedDate = this.dairy.expectedDate ?
        new Date(this.dairy.expectedDate).toISOString().split('T')[0] :
        '';

      this.dairyForm.patchValue({
        id: this.dairy.id,
        code: this.dairy.code,
        animalType: this.dairy.animalType,
        noFamily: this.dairy.noFamily,
        weight: this.dairy.weight,
        weightDate: weightDate,
        dateFertilization: dateFertilization,
        expectedDate: expectedDate
      });
    }
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

    // Preserve the milk records from the original dairy object
    const updatedDairy: Dairy = {
      ...this.dairyForm.value,
      milk: this.dairy?.milk || []
    };

    this.dairyService.updateDairy(updatedDairy).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit(true); // Refresh the list
      },
      error: (error) => {
        console.error('Error updating dairy animal', error);
        this.errorMessage = 'Failed to update dairy animal. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit(false); // Don't refresh the list
  }
}
