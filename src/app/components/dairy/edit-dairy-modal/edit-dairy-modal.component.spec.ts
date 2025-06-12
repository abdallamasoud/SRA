import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDairyModalComponent } from './edit-dairy-modal.component';

describe('EditDairyModalComponent', () => {
  let component: EditDairyModalComponent;
  let fixture: ComponentFixture<EditDairyModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDairyModalComponent]
    });
    fixture = TestBed.createComponent(EditDairyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
