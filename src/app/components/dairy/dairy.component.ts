import { Component, OnInit } from '@angular/core';
import { DairyService, MilkCollection } from '../../services/dairy.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dairy',
  templateUrl: './dairy.component.html',
  styleUrls: ['./dairy.component.css']
})
export class DairyComponent implements OnInit {
  dairies: MilkCollection[] = [];
  filteredDairies: MilkCollection[] = [];
  selectedAnimalIds: number[] = [];
  selectedDairy: MilkCollection = this.initDairy();
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

  loadDairies(): void {
    this.dairyService.getDairies().subscribe({
      next: (data) => {
        console.log('Loaded dairies:', data);
        this.dairies = data.map(d => ({
          ...d,
          weightDate: d.weightDate?.split('T')[0] ?? '',
          dateFertilization: d.dateFertilization?.split('T')[0] ?? '',
          expectedDate: d.expectedDate?.split('T')[0] ?? ''
        }));
        this.filteredDairies = [...this.dairies];
      },
      error: err => console.error('Error loading dairies', err)
    });
  }

  initDairy(): MilkCollection {
    return {
      id: 0,
      code: '',
      type: 1,
      noFamily: '',
      milk: 0,
      fatPercentage: 0,
      weight: 0,
      weightDate: '',
      statuForitification: 0,
      dateFertilization: '',
      expectedDate: '',
      description: ''
    };
  }

  openAddModal(): void {
    this.selectedDairy = this.initDairy();
    this.searchCode = '';
    this.showAddModal = true;
  }

  openEditModal(animal: MilkCollection | null): void {
    if (animal) {
      this.selectedDairy = { ...animal };
      // تأكد من أن البيانات بالأرقام الصحيحة
      this.selectedDairy.type = Number(animal.type) || 1;
      this.selectedDairy.statuForitification = Number(animal.statuForitification) || 0;
      console.log('Opening edit modal for animal:', this.selectedDairy);
    }
    this.showEditModal = true;
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedDairy = this.initDairy();
    this.searchCode = '';
  }

