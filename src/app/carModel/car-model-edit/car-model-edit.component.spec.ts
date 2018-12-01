import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarModelEditComponent } from './car-model-edit.component';

describe('CarModelEditComponent', () => {
  let component: CarModelEditComponent;
  let fixture: ComponentFixture<CarModelEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarModelEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarModelEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
