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
    dob:''
  };

  showAddModal = false;
  showEditModal = false;
  showFatteningWeightModal = false;
  showDeleteModal = false;
  showAnimalDetailsModal = false;
  selectedAnimalDetails: any = null;

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
  this.animalService.getAllAnimalsWithLastWeight().subscribe({
    next: (data) => {
      // تأكد من تحويل القيم إلى أرقام
      this.allAnimals = data.map(animal => ({
        ...animal,
        id: Number(animal.id),
        animalType: Number(animal.animalType),
        gender: Number(animal.gender),
        weightDate: animal.weightDate?.split('T')[0] || '',
        // استخدام آخر وزن للعرض
        displayWeight: animal.displayWeight || animal.weight,
        displayWeightDate: animal.displayWeightDate || animal.weightDate?.split('T')[0] || ''
      }));
      this.animals = [...this.allAnimals];
      this.filteredAnimals = [...this.animals];  // Initialize displayed animals with all animals
      console.log('Loaded animals with last weight:', this.allAnimals);
      
      // محاولة تحميل آخر وزن لكل حيوان بشكل منفصل
      this.loadLastWeightsForAllAnimals();
    },
    error: (error: Error) => {
      console.error('Error loading animals', error);
    }
  });
}

// دالة جديدة لتحميل آخر وزن لكل حيوان
loadLastWeightsForAllAnimals(): void {
  this.allAnimals.forEach(animal => {
    this.animalService.getLastWeightFromHistory(animal.id).subscribe({
      next: (lastWeight) => {
        if (lastWeight) {
          // تحديث البيانات المحلية بآخر وزن
          const animalIndex = this.allAnimals.findIndex(a => a.id === animal.id);
          if (animalIndex !== -1) {
            this.allAnimals[animalIndex].displayWeight = lastWeight.weight;
            this.allAnimals[animalIndex].displayWeightDate = lastWeight.dateOfWeight?.split('T')[0] || '';
            
            // تحديث الجدول المعروض
            this.animals = [...this.allAnimals];
            this.filteredAnimals = [...this.animals];
          }
        }
      },
      error: (error) => {
        console.error(`Error loading last weight for animal ${animal.id}:`, error);
      }
    });
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
    dob:''
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
      dob:''
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
        dob: '',
        description: '',

        gender: 0
      };
    }
    this.showEditModal = true;
  }

openFatteningWeightModal(animal: Animal | null): void {
  this.closeAllModals();
  
  // دائماً نبدأ بمودال فاضي، حتى لو تم تمرير حيوان
  this.selectedAnimal = this.initAnimal();
  this.searchCode = ''; // إفراغ كود البحث أيضاً
  
  this.showFatteningWeightModal = true;
}