  // ✅ إضافة Dairy جديد - تحديث إنتاج الحليب
  addDairy(): void {
    console.log('=== COMPONENT DEBUG ===');
    console.log('addDairy method called');
    console.log('Current selectedDairy:', this.selectedDairy);
    console.log('Current searchCode:', this.searchCode);
    console.log('Form validation check:');
    console.log('- Code:', this.selectedDairy.code, 'Valid:', !!this.selectedDairy.code?.trim());
    console.log('- Milk Production:', this.selectedDairy.milk, 'Valid:', !!(this.selectedDairy.milk && this.selectedDairy.milk > 0));
    console.log('- Fat Percentage:', this.selectedDairy.fatPercentage, 'Valid:', !!(this.selectedDairy.fatPercentage && this.selectedDairy.fatPercentage > 0));
    
    // التحقق من صحة البيانات
    if (!this.selectedDairy.code || !this.selectedDairy.code.trim()) {
      alert('يرجى إدخال كود الحيوان');
      console.log('Validation failed: missing code');
      return;
    }

    if (!this.selectedDairy.milk || this.selectedDairy.milk <= 0) {
      alert('يرجى إدخال كمية إنتاج الحليب');
      console.log('Validation failed: missing milk production');
      return;
    }

    if (!this.selectedDairy.fatPercentage || this.selectedDairy.fatPercentage <= 0) {
      alert('يرجى إدخال نسبة الدهون');
      console.log('Validation failed: missing fat percentage');
      return;
    }

    const dairyData = {
      code: this.selectedDairy.code.trim(),
      milkProduction: Number(this.selectedDairy.milk),
      fatPercentage: Number(this.selectedDairy.fatPercentage)
    };

    console.log('Submitting milk production data:', dairyData);
    console.log('About to call dairyService.addDairy');
    console.log('==============================');

    this.dairyService.addDairy(dairyData).subscribe({
      next: (response) => {
        console.log('=== SUCCESS RESPONSE ===');
        console.log('Milk production recorded successfully:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response));
        console.log('=======================');
        alert('تم تحديث بيانات إنتاج الحليب بنجاح');
        this.loadDairies(); // إعادة تحميل البيانات
        this.closeModals();
        this.selectedDairy = this.initDairy(); // إعادة تعيين النموذج
      },
      error: (err) => {
        console.error('=== UPDATE FAILED ===');
        console.error('Error updating milk production:', err);
        console.error('Error type:', typeof err);
        console.error('Error status:', err.status);
        console.error('Error statusText:', err.statusText);
        console.error('Error message:', err.message);
        console.error('Error error:', err.error);
        console.error('Error url:', err.url);
        console.error('Error name:', err.name);
        console.error('Full error object:', JSON.stringify(err, null, 2));
        console.error('==============================');
        
        let errorMessage = 'حدث خطأ أثناء تحديث بيانات إنتاج الحليب.';
        
        if (err.status === 400) {
          errorMessage = 'بيانات غير صحيحة. يرجى التحقق من الكود والبيانات.';
          console.error('Bad Request - Check the data being sent');
        } else if (err.status === 404) {
          errorMessage = 'الحيوان غير موجود. يرجى التحقق من الكود.';
          console.error('Not Found - Animal not found');
        } else if (err.status === 500) {
          errorMessage = 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
          console.error('Server Error - Backend issue');
        } else if (err.status === 0) {
          errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من الاتصال بالإنترنت.';
          console.error('Network Error - No connection');
        } else {
          console.error('Unknown error status:', err.status);
        }
        
        // عرض تفاصيل أكثر للمستخدم
        console.error('=== DETAILED ERROR INFO ===');
        console.error('Request data that failed:', {
          code: this.selectedDairy.code,
          milk: this.selectedDairy.milk,
          fatPercentage: this.selectedDairy.fatPercentage
        });
        console.error('==========================');
        
        alert(errorMessage);
      }
    });
  }

  updateDairy(): void {
    console.log('=== COMPONENT UPDATE DAIRY DEBUG ===');
    console.log('updateDairy method called');
    console.log('Selected dairy ID:', this.selectedDairy.id);
    console.log('Selected dairy data:', this.selectedDairy);
    
    if (!this.selectedDairy.id) {
      alert('لا يمكن تحديث البيانات بدون ID');
      console.log('Validation failed: missing ID');
      return;
    }

    console.log('About to call dairyService.updateDairy');
    console.log('==============================');

    this.dairyService.updateDairy(this.selectedDairy.id, this.selectedDairy).subscribe({
      next: (response) => {
        console.log('=== UPDATE SUCCESS ===');
        console.log('Dairy updated successfully:', response);
        console.log('Response type:', typeof response);
        console.log('Response keys:', Object.keys(response));
        console.log('=======================');
        alert('تم تحديث البيانات بنجاح');
        this.loadDairies();
        this.closeModals();
      },
      error: err => {
        console.error('=== UPDATE FAILED ===');
        console.error('Error updating dairy:', err);
        console.error('Error type:', typeof err);
        console.error('Error status:', err.status);
        console.error('Error statusText:', err.statusText);
        console.error('Error message:', err.message);
        console.error('Error error:', err.error);
        console.error('Error url:', err.url);
        console.error('Error name:', err.name);
        console.error('Full error object:', JSON.stringify(err, null, 2));
        console.error('==============================');
        
        let errorMessage = 'حدث خطأ أثناء تحديث البيانات.';
        
        if (err.status === 400) {
          errorMessage = 'بيانات غير صحيحة. يرجى التحقق من البيانات المدخلة.';
          console.error('Bad Request - Check the data being sent');
        } else if (err.status === 404) {
          errorMessage = 'البيانات غير موجودة. يرجى التحقق من الـ ID.';
          console.error('Not Found - Data not found');
        } else if (err.status === 500) {
          errorMessage = 'خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.';
          console.error('Server Error - Backend issue');
        } else if (err.status === 0) {
          errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من الاتصال بالإنترنت.';
          console.error('Network Error - No connection');
        } else {
          console.error('Unknown error status:', err.status);
        }
        
        // عرض تفاصيل أكثر للمستخدم
        console.error('=== DETAILED ERROR INFO ===');
        console.error('Request data that failed:', this.selectedDairy);
        console.error('==========================');
        
        alert(errorMessage);
      }
    });
  }

  deleteDairy(id: number): void {
    this.dairyService.deleteDairy(id).subscribe({
      next: () => {
        console.log('Dairy deleted successfully');
        this.loadDairies();
        this.closeModals();
      },
      error: err => {
        console.error('Error deleting dairy', err);
        alert('حدث خطأ أثناء حذف البيانات');
      }
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

    console.log('=== DELETE CONFIRMATION ===');
    console.log('Selected animals to delete:', this.selectedAnimalIds);
    console.log('Selected animals data:', this.filteredDairies.filter(a => this.selectedAnimalIds.includes(a.id!)));
    console.log('Available animals in filteredDairies:', this.filteredDairies.map(a => ({ id: a.id, code: a.code })));
    console.log('Available animals in dairies:', this.dairies.map(a => ({ id: a.id, code: a.code })));

    const deletes = this.selectedAnimalIds.map(id => {
      console.log('Creating delete request for ID:', id);
      return this.dairyService.deleteDairy(id);
    });
    
    forkJoin(deletes).subscribe({
      next: () => {
        console.log('=== DELETE SUCCESS ===');
        console.log('All selected animals deleted successfully');
        alert(`تم حذف ${this.selectedAnimalIds.length} حيوان بنجاح`);
        this.loadDairies();
        this.selectedAnimalIds = [];
        this.closeModals();
      },
      error: err => {
        console.error('=== DELETE FAILED ===');
        console.error('Error deleting animals:', err);
        console.error('Error status:', err.status);
        console.error('Error message:', err.message);
        
        let errorMessage = 'حدث خطأ أثناء حذف الحيوانات.';
        
        if (err.status === 404) {
          errorMessage = 'الحيوان غير موجود.';
        } else if (err.status === 500) {
          errorMessage = 'خطأ في الخادم. يرجى المحاولة مرة أخرى.';
        } else if (err.status === 0) {
          errorMessage = 'لا يمكن الاتصال بالخادم. تحقق من الاتصال بالإنترنت.';
        }
        
        alert(errorMessage);
      }
    });
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }

  applyFilter(type: 'herdNumber' | 'weight' | 'type' | 'milk' | 'all'): void {
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
          return animal.weight !== null && animal.weight !== undefined && animal.weight > 0;
        case 'type':
          return animal.type !== null && animal.type !== undefined;
        case 'milk':
          return animal.milk !== null && animal.milk !== undefined && animal.milk > 0;
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
    if (!this.searchCode.trim()) {
      alert('يرجى إدخال كود الحيوان');
      return;
    }

    console.log('Searching for animal with code:', this.searchCode);

    // البحث في البيانات المحملة أولاً
    let found = this.dairies.find(a =>
      a.code.toLowerCase() === this.searchCode.toLowerCase()
    );

    if (found) {
      console.log('Animal found in loaded data:', found);
      this.selectedDairy = { ...found };
      // تأكد من أن البيانات بالأرقام الصحيحة
      this.selectedDairy.type = Number(found.type) || 1;
      this.selectedDairy.statuForitification = Number(found.statuForitification) || 0;
      this.searchCode = '';
      alert('تم العثور على الحيوان بنجاح!');
    } else {
      // البحث في الـ API
      console.log('Animal not found in loaded data, searching API...');
      this.dairyService.getDairyById(+this.searchCode).subscribe({
        next: (animal) => {
          console.log('Animal found via API:', animal);
          this.selectedDairy = { ...animal };
          // تأكد من أن البيانات بالأرقام الصحيحة
          this.selectedDairy.type = Number(animal.type) || 1;
          this.selectedDairy.statuForitification = Number(animal.statuForitification) || 0;
          this.searchCode = '';
          
          // إضافة الحيوان للقائمة إذا لم يكن موجود
          if (!this.dairies.some(a => a.id === animal.id)) {
            this.dairies.push(animal);
            this.filteredDairies = [...this.dairies];
          }
          
          alert('تم العثور على الحيوان بنجاح!');
        },
        error: err => {
          console.error('Error fetching dairy:', err);
          alert('لم يتم العثور على حيوان بهذا الكود. يرجى التحقق من الكود والمحاولة مرة أخرى.');
          this.selectedDairy = this.initDairy();
        }
      });
    }
  }

  resetAnimalSearch(): void {
    this.selectedDairy = this.initDairy();
    this.searchCode = '';
    console.log('Animal search reset');
  }

  // ✅ مساعدة لتحويل النوع من رقم إلى اسم للعرض
  getTypeDisplayName(type: number): string {
    return this.dairyService.getTypeDisplayName(type);
  }

  // ✅ مساعدة لتحويل حالة التخصيب من رقم إلى اسم للعرض
  getFertilizationStatusDisplayName(status: number): string {
    return this.dairyService.getFertilizationStatusDisplayName(status);
  }
}
