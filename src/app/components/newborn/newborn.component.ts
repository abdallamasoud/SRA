import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../../services/animal.service';

// Define the NewbornAnimal interface based on the HTML structure and image
export interface NewbornAnimal {
  id?: number; // Assuming there's an ID for database operations
  name: string;
  code: string;
  herdNumber: string;
  gender: string; // "Male" or "Female"
  dateOfBirth: string; // Date string
  weight: number;
  dateOfWeight: string; // Date string, date of last weight recording
  healthcareNote: string;
  type: string; // "Newborn" or "Fattening" or "Dairy" (for update modal)
  takenVaccinations?: string; // Optional field
}

@Component({
  selector: 'app-newborn',
  templateUrl: './newborn.component.html',
  styleUrls: ['./newborn.component.css']
})
export class NewbornComponent implements OnInit {
  newbornAnimals: NewbornAnimal[] = [];
  filteredNewbornAnimals: NewbornAnimal[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  activeFilterType: string = 'all'; // For the filter dropdown
  isFilterDropdownOpen: boolean = false; // To control filter dropdown visibility

  // Modal control properties
  showAddNewbornModal: boolean = false;
  showUpdateNewbornModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedNewbornAnimal: NewbornAnimal = this.initializeNewbornAnimal(); // Initialize with default values

  constructor(private animalService: AnimalService) { }

  ngOnInit(): void {
    this.loadNewborns();
  }

  initializeNewbornAnimal(): NewbornAnimal {
    return {
      name: '',
      code: '',
      herdNumber: '',
      gender: '',
      dateOfBirth: '',
      weight: 0,
      dateOfWeight: '',
      healthcareNote: '',
      type: 'Newborn', // Default type for new entries
      takenVaccinations: ''
    };
  }

  loadNewborns(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Mock data for demonstration purposes, replace with actual service calls later
    this.newbornAnimals = [
      {
        id: 1,
        name: 'Cow 1',
        code: '45',
        herdNumber: '5',
        gender: 'Female',
        dateOfBirth: '7/2/2025',
        weight: 200,
        dateOfWeight: '2/2/2025',
        healthcareNote: 'In Good Health',
        type: 'Newborn',
        takenVaccinations: 'Vaccine X'
      },
      {
        id: 2,
        name: 'Cow 2',
        code: '46',
        herdNumber: '5',
        gender: 'Female',
        dateOfBirth: '7/2/2025',
        weight: 220,
        dateOfWeight: '2/2/2025',
        healthcareNote: 'In Good Health',
        type: 'Newborn',
        takenVaccinations: 'Vaccine Y'
      },
      {
        id: 3,
        name: 'Cow 3',
        code: '47',
        herdNumber: '5',
        gender: 'Female',
        dateOfBirth: '7/2/2025',
        weight: 140,
        dateOfWeight: '2/2/2025',
        healthcareNote: 'In Good Health',
        type: 'Newborn',
        takenVaccinations: 'Vaccine Z'
      }
    ];
    this.filteredNewbornAnimals = [...this.newbornAnimals];
    this.isLoading = false;

    // TODO: Replace with actual animalService.getNewbornAnimals() or a dedicated NewbornService
    // this.animalService.getNewbornAnimals().subscribe({
    //   next: (data: NewbornAnimal[]) => { // Specify type for data
    //     this.newbornAnimals = data;
    //     this.filteredNewbornAnimals = [...this.newbornAnimals];
    //     this.isLoading = false;
    //   },
    //   error: (error: Error) => { // Explicitly type error
    //     console.error('Error loading newborn animals', error);
    //     this.errorMessage = 'Failed to load newborn animals. Please try again later.';
    //     this.isLoading = false;
    //   }
    // });
  }

  // --- Modal Functions ---
  openAddNewbornModal(): void {
    this.selectedNewbornAnimal = this.initializeNewbornAnimal(); // Reset form
    this.showAddNewbornModal = true;
  }

  openUpdateNewbornModal(): void {
    this.selectedNewbornAnimal = this.initializeNewbornAnimal(); // Reset form
    this.showUpdateNewbornModal = true;
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeAllModals(): void {
    this.showAddNewbornModal = false;
    this.showUpdateNewbornModal = false;
    this.showDeleteModal = false;
    this.selectedNewbornAnimal = this.initializeNewbornAnimal(); // Clear selected data
  }

  // --- Submission Functions ---
  submitNewbornAnimal(): void {
    console.log('Submitting new newborn animal:', this.selectedNewbornAnimal);
    // Implement add newborn animal logic here
    this.closeAllModals();
    this.loadNewborns(); // Refresh data after submission
  }

  submitUpdateNewbornAnimal(): void {
    console.log('Submitting updated newborn animal:', this.selectedNewbornAnimal);
    // Implement update newborn animal logic here
    this.closeAllModals();
    this.loadNewborns(); // Refresh data after submission
  }

  showDataForNewbornAnimal(): void {
    console.log('Showing data for newborn animal with name:', this.selectedNewbornAnimal.name);
    const foundAnimal = this.newbornAnimals.find(n => n.name === this.selectedNewbornAnimal.name);
    if (foundAnimal) {
      this.selectedNewbornAnimal = { ...foundAnimal };
    } else {
      alert('Newborn animal not found with this name.');
      this.selectedNewbornAnimal = this.initializeNewbornAnimal();
    }
  }

  confirmDelete(): void {
    console.log('Confirming delete for selected newborn animals.');
    // Implement actual delete logic here
    this.closeAllModals();
    this.loadNewborns(); // Refresh data after deletion
  }

  // --- Search and Filter Functions ---
  performSearch(): void {
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      this.filteredNewbornAnimals = this.newbornAnimals.filter(newborn =>
        newborn.name.toLowerCase().includes(search) ||
        newborn.code.toLowerCase().includes(search) ||
        newborn.herdNumber.toLowerCase().includes(search) ||
        newborn.gender.toLowerCase().includes(search) ||
        newborn.healthcareNote.toLowerCase().includes(search) ||
        newborn.type.toLowerCase().includes(search)
      );
    } else {
      this.filteredNewbornAnimals = [...this.newbornAnimals];
    }
    this.applyFilter(this.activeFilterType);
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  applyFilter(filterType: string): void {
    this.activeFilterType = filterType;
    let tempFiltered = [...this.newbornAnimals];

    // Apply search filter first
    if (this.searchTerm) {
      const search = this.searchTerm.toLowerCase();
      tempFiltered = tempFiltered.filter(newborn =>
        newborn.name.toLowerCase().includes(search) ||
        newborn.code.toLowerCase().includes(search) ||
        newborn.herdNumber.toLowerCase().includes(search) ||
        newborn.gender.toLowerCase().includes(search) ||
        newborn.healthcareNote.toLowerCase().includes(search) ||
        newborn.type.toLowerCase().includes(search)
      );
    }

    // Apply specific filter
    if (filterType === 'herdNumber') {
      tempFiltered = tempFiltered.filter(newborn => newborn.herdNumber && newborn.herdNumber !== '');
    } else if (filterType === 'weight') {
      tempFiltered = tempFiltered.filter(newborn => newborn.weight > 0);
    } else if (filterType === 'gender') {
      tempFiltered = tempFiltered.filter(newborn => newborn.gender && newborn.gender !== '');
    } else if (filterType === 'type') {
      tempFiltered = tempFiltered.filter(newborn => newborn.type && newborn.type !== '');
    }

    this.filteredNewbornAnimals = tempFiltered;
  }
}
