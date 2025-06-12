import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAnimalModalComponent } from './edit-animal-modal.component';

describe('EditAnimalModalComponent', () => {
  let component: EditAnimalModalComponent;
  let fixture: ComponentFixture<EditAnimalModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAnimalModalComponent]
    });
    fixture = TestBed.createComponent(EditAnimalModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
