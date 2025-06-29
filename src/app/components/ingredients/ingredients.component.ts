import { Component, OnInit } from '@angular/core';
import { Ingredient, IngredientService } from '../../services/ingredient.service';
import { forkJoin } from 'rxjs';

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
  selectedIds: number[] = [];
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
    return { name: '', type: null, unit: 0, cp: 0, tdn: 0, cf: 0, me: 0, season: '' };
  }

  loadIngredients(): void {
    this.ingredientService.getAll().subscribe({
      next: (data) => {
        this.ingredients = data.map(item => ({
          ...item,
          season: localStorage.getItem(`season_${item.name}`) || ''
        }));
        this.applySearchAndFilter();
      },
      error: (err) => console.error(err)
    });
  }

  toggleSelection(id: number): void {
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter(i => i !== id);
    } else {
      this.selectedIds.push(id);
    }
  }

  toggleAllSelections(event: any): void {
    const isChecked = event.target.checked;
    if (isChecked) {
      this.selectedIds = this.filteredIngredients.map(i => i.id!);
    } else {
      this.selectedIds = [];
    }
  }

  saveIngredient(): void {
    if (!this.selectedIngredient.name || this.selectedIngredient.type === null) {
      alert('يرجى إدخال اسم المكون ونوعه');
      return;
    }

    const ingredient = { ...this.selectedIngredient };
    localStorage.setItem(`season_${ingredient.name}`, ingredient.season ?? '');

    const ingredientToSend = { 
      ...ingredient,
      type: Number(ingredient.type),
      unit: Number(ingredient.unit),
      cp: Number(ingredient.cp),
      tdn: Number(ingredient.tdn),
      cf: Number(ingredient.cf),
      me: Number(ingredient.me)
    };
    delete ingredientToSend.season;

    console.log('Sending ingredient to backend:', ingredientToSend);

    this.ingredientService.create(ingredientToSend).subscribe({
      next: (response) => {
        console.log('Ingredient created successfully:', response);
        this.loadIngredients();
        this.closeAllModals();
        alert('تم إضافة المكون بنجاح!');
      },
      error: (err) => {
        console.error('Error creating ingredient:', err);
        let errorMessage = 'حدث خطأ أثناء إضافة المكون';
        
        if (err.status === 400) {
          errorMessage = 'بيانات غير صحيحة. يرجى التحقق من المدخلات.';
        } else if (err.status === 409) {
          errorMessage = 'يوجد مكون بنفس الاسم بالفعل.';
        } else if (err.status === 500) {
          errorMessage = 'خطأ في الخادم. يرجى المحاولة مرة أخرى.';
        }
        
        alert(errorMessage);
      }
    });
  }

  submitUpdateIngredient(): void {
    if (!this.selectedIngredient.name || this.selectedIngredient.type === null) {
      alert('يرجى إدخال اسم المكون ونوعه');
      return;
    }

    const ingredientToUpdate = {
      ...this.selectedIngredient,
      type: Number(this.selectedIngredient.type),
      unit: Number(this.selectedIngredient.unit),
      cp: Number(this.selectedIngredient.cp),
      tdn: Number(this.selectedIngredient.tdn),
      cf: Number(this.selectedIngredient.cf),
      me: Number(this.selectedIngredient.me)
    };

    console.log('Updating ingredient:', ingredientToUpdate);

    this.ingredientService.update(ingredientToUpdate).subscribe({
      next: () => {
        console.log('Ingredient updated successfully');
        this.loadIngredients();
        this.closeAllModals();
        alert('تم تحديث المكون بنجاح!');
      },
      error: (err) => {
        console.error('Error updating ingredient:', err);
        let errorMessage = 'حدث خطأ أثناء تحديث المكون';
        
        if (err.status === 400) {
          errorMessage = 'بيانات غير صحيحة. يرجى التحقق من المدخلات.';
        } else if (err.status === 404) {
          errorMessage = 'لم يتم العثور على المكون.';
        } else if (err.status === 500) {
          errorMessage = 'خطأ في الخادم. يرجى المحاولة مرة أخرى.';
        }
        
        alert(errorMessage);
      }
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

  typeLabels: { [key: number]: string } = {
    0: 'Grain',
    1: 'Cake',
    2: 'Bran'
  };

  confirmDelete(): void {
    if (this.selectedIds.length === 0) {
      alert('Please select at least one ingredient to delete.');
      return;
    }

    const deleteRequests = this.selectedIds.map(id => this.ingredientService.delete(id));
    forkJoin(deleteRequests).subscribe({
      next: () => {
        this.loadIngredients();
        this.selectedIds = [];
        this.closeAllModals();
      },
      error: err => console.error('Error deleting ingredients', err)
    });
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
      (!this.selectedSeason || this.selectedSeason === 'All' || i.season === this.selectedSeason) &&
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
