import { Component, OnInit } from '@angular/core';
import { ImmunizationRecord, ImmunizationRecordService } from '../../services/immunization-record.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-vaccination',
  templateUrl: './vaccination.component.html',
  styleUrls: ['./vaccination.component.css']
})
export class VaccineComponent implements OnInit {
  records: ImmunizationRecord[] = [];
  filteredRecords: ImmunizationRecord[] = [];


  selectedIds: number[] = [];
  selectedRecord: ImmunizationRecord = this.initRecord();
  searchTerm: string = '';
  isFilterDropdownOpen = false;
  showAddModal = false;
  showEditModal = false;
  showDeleteModal = false;

  constructor(private recordService: ImmunizationRecordService) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  initRecord(): ImmunizationRecord {
    return { name: '', type: '', dose: '', date: '' };
  }

  loadRecords(): void {
    this.recordService.getAll().subscribe({
      next: data => {
         this.records = data.map(record => ({
        ...record,
        date: record.date.split('T')[0] // قص التاريخ فقط
      }));
        this.applySearch();
      },
      error: err => console.error(err)
    });
  }

saveRecord(): void {
  const missingField = this.getMissingField(this.selectedRecord);
  if (missingField) {
    alert(`Please fill in the "${missingField}" field.`);
    return;
  }

  const isDuplicate = this.records.some(record =>
    record.name.trim().toLowerCase() === this.selectedRecord.name.trim().toLowerCase() &&
    record.type.trim().toLowerCase() === this.selectedRecord.type.trim().toLowerCase() &&
    record.dose.trim().toLowerCase() === this.selectedRecord.dose.trim().toLowerCase() &&
    record.date === this.selectedRecord.date
  );

  if (isDuplicate) {
    alert('العنصر موجود بالفعل.');
    return;
  }

  this.recordService.create(this.selectedRecord).subscribe({
    next: () => {
      this.loadRecords();
      this.closeAllModals();
    },
    error: err => console.error(err)
  });
}

private getMissingField(record: ImmunizationRecord): string | null {
  if (!record.name?.trim()) return 'Name';
  if (!record.type?.trim()) return 'Type';
  if (!record.dose?.trim()) return 'Dose';
  if (!record.date?.trim()) return 'Date';
  return null;
}


updateRecord(): void {
  const missingField = this.getMissingField(this.selectedRecord);
  if (missingField) {
    alert(`Please fill in the "${missingField}" field.`);
    return;
  }

  const isDuplicate = this.records.some(record =>
    record.id !== this.selectedRecord.id &&
    record.name.trim().toLowerCase() === this.selectedRecord.name.trim().toLowerCase() &&
    record.type.trim().toLowerCase() === this.selectedRecord.type.trim().toLowerCase() &&
    record.dose.trim().toLowerCase() === this.selectedRecord.dose.trim().toLowerCase() &&
    record.date === this.selectedRecord.date
  );

  if (isDuplicate) {
    alert('العنصر موجود بالفعل.');
    return;
  }

  this.recordService.update(this.selectedRecord).subscribe({
    next: () => {
      this.loadRecords();
      this.closeAllModals();
    },
    error: err => console.error(err)
  });
}


  openAddModal(): void {
    this.selectedRecord = this.initRecord();
    this.showAddModal = true;
  }

  openEditModal(): void {
      if (!this.selectedRecord.id) {
    alert('Please select a record first.');
    return;
  }
    this.showEditModal = true;
  }

  openDeleteModal(): void {
      if (!this.selectedRecord.id) {
    alert('Please select a record to delete.');
    return;
  }
    this.showDeleteModal = true;
  }


toggleAllSelections(event: any): void {
  const isChecked = event.target.checked;
  if (isChecked) {
    this.selectedIds = this.filteredRecords.map(r => r.id!);
  } else {
    this.selectedIds = [];
  }
}
toggleSelection(id: number): void {
  if (this.selectedIds.includes(id)) {
    this.selectedIds = this.selectedIds.filter(i => i !== id);
  } else {
    this.selectedIds.push(id);
  }
}
confirmDelete(): void {
  if (this.selectedIds.length === 0) {
    alert('Please select at least one record to delete.');
    return;
  }

  const deleteObservables = this.selectedIds.map(id => this.recordService.delete(id));
  forkJoin(deleteObservables).subscribe({
    next: () => {
      this.loadRecords();
      this.selectedIds = [];
      this.closeAllModals();
    },
    error: err => console.error('Error deleting records', err)
  });
}

  selectRecord(record: ImmunizationRecord): void {
  this.selectedRecord = { ...record };
}

  closeAllModals(): void {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedRecord = this.initRecord();

  }

  applyFilter(property: keyof ImmunizationRecord): void {
    this.filteredRecords = [...this.records].sort((a, b) =>
      (a[property] ?? '').toString().localeCompare((b[property] ?? '').toString())
    );
  }

  performSearch(): void {
    this.applySearch();
  }

  applySearch(): void {
    this.filteredRecords = this.records.filter(record =>
      !this.searchTerm || record.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

showDataForRecord(): void {
  const found = this.records.find(r => r.name === this.selectedRecord.name);
  if (found) {
    this.selectedRecord = { ...found };
  } else {
    alert('No record found with this name');
  }
}


  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }
}
