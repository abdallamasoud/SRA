import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

export interface DropdownOption {
  id: any;
  name: string;
}

@Component({
  selector: 'app-custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.css']
})
export class CustomDropdownComponent {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() label: string = '';
  @Input() selectedId: any = null;
  @Output() selectionChange = new EventEmitter<any>();

  isOpen = false;
  searchText = '';
  filteredOptions: DropdownOption[] = [];

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.filteredOptions = [...this.options];
  }

  ngOnChanges() {
    this.filteredOptions = [...this.options];
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchText = '';
      this.filterOptions();
    }
  }

  selectOption(option: DropdownOption) {
    this.selectedId = option.id;
    this.selectionChange.emit(option.id);
    this.isOpen = false;
  }

  onSearchChange() {
    this.filterOptions();
  }

  filterOptions() {
    if (!this.searchText.trim()) {
      this.filteredOptions = [...this.options];
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredOptions = this.options.filter(option =>
        option.name.toLowerCase().includes(searchLower)
      );
    }
  }

  getSelectedOptionName(): string {
    if (this.selectedId === null) return this.placeholder;
    const selected = this.options.find(option => option.id === this.selectedId);
    return selected ? selected.name : this.placeholder;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  clearSelection(event: Event) {
    event.stopPropagation();
    this.selectedId = null;
    this.selectionChange.emit(null);
  }
}
