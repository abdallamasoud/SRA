import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FeedService, Ingredient, Category } from '../../../services/feed.service';
import { CustomDropdownComponent } from '../../../shared/custom-dropdown/custom-dropdown.component';

@Component({
  selector: 'app-add-feed-modal',
  templateUrl: './add-feed-modal.component.html',
  styleUrls: ['./add-feed-modal.component.css']
})
export class AddFeedModalComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @ViewChild('ingredientPriceInput') ingredientPriceInput!: ElementRef;
  @ViewChild('ingredientDropdown') ingredientDropdown!: CustomDropdownComponent;

  feedForm!: FormGroup;
  ingredients: Ingredient[] = [];
  categories: Category[] = [];
  selectedIngredientId: number | null = null;
  isLoading = false;
  errorMessage = '';

  animalTypesOptions = [
    { id: 1, name: 'Cattle' },
    { id: 2, name: 'Poultry' },
    { id: 3, name: 'Fish' }
  ];
  feedTypesOptions = [
    { id: 1, name: 'Starter' },
    { id: 2, name: 'Grower' },
    { id: 3, name: 'Finisher' }
  ];
  seasonsOptions = [
    { id: 1, name: 'Spring' },
    { id: 2, name: 'Summer' },
    { id: 3, name: 'Autumn' },
    { id: 4, name: 'Winter' }
  ];
  ingredientTypesOptions = [
    { id: 1, name: 'Grain' },
    { id: 2, name: 'Protein Source' },
    { id: 3, name: 'Mineral' }
  ];
  genderOptions = [
    { id: 1, name: 'Male' },
    { id: 2, name: 'Female' }
  ];

  constructor(
    private fb: FormBuilder,
    private feedService: FeedService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.loadIngredients();
  }

  initForm(): void {
    this.feedForm = this.fb.group({
      feedName: ['', Validators.required],
      categoryId: [null, Validators.required],
      growthRate: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(0)]],
      gender: [null, Validators.required],
      animalTypes: [null, Validators.required],
      feedType: [null, Validators.required],
      season: [null, Validators.required],
      proteinPercentage: [''],
      tdnPercentage: [''],
      ingredientType: [null, Validators.required],
      ingredientPrice: this.fb.array([])
    });

    this.feedForm.get('ingredientType')?.valueChanges.subscribe(selectedType => {
      this.filterIngredientsByType(selectedType);
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    console.log('Loading categories...');
    this.feedService.getCategories().subscribe({
      next: (data) => {
        console.log('Categories loaded successfully:', data);
        this.categories = data;
        console.log('Categories array after assignment:', this.categories);
        console.log('Categories length:', this.categories.length);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading categories', error);
        this.errorMessage = 'Failed to load categories. Please try again.';
        this.isLoading = false;
        
        // Fallback data for categories
        this.categories = [
          { id: 2, name: 'تسمين 100 ل 250' },
          { id: 3, name: 'تسمين 250 ل 450' },
          { id: 4, name: 'حلاب اقل من 6' },
          { id: 5, name: 'حلاب من 6 ل 10' },
          { id: 6, name: 'حلاب اعلي من 10' },
          { id: 7, name: 'مواليد' }
        ];
        console.log('Using fallback categories:', this.categories);
        console.log('Fallback categories length:', this.categories.length);
      }
    });
  }

  loadIngredients(): void {
    this.isLoading = true;
    this.feedService.getIngredients().subscribe({
      next: (data) => {
        this.ingredients = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading ingredients', error);
        this.errorMessage = 'Failed to load ingredients. Please try again.';
        this.isLoading = false;

        this.ingredients = [
          { id: 1, name: 'Corn', type: 'Grain' },
          { id: 2, name: 'Wheat', type: 'Grain' },
          { id: 3, name: 'Barley', type: 'Grain' },
          { id: 4, name: 'Soybean Meal', type: 'Protein Source' },
          { id: 5, name: 'Fish Meal', type: 'Protein Source' },
          { id: 6, name: 'Vitamins', type: 'Mineral' },
          { id: 7, name: 'Minerals', type: 'Mineral' }
        ];
      }
    });
  }

  filterIngredientsByType(selectedType: number): void {
    if (!selectedType) {
      this.loadIngredients();
      return;
    }

    const typeName = this.ingredientTypesOptions.find(type => type.id === selectedType)?.name;
    if (!typeName) return;

    this.isLoading = true;
    this.feedService.getIngredientsByType(typeName).subscribe({
      next: (data) => {
        this.ingredients = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error filtering ingredients', error);
        this.ingredients = this.ingredients.filter(ingredient => 
          ingredient.type === typeName
        );
        this.isLoading = false;
      }
    });
  }

  get ingredientPriceControls() {
    return (this.feedForm.get('ingredientPrice') as FormArray).controls;
  }

  addIngredient(): void {
    const ingredientPriceArray = this.feedForm.get('ingredientPrice') as FormArray;
    ingredientPriceArray.push(
      this.fb.group({
        id: [null, Validators.required],
        price: [0, [Validators.required, Validators.min(0)]]
      })
    );
  }

  onIngredientSelected(ingredientId: any): void {
    this.selectedIngredientId = ingredientId;
  }

  addIngredientWithValues(price: string): void {
    if (this.selectedIngredientId === null) {
      alert('Please select an ingredient');
      return;
    }

    if (!price || parseFloat(price) < 0) {
      alert('Please enter a valid price');
      return;
    }

    const ingredientPriceArray = this.feedForm.get('ingredientPrice') as FormArray;
    const alreadyExists = ingredientPriceArray.controls.some(
      control => control.get('id')?.value === this.selectedIngredientId
    );

    if (alreadyExists) {
      alert('This ingredient is already added');
      return;
    }

    ingredientPriceArray.push(
      this.fb.group({
        id: [this.selectedIngredientId, Validators.required],
        price: [parseFloat(price), [Validators.required, Validators.min(0)]]
      })
    );

    if (this.ingredientDropdown) {
      this.ingredientDropdown.selectedId = null;
      this.selectedIngredientId = null;
    }
    this.ingredientPriceInput.nativeElement.value = '';
  }

  removeIngredient(index: number): void {
    const ingredientPriceArray = this.feedForm.get('ingredientPrice') as FormArray;
    ingredientPriceArray.removeAt(index);
  }

  getIngredientName(id: number): string {
    if (!id) return '';
    const ingredient = this.ingredients.find(ing => ing.id === id);
    return ingredient ? ingredient.name : '';
  }

  onDropdownSelectionChange(controlName: string, selectedId: any): void {
    this.feedForm.get(controlName)?.setValue(selectedId);
  }

  onSubmit(): void {
    if (this.feedForm.invalid) {
      this.markFormGroupTouched(this.feedForm);
      return;
    }

    if (this.ingredientPriceControls.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }

    this.isLoading = true;
    this.feedService.createFeed(this.feedForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.closeModal(true);
      },
      error: (error) => {
        console.error('Error creating feed', error);
        this.errorMessage = 'Failed to create feed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  closeModal(success = false): void {
    this.close.emit(success);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getCategoryNames(): string {
    return this.categories.map(c => c.name).join(', ');
  }
}
