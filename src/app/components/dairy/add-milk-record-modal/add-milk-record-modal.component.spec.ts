import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMilkRecordModalComponent } from './add-milk-record-modal.component';

describe('AddMilkRecordModalComponent', () => {
  let component: AddMilkRecordModalComponent;
  let fixture: ComponentFixture<AddMilkRecordModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddMilkRecordModalComponent]
    });
    fixture = TestBed.createComponent(AddMilkRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
