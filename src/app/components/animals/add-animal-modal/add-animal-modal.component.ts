import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimalService, Animal } from '../../../services/animal.service';

@Component({
  selector: 'app-add-animal-modal',
  templateUrl: './add-animal-modal.component.html',
  styleUrls: ['./add-animal-modal.component.css']
})
export class AddAnimalModalComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() defaultAnimalType: string = '';

  animalForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  // Sample data for dropdowns
  animalTypes = ['Dairy', 'Drying'];

  constructor(
    private fb: FormBuilder,
    private animalService: AnimalService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();

    // Remove specific animal type setting based on URL, as this modal is now for Dairy only
    // If a default animal type was provided, use it (though for this modal, it should be Dairy/Drying)
    if (this.defaultAnimalType && (this.defaultAnimalType === 'Dairy' || this.defaultAnimalType === 'Drying')) {
      this.animalForm.get('animalType')?.setValue(this.defaultAnimalType);
    } else {
      // Default to Dairy if no valid default type is provided
      this.animalForm.get('animalType')?.setValue('Dairy');
    }
  }

  initForm(): void {
    this.animalForm = this.fb.group({
      code: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      animalType: ['Dairy', Validators.required],
      madeArtificialInsemination: [null, Validators.required],
      weight: [null, [Validators.required, Validators.min(0)]],
      dateOfArtificialInsemination: [null],
      weightDate: [null, Validators.required],
      statueOfInsemination: [null, Validators.required],
      herdNumber: ['', Validators.required],
      healthcareNote: ['', [Validators.required, Validators.maxLength(500)]],
      expectedDateOfCalving: [null],
      takenVaccinations: ['', Validators.required]
    });

    // Optional: Add conditional validation for dateOfArtificialInsemination
    this.animalForm.get('madeArtificialInsemination')?.valueChanges.subscribe(value => {
      if (value === 'Yes') {
        this.animalForm.get('dateOfArtificialInsemination')?.setValidators(Validators.required);
      } else {
        this.animalForm.get('dateOfArtificialInsemination')?.clearValidators();
      }
      this.animalForm.get('dateOfArtificialInsemination')?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.animalForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.animalForm.controls).forEach(key => {
        const control = this.animalForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const newAnimal: Animal = {
      id: 0, // Will be assigned by the server
      ...this.animalForm.value
    };

    this.animalService.createAnimal(newAnimal).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit(true); // Refresh the list
      },
      error: (error) => {
        console.error('Error creating animal', error);
        this.errorMessage = 'Failed to create animal. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit(false); // Don't refresh the list
  }
}
