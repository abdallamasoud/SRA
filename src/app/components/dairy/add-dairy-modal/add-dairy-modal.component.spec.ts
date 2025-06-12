import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDairyModalComponent } from './add-dairy-modal.component';

describe('AddDairyModalComponent', () => {
  let component: AddDairyModalComponent;
  let fixture: ComponentFixture<AddDairyModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDairyModalComponent]
    });
    fixture = TestBed.createComponent(AddDairyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
