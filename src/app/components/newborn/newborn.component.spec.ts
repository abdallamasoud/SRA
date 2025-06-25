import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewbornsComponent } from './newborn.component';

describe('NewbornComponent', () => {
  let component: NewbornsComponent;
  let fixture: ComponentFixture<NewbornsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewbornsComponent]
    });
    fixture = TestBed.createComponent(NewbornsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
