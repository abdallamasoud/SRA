import { Component, OnInit } from '@angular/core';
import { Animal } from '../../services/animal.service';
import { NewbornService } from '../../services/new-born.service';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-newborns',
  templateUrl: './newborn.component.html',
  styleUrls: ['./newborn.component.css']
})
export class NewbornsComponent implements OnInit {
  newborns: Animal[] = [];
  filteredNewborns: Animal[] = [];
  selectedAnimalIds: number[] = [];
  selectedNewborn: Animal = this.initAnimal();
  searchTerm: string = '';
  searchCode: string = '';
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  isFilterDropdownOpen = false;


  constructor(private newbornService: NewbornService) {}

  ngOnInit(): void {
    this.loadNewborns();
  }

  genderLabels: { [key: number]: string } = {
    1: 'Female',
    0: 'Male'
  };

  loadNewborns(): void {
    this.newbornService.getNewborns().subscribe({
      next: (data) => {
        this.newborns = data.map(a => ({
          ...a,
          id: Number(a.id),
          gender: Number(a.gender),
          animalType: Number(a.animalType),
          weightDate: a.weightDate?.split('T')[0] ?? '',
          dateOfBirth: a.dateOfBirth?.split('T')[0] ?? ''
        }));
        this.filteredNewborns = [...this.newborns];
      },
      error: err => console.error('Error loading newborns', err)
    });
  }

  searchNewborns(): void {
    if (!this.searchTerm.trim()) {
      this.filteredNewborns = [...this.newborns];
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredNewborns = this.newborns.filter(a =>
      a.code.toLowerCase().includes(searchLower) ||
      a.noFamily.toLowerCase().includes(searchLower) ||
      a.description.toLowerCase().includes(searchLower) ||
      a.weight.toString().includes(searchLower)
    );
  }

  initAnimal(): Animal {
    return {
      id: 0,
      code: '',
      noFamily: '',
      animalType: 2, // newborn
      weight: 0,
      weightDate: '',
      description: '',
      gender: 0,
      dateOfBirth: ''
    };
  }

  openAddModal(): void {
    this.selectedNewborn = this.initAnimal();
    this.showAddModal = true;
  }
 openDeleteModal(): void {
  this.showDeleteModal = true;
}

    openEditModal(animal: Animal | null): void {
    if (animal) {
      this.selectedNewborn = { ...animal };
    } else {
      this.selectedNewborn = {
        id: 0,
        code: '',
        noFamily: '',
        animalType: 2,
        weight: 0,
        weightDate: '',
        dateOfBirth: '',
        description: '',

        gender: 0
      };
    }
    this.showEditModal = true;
  }


  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
  }



  updateNewborn(): void {
    this.newbornService.updateNewborn(this.selectedNewborn).subscribe({
      next: () => {
        this.loadNewborns();
        this.closeModals();
      },
      error: err => console.error('Error updating newborn', err)
    });
  }

  deleteNewborn(id: number): void {
    this.newbornService.deleteNewborn(id).subscribe({
      next: () => {
        this.loadNewborns();
        this.closeModals();
      },
      error: err => console.error('Error deleting newborn', err)
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
    this.selectedAnimalIds = checked ? this.filteredNewborns.map(a => a.id!) : [];
  }

  confirmDeleteNewborns(): void {
    if (this.selectedAnimalIds.length === 0) {
      alert('اختر حيوانًا أو أكثر للحذف.');
      return;
    }

    const deletes = this.selectedAnimalIds.map(id => this.newbornService.deleteNewborn(id));
    forkJoin(deletes).subscribe({
      next: () => {
        this.loadNewborns();
        this.selectedAnimalIds = [];
        this.closeModals();
      },
      error: err => console.error('حدث خطأ أثناء حذف الأبناء:', err)
    });
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  applyFilter(type: 'herdNumber' | 'gender' | 'weight' | 'all'): void {
    this.isFilterDropdownOpen = false;

    if (type === 'all') {
      this.filteredNewborns = [...this.newborns];
      return;
    }

    this.filteredNewborns = this.newborns.filter(animal => {
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

    this.searchNewborns();
  }
   findAnimalByCode(): void {
    if (!this.searchCode.trim()) {
      return;
    }

    // First try to find in the current animals list
    let foundAnimal = this.filteredNewborns.find(animal =>
      animal.code.toLowerCase() === this.searchCode.toLowerCase()
    );

    // If not found in current list, try to fetch from server
    if (!foundAnimal) {
      this.newbornService.getNewbornById(parseInt(this.searchCode)).subscribe({
        next: (newborns) => {
          if (newborns) {
            this.selectedNewborn = { ...newborns };
            // Add to local list if not already there
            if (!this.filteredNewborns.some(a => a.id === newborns.id)) {
              this.filteredNewborns.push(newborns);
            }
          } else {
            console.log('Animal not found');
            // Reset form with empty data
            this.selectedNewborn = {
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
          this.selectedNewborn = {
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
      this.selectedNewborn = { ...foundAnimal };
    }
  }
}
