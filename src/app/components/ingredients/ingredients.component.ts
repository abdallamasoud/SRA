import { Component, OnInit } from '@angular/core';
import { Ingredient, IngredientService } from '../../services/ingredient.service';

@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  ingredients: Ingredient[] = [];
  filteredIngredients: Ingredient[] = [];
  selectedIngredient: Ingredient = this.initIngredient();
  selectedSeason: string = '';
  showAddNewIngredientModal = false;
  showEditExistIngredientsModal = false;
  showDeleteIngredientModal = false;
  searchTerm: string = '';
  isFilterDropdownOpen = false;

  constructor(private ingredientService: IngredientService) {}

  ngOnInit(): void {
    this.loadIngredients();
  }

  initIngredient(): Ingredient {
    return { name: '', type: 0, unit: 0, cp: 0, tdn: 0, cf: 0, me: 0, season: '' };
  }

  loadIngredients(): void {
    this.ingredientService.getAll().subscribe({
      next: (data) => {
        this.ingredients = data;
        this.applySearchAndFilter();
      },
      error: (err) => console.error(err)
    });
  }

  saveIngredient(): void {
    this.ingredientService.create(this.selectedIngredient).subscribe({
      next: () => {
        this.loadIngredients();
        this.closeAllModals();
      },
      error: (err) => console.error(err)
    });
  }

  submitUpdateIngredient(): void {
    this.ingredientService.update(this.selectedIngredient).subscribe({
      next: () => {
        this.loadIngredients();
        this.closeAllModals();
      },
      error: (err) => console.error(err)
    });
  }

  openAddNewIngredientModal(): void {
    this.selectedIngredient = this.initIngredient();
    this.showAddNewIngredientModal = true;
  }

  openEditExistIngredientsModal(): void {
    this.showEditExistIngredientsModal = true;
  }

  openDeleteIngredientModal(): void {
    this.showDeleteIngredientModal = true;
  }

  confirmDeleteIngredient(): void {
    if (this.selectedIngredient.id) {
      this.ingredientService.delete(this.selectedIngredient.id).subscribe({
        next: () => {
          this.loadIngredients();
          this.closeAllModals();
        },
        error: (err) => console.error(err)
      });
    }
  }

  closeAllModals(): void {
    this.showAddNewIngredientModal = false;
    this.showEditExistIngredientsModal = false;
    this.showDeleteIngredientModal = false;
  }

  applyFilter(property: keyof Ingredient): void {
    this.filteredIngredients = [...this.ingredients].sort((a, b) =>
      (a[property] ?? '').toString().localeCompare((b[property] ?? '').toString())
    );
  }

  performSearch(): void {
    this.applySearchAndFilter();
  }

  applySeasonFilter(): void {
    this.applySearchAndFilter();
  }

  applySearchAndFilter(): void {
    this.filteredIngredients = this.ingredients.filter(i =>
      (!this.selectedSeason || i.season === this.selectedSeason) &&
      (!this.searchTerm || i.name?.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }

  showDataForIngredient(): void {
    const found = this.ingredients.find(i => i.name === this.selectedIngredient.name);
    if (found) {
      this.selectedIngredient = { ...found };
    }
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }
}
