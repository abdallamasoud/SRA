import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DairyService } from '../../services/dairy.service';
import { Dairy } from '../../services/dairy.service';

@Component({
  selector: 'app-dairy',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dairy.component.html',
  styleUrls: ['./dairy.component.css']
})
export class DairyComponent implements OnInit {
  dairyRecords: Dairy[] = [];
  selectedDairy: Dairy = this.initializeDairy();
  filteredDairy: Dairy[] = [];
  searchTerm: string = '';
  isFilterDropdownOpen = false;

  // Modal states
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showRecordMilkModal = false;

  constructor(private dairyService: DairyService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.loadDairyRecords();
  }

  initializeDairy(): Dairy {
    return {
      code: '',
      date: '',
      morningQuantity: 0,
      eveningQuantity: 0,
      totalQuantity: 0,
      notes: ''
    };
  }

  loadDairyRecords(): void {
    this.dairyService.getAllDairyRecords().subscribe({
      next: (data) => {
        this.dairyRecords = data;
        this.filteredDairy = [...this.dairyRecords];
      },
      error: (error: Error) => {
        console.error('Error loading dairy records', error);
      }
    });
  }

  performSearch(): void {
    this.filteredDairy = this.dairyRecords.filter(record =>
      record.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      record.date.includes(this.searchTerm)
    );
  }

  toggleFilterDropdown(event: Event): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
    event.stopPropagation(); // Prevent document click from immediately closing it
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    // Close the filter dropdown if the click is outside its container
    if (!this.elementRef.nativeElement.querySelector('.filter-dropdown-container')?.contains(event.target)) {
      this.isFilterDropdownOpen = false;
    }
  }

  applyFilter(filterType: string): void {
    console.log(`Applying filter: ${filterType}`);
    this.isFilterDropdownOpen = false;

    if (filterType === 'herdNumber') {
      this.filteredDairy = this.dairyRecords.filter(record => record.herdNumber !== null && record.herdNumber !== undefined);
    } else if (filterType === 'weight') {
      this.filteredDairy = this.dairyRecords.filter(record => record.weight !== null && record.weight !== undefined);
    } else if (filterType === 'type') {
      this.filteredDairy = this.dairyRecords.filter(record => record.type !== null && record.type !== undefined && record.type !== '');
    }
  }

  openAddModal(): void {
    this.selectedDairy = this.initializeDairy();
    this.showAddModal = true;
  }

  openEditModal(dairy: Dairy | null): void {
    if (dairy) {
      this.selectedDairy = { ...dairy };
    } else {
      this.selectedDairy = this.initializeDairy();
    }
    this.showEditModal = true;
  }

  openDeleteModal(): void {
    this.selectedDairy = this.initializeDairy();
    this.showDeleteModal = true;
  }

  openRecordMilkModal(): void {
    this.selectedDairy = this.initializeDairy();
    this.showRecordMilkModal = true;
  }

  closeAllModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.showRecordMilkModal = false;
    this.selectedDairy = this.initializeDairy();
  }

  submitAddDairy(): void {
    this.selectedDairy.totalQuantity = this.selectedDairy.morningQuantity + this.selectedDairy.eveningQuantity;
    this.dairyService.createDairyRecord(this.selectedDairy).subscribe({
      next: (newRecord) => {
        console.log('Dairy record added successfully', newRecord);
        this.loadDairyRecords();
    this.closeAllModals();
      },
      error: (error: Error) => {
        console.error('Error adding dairy record:', error);
        alert(`Failed to add dairy record: ${error.message || 'Unknown error'}`);
      }
    });
  }

  submitUpdateDairy(): void {
    this.selectedDairy.totalQuantity = this.selectedDairy.morningQuantity + this.selectedDairy.eveningQuantity;
    this.dairyService.updateDairyRecord(this.selectedDairy).subscribe({
      next: (updatedRecord) => {
        console.log('Dairy record updated successfully', updatedRecord);
        this.loadDairyRecords();
    this.closeAllModals();
      },
      error: (error: Error) => {
        console.error('Error updating dairy record:', error);
        alert(`Failed to update dairy record: ${error.message || 'Unknown error'}`);
      }
    });
  }

  submitRecordMilkProduction(): void {
    this.selectedDairy.totalQuantity = this.selectedDairy.morningQuantity + this.selectedDairy.eveningQuantity;
    console.log('Submitting milk production record:', this.selectedDairy);
    this.closeAllModals();
    alert('Milk production record saved!');
  }

  confirmDeleteDairy(): void {
    if (this.selectedDairy.id) {
      this.dairyService.deleteDairyRecord(this.selectedDairy.id).subscribe({
        next: () => {
          console.log('Dairy record deleted successfully');
          this.loadDairyRecords();
          this.closeAllModals();
        },
        error: (error: Error) => {
          console.error('Error deleting dairy record:', error);
          alert(`Failed to delete dairy record: ${error.message || 'Unknown error'}`);
        }
      });
    }
  }
}
