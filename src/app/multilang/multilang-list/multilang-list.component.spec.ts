import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilangListComponent } from './multilang-list.component';

describe('MultilangListComponent', () => {
  let component: MultilangListComponent;
  let fixture: ComponentFixture<MultilangListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultilangListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilangListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
