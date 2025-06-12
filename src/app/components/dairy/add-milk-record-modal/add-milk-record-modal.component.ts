import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DairyService, Dairy, MilkRecord } from '../../../services/dairy.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-milk-record-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-milk-record-modal.component.html',
  styleUrls: ['./add-milk-record-modal.component.css']
})
export class AddMilkRecordModalComponent implements OnInit {
  @Input() dairy: Dairy | null = null;
  @Output() close = new EventEmitter<boolean>();

  milkRecordForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private dairyService: DairyService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.milkRecordForm = this.fb.group({
      milk: [null, [Validators.required, Validators.min(0)]],
      fatPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      date: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  onSubmit(): void {
    if (this.milkRecordForm.invalid || !this.dairy || !this.dairy.id) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.milkRecordForm.controls).forEach(key => {
        const control = this.milkRecordForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const newMilkRecord: MilkRecord = this.milkRecordForm.value;

    this.dairyService.addMilkRecord(this.dairy.id, newMilkRecord).subscribe({
      next: () => {
        this.isLoading = false;
        this.close.emit(true); // Refresh the list
      },
      error: (error) => {
        console.error('Error adding milk record', error);
        this.errorMessage = 'Failed to add milk record. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  closeModal(): void {
    this.close.emit(false); // Don't refresh the list
  }
}
