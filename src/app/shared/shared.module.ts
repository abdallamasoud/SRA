import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomDropdownComponent } from './custom-dropdown/custom-dropdown.component';

@NgModule({
  declarations: [
    CustomDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [
    CustomDropdownComponent
  ]
})
export class SharedModule { }
