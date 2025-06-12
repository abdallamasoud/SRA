import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewbornComponent } from './newborn.component';

describe('NewbornComponent', () => {
  let component: NewbornComponent;
  let fixture: ComponentFixture<NewbornComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewbornComponent]
    });
    fixture = TestBed.createComponent(NewbornComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
