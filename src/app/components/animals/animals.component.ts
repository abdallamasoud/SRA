import { Component, OnInit } from '@angular/core';
import { Animal } from '../../services/animal.service';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.css']
})
export class AnimalsComponent implements OnInit {
  animals: Animal[] = [];
  allAnimals: Animal[] = []; // Store all animals to filter/search from
  searchCode: string = ''; // For searching animal by code in update modal
  selectedAnimal: Animal = {
    id: 0,
    code: '',
    herdNumber: '',
    animalType: 'Dairy',
    weight: 0,
    weightDate: '',
    dateOfBirth: '',
    healthcareNote: '',
    takenVaccinations: '',
    madeArtificialInsemination: false,
    dateOfArtificialInsemination: null,
    statueOfInsemination: 'Pregnant',
    expectedDateOfCalving: null,
    gender: 'Female'
  };

  // Modal states
  showAddModal = false;
  showEditModal = false;
  showFatteningWeightModal = false;
  showDeleteModal = false;

  // Search states
  searchTerm: string = '';
  isFilterDropdownOpen = false;

  constructor(private animalService: AnimalService) { }

  ngOnInit(): void {
    this.loadAnimals();
  }

  loadAnimals(): void {
    this.animalService.getAllAnimals().subscribe({
      next: (data) => {
        this.allAnimals = data;
        this.animals = [...this.allAnimals]; // Initialize displayed animals with all animals
      },
      error: (error: Error) => {
        console.error('Error loading animals', error);
      }
    });
  }

