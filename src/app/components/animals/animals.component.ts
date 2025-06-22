import { Component, OnInit } from '@angular/core';
import { Animal } from '../../services/animal.service';
import { AnimalService } from '../../services/animal.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-animals',
  templateUrl: './animals.component.html',
  styleUrls: ['./animals.component.css']
})
export class AnimalsComponent implements OnInit {
 animals: Animal[] = [];
filteredAnimals: Animal[] = [];
selectedAnimalIds: number[] = [];
  allAnimals: Animal[] = [];
  selectedIds: number[] = [];
  searchCode: string = '';



  fatteningWeight = {

  weight: 0,
  dateOfWeight: '',
  description: ''
};
  selectedAnimal: Animal = {
    id: 0,
    code: '',
    noFamily: '',
    animalType: 0,
    weight: 0,
    weightDate: '',
    description: '',
    gender: 0,
    dateOfBirth:''
  };

  showAddModal = false;
  showEditModal = false;
  showFatteningWeightModal = false;
  showDeleteModal = false;

  searchTerm: string = '';
  isFilterDropdownOpen = false;

  constructor(private animalService: AnimalService) { }

  ngOnInit(): void {
    this.loadAnimals();
  }

typeLabels: { [key: number]: string } = {
  1: 'Dairy',
  2: 'NewBorn',
  0: 'Fattening'
};

genderLabels: { [key: number]: string } = {
  1: 'Female',
  0: 'Male'
};


  loadAnimals(): void {
  this.animalService.getAllAnimals().subscribe({
    next: (data) => {
      // تأكد من تحويل القيم إلى أرقام
      this.allAnimals = data.map(animal => ({
        ...animal,
        id: Number(animal.id),
        animalType: Number(animal.animalType),
        gender: Number(animal.gender),
         weightDate: animal.weightDate.split('T')[0]

      }));
      this.animals = [...this.allAnimals];
          this.filteredAnimals = [...this.animals];  // Initialize displayed animals with all animals
    },
    error: (error: Error) => {
      console.error('Error loading animals', error);
    }
  });
}


  searchAnimals(): void {
    if (!this.searchTerm.trim()) {
      this.animals = [...this.allAnimals];
      return;
    }
    const searchLower = this.searchTerm.toLowerCase();
    this.animals = this.allAnimals.filter(animal =>
      animal.code.toLowerCase().includes(searchLower) ||
      animal.noFamily.toLowerCase().includes(searchLower) ||
      animal.description.toLowerCase().includes(searchLower) ||
      animal.weight.toString().includes(searchLower)
    );
  }

  initAnimal(): Animal {
  return {
    id: 0,
    code: '',
    gender: 0,
    animalType: 0,
    weight: 0,
    weightDate: '',
    noFamily: '',
    description: '',
    dateOfBirth:''
  };
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
  this.selectedAnimalIds = checked ? this.filteredAnimals.map(a => a.id!) : [];
}


  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  applyFilter(type: 'herdNumber' | 'gender' | 'weight' | 'type' | 'all'): void {
    this.isFilterDropdownOpen = false;

    if (type === 'all') {
      this.animals = [...this.allAnimals];
      return;
    }

    this.animals = this.allAnimals.filter(animal => {
      switch (type) {
        case 'herdNumber':
          return animal.noFamily !== null && animal.noFamily !== undefined;
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
    this.searchAnimals();
  }

  openAddModal(): void {
    this.selectedAnimal = {
      id: 0,
      code: '',
      noFamily: '',
      animalType:0,
      weight: 0,
      weightDate: '',
      description: '',
      gender: 0,
      dateOfBirth:''
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
        noFamily: '',
        animalType: 0,
        weight: 0,
        weightDate: '',
        dateOfBirth: '',
        description: '',

        gender: 0
      };
    }
    this.showEditModal = true;
  }

openFatteningWeightModal(animal: Animal | null): void {
  if (animal) {
    this.selectedAnimal = { ...animal };
  } else {
    this.selectedAnimal = {
      id: 0,
      code: '',
      noFamily: '',
      animalType: 0,
      weight: 0,
      weightDate: '',
      description: '',
      gender: 0,
      dateOfBirth: ''
    };
    this.searchCode = '';
  }

  this.showFatteningWeightModal = true;
}

  openDeleteModal(): void {
    this.selectedAnimal = {
      id: 0,
      code: '',
      noFamily: '',
      animalType: 0,
      weight: 0,
      weightDate: '',
      description: '',
      gender: 0,
      dateOfBirth:''
    };
    this.showDeleteModal = true;
  }

  closeAllModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showFatteningWeightModal = false;
    this.showDeleteModal = false;

  }

addAnimal(): void {
  this.animalService.createAnimal(this.selectedAnimal).subscribe({
    next: () => {
      console.log('✔️ Animal added successfully');
      this.loadAnimals();
      this.closeAllModals();
    },
    error: (error) => {
      console.error('❌ Error adding animal:', error);
    }
  });
}

updateAnimal(): void {
  this.animalService.updateAnimal(this.selectedAnimal).subscribe({
    next: () => {
      console.log('✔️ Animal updated successfully');
      this.loadAnimals();
      this.closeAllModals();
    },
    error: (error) => {
      console.error('❌ Error updating animal:', error);
    }
  });
}
submitFatteningWeight(): void {
  const dto = {
    id: this.selectedAnimal.id,
    code: this.selectedAnimal.code,
    weight: this.selectedAnimal.weight,
    dateOfWeight: this.selectedAnimal.weightDate,
    description: this.selectedAnimal.description
  };

  this.animalService.updateFatteningWeight(dto).subscribe({
    next: () => {
      // ✅ تحديث القيم يدويًا بدل ما تستنى من الـ API
      const updatedAnimal = this.animals.find(a => a.id === dto.id);
      if (updatedAnimal) {
        updatedAnimal.weight = dto.weight;
        updatedAnimal.weightDate = dto.dateOfWeight;
        updatedAnimal.description = dto.description;
        updatedAnimal.code = dto.code;
      }


      this.closeAllModals();
    },
    error: (err) => {
      console.error('❌ Failed to save weight', err);
    }
  });
}
confirmDeleteAnimals(): void {
  if (this.selectedAnimalIds.length === 0) {
    alert('اختر حيوانًا أو أكثر للحذف.');
    return;
  }

  const deletes = this.selectedAnimalIds.map(id => this.animalService.deleteAnimal(id));
  forkJoin(deletes).subscribe({
    next: () => {
      this.loadAnimals();
      this.selectedAnimalIds = [];
       this.showDeleteModal = false;
    },
    error: err => console.error('حدث خطأ أثناء حذف الحيوانات:', err)
  });
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
              noFamily: '',
              animalType: 0,
              weight: 0,
              weightDate: '',
              dateOfBirth: '',
              description: '',

              gender: 0
            };
          }
        },
        error: (error) => {
          console.error('Error fetching animal:', error);
          // Reset form with empty data
          this.selectedAnimal = {
            id: 0,
            code: this.searchCode,
            noFamily: '',
            animalType:0,
            weight: 0,
            weightDate: '',
            dateOfBirth: '',
            description: '',

            gender: 0
          };
        }
      });
    } else {
      // If found in current list, use that data
      this.selectedAnimal = { ...foundAnimal };
    }
  }
}

