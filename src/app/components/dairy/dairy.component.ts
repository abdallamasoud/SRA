import { Component, OnInit } from '@angular/core';
import { Animal } from '../../services/animal.service';
import { DairyService } from '../../services/dairy.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dairy',
  templateUrl: './dairy.component.html',
  styleUrls: ['./dairy.component.css']
})
export class DairyComponent implements OnInit {
  dairies: Animal[] = [];
  filteredDairies: Animal[] = [];
  selectedAnimalIds: number[] = [];
  selectedDairy: any = this.initAnimal();
  searchTerm = '';
  searchCode = '';
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  isFilterDropdownOpen = false;

  constructor(private dairyService: DairyService) {}

  ngOnInit(): void {
    this.loadDairies();
  }

  genderLabels: { [key: number]: string } = {
    1: 'Female',
    0: 'Male'
  };

  loadDairies(): void {
    this.dairyService.getDairies().subscribe({
      next: (data) => {
        this.dairies = data.map(a => ({
          ...a,
          id: Number(a.id),
          gender: Number(a.gender),
          animalType: Number(a.animalType),
          weightDate: a.weightDate?.split('T')[0] ?? '',
          dateOfBirth: a.dateOfBirth?.split('T')[0] ?? '',
            milk: a.milk ?? 0,
          fatPercentage: a.fatPercentage ?? 0,
         statuForitification: a.statuForitification ?? 0,
         dateFertilization: a.dateFertilization ?? '',
         expectedDate: a.expectedDate ?? ''
        }));
        this.filteredDairies = [...this.dairies];
      },
      error: err => console.error('Error loading dairies', err)
    });
  }

  initAnimal(): any {
    return {
      id: 0,
      code: '',
      noFamily: '',
      animalType: 1,
      weight: 0,
      weightDate: '',
      description: '',
      gender: 0,
      dateOfBirth: '',
      milk: 0,
      fatPercentage: 0,
      statuForitification: 0,
      dateFertilization: '',
      expectedDate: ''
    };
  }

  openAddModal(): void {
    this.selectedDairy = this.initAnimal();
    this.showAddModal = true;
  }

  openEditModal(animal: Animal | null): void {
    this.selectedDairy = animal ? { ...animal } : this.initAnimal();
    this.showEditModal = true;
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
  }

  // ✅ إضافة Dairy جديد
addDairy(): void {
  const dairyData = {
    code: this.selectedDairy.code, // ← مهم جداً
    milk: this.selectedDairy.milk,
    fatPercentage: this.selectedDairy.fatPercentage
  };

  this.dairyService.addDairy(dairyData).subscribe({
    next: () => {
      this.loadDairies();
      this.closeModals();
    },
    error: err => console.error('Error adding dairy', err)
  });
}

  updateDairy(): void {
    this.dairyService.updateDairy(this.selectedDairy).subscribe({
      next: () => {
        this.loadDairies();
        this.closeModals();
      },
      error: err => console.error('Error updating dairy', err)
    });
  }

  deleteDairy(id: number): void {
    this.dairyService.deleteDairy(id).subscribe({
      next: () => {
        this.loadDairies();
        this.closeModals();
      },
      error: err => console.error('Error deleting dairy', err)
    });
  }

  toggleAnimalSelection(id: number): void {
    if (this.selectedAnimalIds.includes(id)) {
      this.selectedAnimalIds = this.selectedAnimalIds.filter(i => i !== id);
    } else {
      this.selectedAnimalIds.push(id);
    }
  }

  toggleAllAnimalSelections(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedAnimalIds = checked ? this.filteredDairies.map(a => a.id!) : [];
  }

  confirmDeleteDairies(): void {
    if (this.selectedAnimalIds.length === 0) {
      alert('اختر حيوانًا أو أكثر للحذف.');
      return;
    }

    const deletes = this.selectedAnimalIds.map(id => this.dairyService.deleteDairy(id));
    forkJoin(deletes).subscribe({
      next: () => {
        this.loadDairies();
        this.selectedAnimalIds = [];
        this.closeModals();
      },
      error: err => console.error('حدث خطأ أثناء حذف الأبقار:', err)
    });
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  applyFilter(type: 'herdNumber' | 'gender' | 'weight' |'type'| 'all'): void {
    this.isFilterDropdownOpen = false;

    if (type === 'all') {
      this.filteredDairies = [...this.dairies];
      return;
    }

    this.filteredDairies = this.dairies.filter(animal => {
      switch (type) {
        case 'herdNumber':
          return !!animal.noFamily;
        case 'weight':
          return animal.weight !== null && animal.weight !== undefined;
        case 'gender':
          return animal.gender !== null && animal.gender !== undefined;
        default:
          return true;
      }
    });

    this.searchDairies();
  }

  searchDairies(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDairies = [...this.dairies];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredDairies = this.dairies.filter(a =>
      a.code.toLowerCase().includes(searchLower) ||
      a.noFamily.toLowerCase().includes(searchLower) ||
      a.description.toLowerCase().includes(searchLower) ||
      a.weight.toString().includes(searchLower)
    );
  }

  findAnimalByCode(): void {
    if (!this.searchCode.trim()) return;

    let found = this.filteredDairies.find(a =>
      a.code.toLowerCase() === this.searchCode.toLowerCase()
    );

    if (!found) {
      this.dairyService.getDairyById(+this.searchCode).subscribe({
        next: (animal) => {
          if (!this.filteredDairies.some(a => a.id === animal.id)) {
            this.filteredDairies.push(animal);
          }
          this.selectedDairy = { ...animal };
        },
        error: err => {
          console.error('Error fetching dairy:', err);
          this.selectedDairy = this.initAnimal();
        }
      });
    } else {
      this.selectedDairy = { ...found };
      this.searchCode='';
    }
  }
}
