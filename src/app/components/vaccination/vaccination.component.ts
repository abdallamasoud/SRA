import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';

export interface Vaccine {
  id?: number;
  name: string;
  type: string;
  dose: string;
  timeToTake: string;
}

@Component({
  selector: 'app-vaccination',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vaccination.component.html',
  styleUrls: ['./vaccination.component.css']
})
export class VaccinationComponent implements OnInit {
  vaccines: Vaccine[] = [];
  filteredVaccines: Vaccine[] = [];
  searchTerm: string = '';
  isFilterDropdownOpen: boolean = false;

  showAddNewVaccineModal: boolean = false;
  showEditExistVaccineModal: boolean = false;
  showDeleteVaccineModal: boolean = false;
  selectedVaccine: Vaccine = this.initializeVaccine();

  constructor() { } // No service for now, using mock data

  ngOnInit(): void {
    this.loadVaccines();
  }

  initializeVaccine(): Vaccine {
    return {
      id: undefined,
      name: '',
      type: '',
      dose: '',
      timeToTake: ''
    };
  }

  loadVaccines(): void {
    this.vaccines = [
      { id: 1, name: 'Foot-and-Mouth Disease Vaccine', type: 'Inactivated viral vaccine', dose: '2 ml for large animals,1ml per 50 KG', timeToTake: 'At 4-6 months of age Taken again 4-6 weeks after the first dose.' },
      { id: 2, name: 'Rabies Vaccine', type: 'Killed virus vaccine', dose: '1 ml for all animals', timeToTake: 'Annually' },
      { id: 3, name: 'Bovine Viral Diarrhea (BVD) Vaccine', type: 'Modified-live virus vaccine', dose: '2 ml for all animals', timeToTake: 'Pre-breeding' },
      { id: 4, name: 'Clostridial Vaccine (7-way)', type: 'Bacterin-toxoid vaccine', dose: '5 ml for all animals', timeToTake: 'Annually' },
      { id: 5, name: 'Brucellosis Vaccine (RB51)', type: 'Live attenuated vaccine', dose: '2 ml for all animals', timeToTake: 'Between 4-12 months of age (heifers only)' }
    ];
    this.filteredVaccines = [...this.vaccines];
  }

  // Modal control functions
  openAddNewVaccineModal(): void {
    this.selectedVaccine = this.initializeVaccine();
    this.showAddNewVaccineModal = true;
  }

  openEditExistVaccineModal(): void {
    this.selectedVaccine = this.initializeVaccine();
    this.showEditExistVaccineModal = true;
  }

  openDeleteVaccineModal(): void {
    this.showDeleteVaccineModal = true;
  }

  closeAllModals(): void {
    this.showAddNewVaccineModal = false;
    this.showEditExistVaccineModal = false;
    this.showDeleteVaccineModal = false;
    this.selectedVaccine = this.initializeVaccine();
  }

  // Submission functions (mocked)
  submitNewVaccine(): void {
    const newVaccine = { ...this.selectedVaccine, id: this.vaccines.length > 0 ? Math.max(...this.vaccines.map(v => v.id || 0)) + 1 : 1 };
    this.vaccines.push(newVaccine);
    this.filteredVaccines = [...this.vaccines];
    this.closeAllModals();
    alert('Vaccine added successfully!');
  }

  submitUpdateVaccine(): void {
    const index = this.vaccines.findIndex(v => v.id === this.selectedVaccine.id);
    if (index !== -1) {
      this.vaccines[index] = { ...this.selectedVaccine };
      this.filteredVaccines = [...this.vaccines];
      alert('Vaccine updated successfully!');
    } else {
      alert('Vaccine not found for update.');
    }
    this.closeAllModals();
  }

  confirmDeleteVaccine(): void {
    // In a real app, you'd delete selected items. For simplicity, delete the selectedVaccine
    if (this.selectedVaccine.id) {
      this.vaccines = this.vaccines.filter(v => v.id !== this.selectedVaccine.id);
      this.filteredVaccines = [...this.vaccines];
      alert('Vaccine deleted successfully!');
    } else {
      alert('No vaccine selected for deletion.');
    }
    this.closeAllModals();
  }

  // Search and filter functions
  performSearch(): void {
    this.filteredVaccines = this.vaccines.filter(vaccine =>
      vaccine.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vaccine.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vaccine.dose.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vaccine.timeToTake.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  applyFilter(filterType: string): void {
    // For now, simple console log. Could implement sorting/filtering based on type
    console.log(`Applying filter: ${filterType}`);
    this.isFilterDropdownOpen = false;
  }

  showDataForVaccine(): void {
    if (this.selectedVaccine.name) {
      const foundVaccine = this.vaccines.find(v => v.name.toLowerCase() === this.selectedVaccine.name.toLowerCase());
      if (foundVaccine) {
        this.selectedVaccine = { ...foundVaccine };
      } else {
        alert('Vaccine not found with this name.');
        this.selectedVaccine = this.initializeVaccine();
      }
    }
  }
}
