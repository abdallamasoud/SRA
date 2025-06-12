import { Component, OnInit } from '@angular/core';
// import { IngredientService, Ingredient } from '../../services/ingredient.service'; // Commented out for mock data

// Define the Ingredient interface based on the HTML structure and image
export interface Ingredient {
  id?: number;
  name: string;
  type: string; // e.g., "Forages", "Concentrates"
  proteins: number;
  crudeFiber: number;
  tdn: number; // Total Digestible Nutrients
  me: number; // Metabolizable Energy
  season: string; // "winter" or "summer"
}

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  ingredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  activeFilterType: string = 'all';
  isFilterDropdownOpen: boolean = false;
  selectedSeason: string = 'all'; // Default to show all seasons

  // Modal control properties
  showAddNewIngredientModal: boolean = false;
  showEditExistIngredientsModal: boolean = false;
  showDeleteIngredientModal: boolean = false;
  selectedIngredient: Ingredient = this.initializeIngredient(); // Initialize with default values

  constructor(/* private ingredientService: IngredientService */) { }

  ngOnInit(): void {
    this.loadIngredients();
  }

  initializeIngredient(): Ingredient {
    return {
      name: '',
      type: '',
      proteins: 0,
      crudeFiber: 0,
      tdn: 0,
      me: 0,
      season: 'winter' // Default season
    };
  }

  loadIngredients(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Mock data for demonstration purposes
    this.ingredients = [
      { id: 1, name: 'Corn Grains', type: 'Concentrates Grains and seeds', proteins: 8.5, crudeFiber: 5.9, tdn: 3.5, me: 68.8, season: 'winter' },
      { id: 2, name: 'Soybean Meal', type: 'Proteins', proteins: 44.0, crudeFiber: 7.0, tdn: 75, me: 12.5, season: 'summer' },
      { id: 3, name: 'Alfalfa Hay', type: 'Forages', proteins: 17.0, crudeFiber: 24.0, tdn: 55, me: 9.2, season: 'winter' },
      { id: 4, name: 'Barley', type: 'Concentrates Grains and seeds', proteins: 11.5, crudeFiber: 5.0, tdn: 78, me: 12.8, season: 'summer' },
    ];
    this.filteredIngredients = [...this.ingredients];
    this.isLoading = false;
    this.applySeasonFilter(); // Apply season filter on load

    // TODO: Replace with actual IngredientService calls
    // this.ingredientService.getAllIngredients().subscribe({
    //   next: (data) => {
    //     this.ingredients = data;
    //     this.applyFilter();
    //     this.isLoading = false;
    //   },
    //   error: (error: Error) => {
    //     console.error('Error loading ingredients', error);
    //     this.errorMessage = 'Failed to load ingredients. Please try again.';
    //     this.isLoading = false;
    //   }
    // });
  }

  // --- Modal Functions ---
  openAddNewIngredientModal(): void {
    this.selectedIngredient = this.initializeIngredient();
    this.showAddNewIngredientModal = true;
  }

  openEditExistIngredientsModal(): void {
    this.selectedIngredient = this.initializeIngredient();
    this.showEditExistIngredientsModal = true;
  }

  openDeleteIngredientModal(): void {
    this.showDeleteIngredientModal = true;
  }

  closeAllModals(): void {
    this.showAddNewIngredientModal = false;
    this.showEditExistIngredientsModal = false;
    this.showDeleteIngredientModal = false;
    this.selectedIngredient = this.initializeIngredient(); // Clear selected data
  }

  // --- Submission Functions ---
  submitNewIngredient(): void {
    console.log('Submitting new ingredient:', this.selectedIngredient);
    // Implement add ingredient logic here
    this.closeAllModals();
    this.loadIngredients(); // Refresh data
  }

  submitUpdateIngredient(): void {
    console.log('Submitting updated ingredient:', this.selectedIngredient);
    // Implement update ingredient logic here
    this.closeAllModals();
    this.loadIngredients(); // Refresh data
  }

  showDataForIngredient(): void {
    console.log('Showing data for ingredient with name:', this.selectedIngredient.name);
    const foundIngredient = this.ingredients.find(i => i.name === this.selectedIngredient.name);
    if (foundIngredient) {
      this.selectedIngredient = { ...foundIngredient };
    } else {
      alert('Ingredient not found with this name.');
      this.selectedIngredient = this.initializeIngredient();
    }
  }

  confirmDeleteIngredient(): void {
    console.log('Confirming delete for selected ingredient.');
    // Implement actual delete logic here
    this.closeAllModals();
    this.loadIngredients(); // Refresh data
  }

  // --- Search and Filter Functions ---
  performSearch(): void {
    let tempFiltered = [...this.ingredients];

    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      tempFiltered = tempFiltered.filter(ingredient =>
        ingredient.name.toLowerCase().includes(search) ||
        ingredient.type.toLowerCase().includes(search) ||
        ingredient.season.toLowerCase().includes(search)
      );
    }

    this.filteredIngredients = tempFiltered;
    this.applySeasonFilter(); // Apply season filter after search
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  applyFilter(filterType: string): void {
    this.activeFilterType = filterType;
    let tempFiltered = [...this.ingredients];

    // Apply search filter first
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      tempFiltered = tempFiltered.filter(ingredient =>
        ingredient.name.toLowerCase().includes(search) ||
        ingredient.type.toLowerCase().includes(search) ||
        ingredient.season.toLowerCase().includes(search)
      );
    }

    // Apply specific filter
    if (filterType === 'name') {
      tempFiltered = tempFiltered.filter(ingredient => ingredient.name && ingredient.name !== '');
    } else if (filterType === 'type') {
      tempFiltered = tempFiltered.filter(ingredient => ingredient.type && ingredient.type !== '');
    } else if (filterType === 'proteins') {
      tempFiltered = tempFiltered.filter(ingredient => ingredient.proteins > 0);
    } else if (filterType === 'crudeFiber') {
      tempFiltered = tempFiltered.filter(ingredient => ingredient.crudeFiber > 0);
    } else if (filterType === 'tdn') {
      tempFiltered = tempFiltered.filter(ingredient => ingredient.tdn > 0);
    } else if (filterType === 'me') {
      tempFiltered = tempFiltered.filter(ingredient => ingredient.me > 0);
    }

    this.filteredIngredients = tempFiltered;
    this.applySeasonFilter(); // Apply season filter after other filters
  }

  applySeasonFilter(): void {
    let tempFiltered = [...this.ingredients];

    // Apply existing search term first
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      tempFiltered = tempFiltered.filter(ingredient =>
        ingredient.name.toLowerCase().includes(search) ||
        ingredient.type.toLowerCase().includes(search)
      );
    }

    // Apply season filter
    if (this.selectedSeason !== 'all') {
      tempFiltered = tempFiltered.filter(ingredient => ingredient.season === this.selectedSeason);
    }

    this.filteredIngredients = tempFiltered;
  }
}