closeFatteningWeightModal(): void {
  this.showFatteningWeightModal = false;
  this.selectedAnimal = this.initAnimal();
  this.searchCode = '';
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
      dob:''
    };
    this.showDeleteModal = true;
  }

  closeAllModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showFatteningWeightModal = false;
    this.showDeleteModal = false;
    this.showAnimalDetailsModal = false;
    
    // إفراغ البيانات عند إغلاق جميع المودالات
    this.selectedAnimal = this.initAnimal();
    this.searchCode = '';
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
  // التحقق من وجود ID صحيح
  if (!this.selectedAnimal.id || this.selectedAnimal.id === 0) {
    alert('خطأ: لم يتم تحديد حيوان صحيح. يرجى البحث عن الحيوان مرة أخرى.');
    return;
  }

  // البحث عن الحيوان في القائمة المحلية للحصول على البيانات الكاملة
  const fullAnimalData = this.allAnimals.find(animal => animal.id === this.selectedAnimal.id);
  
  if (!fullAnimalData) {
    alert('لم يتم العثور على بيانات الحيوان. يرجى المحاولة مرة أخرى.');
    return;
  }

  console.log('Selected animal ID:', this.selectedAnimal.id);
  console.log('Selected animal code:', this.selectedAnimal.code);
  console.log('Full animal data:', fullAnimalData);

  // تنسيق التاريخ للباك إند (ISO format)
  const formattedDate = this.selectedAnimal.weightDate ? new Date(this.selectedAnimal.weightDate).toISOString() : '';

  // دمج البيانات الجديدة مع البيانات الموجودة
  const dto = {
    id: this.selectedAnimal.id,
    code: this.selectedAnimal.code,
    weight: this.selectedAnimal.weight,
    dateOfWeight: formattedDate,
    description: this.selectedAnimal.description
  };

  console.log('Sending data to backend:', dto);
  console.log('PATCH URL will be:', `https://sra.runasp.net/api/Animal/${this.selectedAnimal.id}`);

  this.animalService.updateFatteningWeight(dto).subscribe({
    next: (response) => {
      console.log('Success response:', response);
      // ✅ إعادة تحميل البيانات من الباك إند بدلاً من التحديث اليدوي
      this.loadAnimals();
      
      // إشعار نجاح للمستخدم
      alert('تم تحديث وزن الحيوان بنجاح!');
      
      // إفراغ البيانات وإغلاق المودال
      this.selectedAnimal = this.initAnimal();
      this.searchCode = '';
      this.closeAllModals();
    },
    error: (err) => {
      console.error('❌ Failed to save weight', err);
      console.error('Error status:', err.status);
      console.error('Error message:', err.message);
      console.error('Error details:', err.error);
      
      let errorMessage = 'حدث خطأ أثناء تحديث وزن الحيوان.';
      if (err.status === 400) {
        errorMessage = 'بيانات غير صحيحة. يرجى التحقق من المدخلات.';
      } else if (err.status === 404) {
        errorMessage = `لم يتم العثور على الحيوان بالـ ID: ${this.selectedAnimal.id}. يرجى التأكد من صحة الكود.`;
      } else if (err.status === 500) {
        errorMessage = 'خطأ في الخادم. يرجى المحاولة مرة أخرى.';
      }
      
      alert(errorMessage);
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
      alert('يرجى إدخال كود الحيوان');
      return;
    }

    console.log('Searching for animal with code:', this.searchCode.trim());

    // البحث في الباك إند مباشرة بالكود
    this.animalService.getAnimalByCode(this.searchCode.trim()).subscribe({
      next: (animal) => {
        console.log('Animal found in backend:', animal);
        this.selectedAnimal = { ...animal };
        if (!this.showFatteningWeightModal) {
          this.showEditModal = true;
        }
        // تحديث البيانات المحلية
        this.loadAnimals();
      },
      error: (error) => {
        console.error('Error fetching animal by code:', error);
        
        // إذا فشل البحث في الباك إند، جرب البحث في البيانات المحلية
        const foundAnimal = this.allAnimals.find(animal => 
          animal.code.toLowerCase() === this.searchCode.trim().toLowerCase()
        );

        if (foundAnimal) {
          console.log('Animal found in local data:', foundAnimal);
          this.selectedAnimal = { ...foundAnimal };
          if (!this.showFatteningWeightModal) {
            this.showEditModal = true;
          }
        } else {
          alert('لم يتم العثور على حيوان بهذا الكود في النظام');
        }
      }
    });
  }

  openAnimalDetailsModal(animal: Animal): void {
    // جلب بيانات الحيوان التفصيلية من الباك اند
    this.animalService.getAnimalById(animal.id!).subscribe({
      next: (data: any) => {
        this.selectedAnimalDetails = data;
        this.showAnimalDetailsModal = true;
      },
      error: (error) => {
        console.error('Error fetching animal details:', error);
        // إذا فشل API، استخدم البيانات المحلية
        this.selectedAnimalDetails = animal;
        this.showAnimalDetailsModal = true;
      }
    });
  }

  closeAnimalDetailsModal(): void {
    this.showAnimalDetailsModal = false;
    this.selectedAnimalDetails = null;
  }

  getTypeLabel(animalType: string | number): string {
    if (typeof animalType === 'number') {
      return this.typeLabels[animalType] || String(animalType);
    }
    if (typeof animalType === 'string') {
      switch (animalType.toLowerCase()) {
        case 'milking':
          return 'Dairy';
        case 'fattening':
          return 'Fattening';
        case 'newborn':
          return 'NewBorn';
        default:
          return animalType;
      }
    }
    return '';
  }
}