  // Search functions
  searchAnimals(): void {
    if (!this.searchTerm.trim()) {
      this.animals = [...this.allAnimals];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.animals = this.allAnimals.filter(animal =>
      animal.code.toLowerCase().includes(searchLower) ||
      animal.animalType.toLowerCase().includes(searchLower) ||
      animal.herdNumber.toLowerCase().includes(searchLower) ||
      animal.healthcareNote.toLowerCase().includes(searchLower) ||
      animal.takenVaccinations?.toLowerCase().includes(searchLower) ||
      animal.weight.toString().includes(searchLower)
    );
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  applyFilter(type: 'herdNumber' |'gender'| 'weight' | 'type' | 'all'): void {
    this.isFilterDropdownOpen = false; // Close dropdown after applying filter

    if (type === 'all') {
      this.animals = [...this.allAnimals];
      return;
    }

    this.animals = this.allAnimals.filter(animal => {
      switch (type) {
        case 'herdNumber':
          return animal.herdNumber !== null && animal.herdNumber !== undefined;
        case 'weight':
          return animal.weight !== null && animal.weight !== undefined;
        case 'type':
          return animal.animalType !== null && animal.animalType !== undefined;
           case 'gender':
          return animal.gender !== null && animal.gender !== undefined;
        default:
          return true;
      }
    });
    // Additionally, if a search term is present, re-apply the search on the filtered results
    this.searchAnimals();
  }

  // Modal functions
  openAddModal(): void {
    this.selectedAnimal = {
      id: 0,
      code: '',
      herdNumber: '',
      animalType: 'Dairy',
      weight: 0,
      weightDate: '',
      dateOfBirth: '',
      healthcareNote: '',
      takenVaccinations: '',
      madeArtificialInsemination: false,
      dateOfArtificialInsemination: null,
      statueOfInsemination: 'Pregnant',
      expectedDateOfCalving: null,
      gender: 'Female'
    };
    this.showAddModal = true;
  }

  openEditModal(animal: Animal | null): void {
    if (animal) {
      this.selectedAnimal = { ...animal };
    } else {
      this.selectedAnimal = {
        id: 0,
        code: '',
        herdNumber: '',
        animalType: 'Dairy',
        weight: 0,
        weightDate: '',
        dateOfBirth: '',
        healthcareNote: '',
        takenVaccinations: '',
        madeArtificialInsemination: false,
        dateOfArtificialInsemination: null,
        statueOfInsemination: 'Pregnant',
        expectedDateOfCalving: null,
        gender: 'Female'
      };
    }
    this.showEditModal = true;
  }

  openFatteningWeightModal(): void {
    this.selectedAnimal = {
      id: 0,
      code: '',
      herdNumber: '',
      animalType: 'Dairy',
      weight: 0,
      weightDate: '',
      dateOfBirth: '',
      healthcareNote: '',
      takenVaccinations: '',
      madeArtificialInsemination: false,
      dateOfArtificialInsemination: null,
      statueOfInsemination: 'Pregnant',
      expectedDateOfCalving: null,
      gender: 'Female'
    };
    this.showFatteningWeightModal = true;
  }

  openDeleteModal(): void {
    this.selectedAnimal = {
      id: 0,
      code: '',
      herdNumber: '',
      animalType: 'Dairy',
      weight: 0,
      weightDate: '',
      dateOfBirth: '',
      healthcareNote: '',
      takenVaccinations: '',
      madeArtificialInsemination: false,
      dateOfArtificialInsemination: null,
      statueOfInsemination: 'Pregnant',
      expectedDateOfCalving: null,
      gender: 'Female'
    };
    this.showDeleteModal = true;
  }

  closeAllModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showFatteningWeightModal = false;
    this.showDeleteModal = false;
    // Clear selected animal or reset form if necessary
    this.selectedAnimal = {
      id: 0,
      code: '',
      herdNumber: '',
      animalType: 'Dairy',
      weight: 0,
      weightDate: '',
      dateOfBirth: '',
      healthcareNote: '',
      takenVaccinations: '',
      madeArtificialInsemination: false,
      dateOfArtificialInsemination: null,
      statueOfInsemination: 'Pregnant',
      expectedDateOfCalving: null,
      gender: 'Female'
    };
  }

  // Submit functions
  submitAnimal(): void {
    if (this.showAddModal) {
      this.animalService.createAnimal(this.selectedAnimal).subscribe({
        next: () => {
          this.loadAnimals();
          this.showAddModal = false;
        },
        error: (error: Error) => {
          console.error('Error adding animal', error);
        }
      });
    } else if (this.showEditModal) {
      this.animalService.updateAnimal(this.selectedAnimal).subscribe({
        next: () => {
          this.loadAnimals();
          this.showEditModal = false;
        },
        error: (error: Error) => {
          console.error('Error updating animal', error);
        }
      });
    }
  }

  submitFatteningWeight(): void {
    this.animalService.updateAnimal(this.selectedAnimal).subscribe({
      next: () => {
        this.loadAnimals();
        this.showFatteningWeightModal = false;
      },
      error: (error: Error) => {
        console.error('Error updating fattening weight', error);
      }
    });
  }

  confirmDelete(): void {
    if (this.selectedAnimal.id) {
      this.animalService.deleteAnimal(this.selectedAnimal.id).subscribe({
        next: () => {
          this.loadAnimals();
          this.showDeleteModal = false;
        },
        error: (error: Error) => {
          console.error('Error deleting animal', error);
        }
      });
    }
  }

  findAnimalByCode(): void {
    if (!this.searchCode.trim()) {
      return;
    }

    // First try to find in the current animals list
    let foundAnimal = this.allAnimals.find(animal =>
      animal.code.toLowerCase() === this.searchCode.toLowerCase()
    );

    // If not found in current list, try to fetch from server
    if (!foundAnimal) {
      this.animalService.getAnimalById(parseInt(this.searchCode)).subscribe({
        next: (animal) => {
          if (animal) {
            this.selectedAnimal = { ...animal };
            // Add to local list if not already there
            if (!this.allAnimals.some(a => a.id === animal.id)) {
              this.allAnimals.push(animal);
            }
          } else {
            console.log('Animal not found');
            // Reset form with empty data
            this.selectedAnimal = {
              id: 0,
              code: this.searchCode,
              herdNumber: '',
              animalType: 'Dairy',
              weight: 0,
              weightDate: '',
              dateOfBirth: '',
              healthcareNote: '',
              takenVaccinations: '',
              madeArtificialInsemination: false,
              dateOfArtificialInsemination: null,
              statueOfInsemination: 'Pregnant',
              expectedDateOfCalving: null,
              gender: 'Female'
            };
          }
        },
        error: (error) => {
          console.error('Error fetching animal:', error);
          // Reset form with empty data
          this.selectedAnimal = {
            id: 0,
            code: this.searchCode,
            herdNumber: '',
            animalType: 'Dairy',
            weight: 0,
            weightDate: '',
            dateOfBirth: '',
            healthcareNote: '',
            takenVaccinations: '',
            madeArtificialInsemination: false,
            dateOfArtificialInsemination: null,
            statueOfInsemination: 'Pregnant',
            expectedDateOfCalving: null,
            gender: 'Female'
          };
        }
      });
    } else {
      // If found in current list, use that data
      this.selectedAnimal = { ...foundAnimal };
    }
  }
}
