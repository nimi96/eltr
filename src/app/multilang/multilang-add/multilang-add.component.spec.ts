import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilangAddComponent } from './multilang-add.component';

describe('MultilangAddComponent', () => {
  let component: MultilangAddComponent;
  let fixture: ComponentFixture<MultilangAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultilangAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilangAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
