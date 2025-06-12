import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngredientService } from '../../../services/ingredient.service';

@Component({
  selector: 'app-add-ingredient-modal',
  template: `
    <div class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h2>Add New Ingredient</h2>
          <button class="close-btn" (click)="closeModal()">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <form [formGroup]="ingredientForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Name</label>
                <input
                  type="text"
                  id="name"
                  formControlName="name"
                  placeholder="Enter ingredient name"
                >
                <div class="error-message" *ngIf="ingredientForm.get('name')?.invalid && ingredientForm.get('name')?.touched">
                  Name is required
                </div>
              </div>

              <div class="form-group">
                <label for="type">Type</label>
                <select
                  id="type"
                  formControlName="type"
                  class="scrollable-select"
                  size="4"
                >
                  <option *ngFor="let type of ingredientTypes" [value]="type.id">{{ type.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="unit">Unit</label>
                <select
                  id="unit"
                  formControlName="unit"
                  class="scrollable-select"
                  size="4"
                >
                  <option *ngFor="let unit of unitTypes" [value]="unit.id">{{ unit.name }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cp">Crude Protein (%)</label>
                <input
                  type="number"
                  id="cp"
                  formControlName="cp"
                  placeholder="Enter CP percentage"
                  step="0.1"
                >
                <div class="error-message" *ngIf="ingredientForm.get('cp')?.invalid && ingredientForm.get('cp')?.touched">
                  CP must be between 0 and 100
                </div>
              </div>

              <div class="form-group">
                <label for="tdn">TDN (%)</label>
                <input
                  type="number"
                  id="tdn"
                  formControlName="tdn"
                  placeholder="Enter TDN percentage"
                  step="0.1"
                >
                <div class="error-message" *ngIf="ingredientForm.get('tdn')?.invalid && ingredientForm.get('tdn')?.touched">
                  TDN must be between 0 and 100
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="cf">Crude Fiber (%)</label>
                <input
                  type="number"
                  id="cf"
                  formControlName="cf"
                  placeholder="Enter CF percentage"
                  step="0.1"
                >
                <div class="error-message" *ngIf="ingredientForm.get('cf')?.invalid && ingredientForm.get('cf')?.touched">
                  CF must be between 0 and 100
                </div>
              </div>

              <div class="form-group">
                <label for="me">Metabolizable Energy (MJ/kg)</label>
                <input
                  type="number"
                  id="me"
                  formControlName="me"
                  placeholder="Enter ME value"
                  step="0.1"
                >
                <div class="error-message" *ngIf="ingredientForm.get('me')?.invalid && ingredientForm.get('me')?.touched">
                  ME must be a positive number
                </div>
              </div>
            </div>

            <div class="error-message main-error" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="closeModal()">Cancel</button>
              <button type="submit" class="submit-btn" [disabled]="isLoading">
                <i class="fas fa-spinner fa-spin" *ngIf="isLoading"></i>
                {{ isLoading ? 'Saving...' : 'Save Ingredient' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      color: #666;
    }

    .modal-body {
      padding: 20px;
    }

    .form-row {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .form-group {
      flex: 1;
      margin-bottom: 20px;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    input, select, textarea {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .scrollable-select {
      height: auto;
      overflow-y: auto;
      background-color: white;
      max-height: 160px; /* Approximately 4 items */
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .scrollable-select option {
      padding: 8px 12px;
      cursor: pointer;
    }

    .scrollable-select option:hover,
    .scrollable-select option:focus {
      background-color: #f5f5f5;
    }

    .error-message {
      color: #ff5252;
      font-size: 12px;
      margin-top: 5px;
    }

    .main-error {
      margin: 15px 0;
      padding: 10px;
      background-color: rgba(255, 82, 82, 0.1);
      border-radius: 4px;
      text-align: center;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 20px;
    }

    .cancel-btn {
      background-color: #f5f5f5;
      color: #333;
      border: none;
      border-radius: 4px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
    }

    .submit-btn {
      background-color: #8bc34a;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class AddIngredientModalComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();

  ingredientForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  // Type mapping
  ingredientTypes = [
    { id: 0, name: 'Grain' },
    { id: 1, name: 'Protein Source' },
    { id: 2, name: 'Forage' },
    { id: 3, name: 'Mineral' },
    { id: 4, name: 'Vitamin' },
    { id: 5, name: 'Additive' },
    { id: 6, name: 'Other' }
  ];

  // Unit mapping
  unitTypes = [
    { id: 0, name: 'kg' },
    { id: 1, name: 'g' },
    { id: 2, name: 'lb' },
    { id: 3, name: 'oz' },
    { id: 4, name: 'ton' }
  ];

  constructor(
    private fb: FormBuilder,
    private ingredientService: IngredientService
  ) {
    this.ingredientForm = this.fb.group({
      name: ['', [Validators.required]],
      type: [0, [Validators.required]],
      unit: [0, [Validators.required]],
      cp: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      tdn: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      cf: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      me: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    if (this.ingredientForm.invalid) {
      this.markFormGroupTouched(this.ingredientForm);
      return;
    }

    this.isLoading = true;
    this.ingredientService.createIngredient(this.ingredientForm.value).subscribe(
      (response) => {
        this.isLoading = false;
        this.closeModal(true);
      },
      (error) => {
        console.error('Error creating ingredient', error);
        this.errorMessage = 'Failed to create ingredient. Please try again.';
        this.isLoading = false;
      }
    );
  }

  closeModal(success = false): void {
    this.close.emit(success);
  }

  // Helper method to mark all controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
