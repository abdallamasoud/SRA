import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnimalService, Animal } from '../../../services/animal.service';

@Component({
  selector: 'app-edit-animal-modal',
  templateUrl: './edit-animal-modal.component.html',
  styleUrls: ['./edit-animal-modal.component.css']
})
export class EditAnimalModalComponent implements OnInit, OnChanges {
  @Input() animal: Animal | null = null;
  @Output() close = new EventEmitter<boolean>();

  animalForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  // Sample data for dropdowns
  animalTypes = ['Dairy', 'Drying'];

  constructor(private fb: FormBuilder, private animalService: AnimalService) { }

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['animal'] && this.animal) {
      this.updateForm();
    }
  }

  initForm(): void {
    this.animalForm = this.fb.group({
      id: [null],
      code: ['', Validators.required],
      herdNumber: ['', Validators.required],
      animalType: ['Dairy', Validators.required],
      weight: [null, [Validators.required, Validators.min(0)]],
      weightDate: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      healthcareNote: [''],
      takenVaccinations: [''],
      madeArtificialInsemination: [false, Validators.required],
      dateOfArtificialInsemination: [null],
      statueOfInsemination: ['Pregnant', Validators.required],
      expectedDateOfCalving: [null]
    });

    // Add conditional validation for dateOfArtificialInsemination
    this.animalForm.get('madeArtificialInsemination')?.valueChanges.subscribe(value => {
      if (value === true) {
        this.animalForm.get('dateOfArtificialInsemination')?.setValidators(Validators.required);
      } else {
        this.animalForm.get('dateOfArtificialInsemination')?.clearValidators();
      }
      this.animalForm.get('dateOfArtificialInsemination')?.updateValueAndValidity();
    });

    if (this.animal) {
      this.updateForm();
    }
  }

  updateForm(): void {
    if (this.animal) {
      const weightDate = this.animal.weightDate ? new Date(this.animal.weightDate).toISOString().split('T')[0] : null;


      this.animalForm.patchValue({
        id: this.animal.id,
        code: this.animal.code,
        herdNumber: this.animal.noFamily,
        animalType: this.animal.animalType,
        weight: this.animal.weight,
        weightDate: weightDate,

        healthcareNote: this.animal.description,


      });
    }
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

    this.animalService.updateAnimal(this.animalForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit(true); // Refresh the list
      },
      error: (error) => {
        console.error('Error updating animal', error);
        this.errorMessage = 'Failed to update animal. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit(false); // Don't refresh the list
  }
}
