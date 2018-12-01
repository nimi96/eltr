import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmspageListComponent } from './cmspage-list.component';

describe('CmspageListComponent', () => {
  let component: CmspageListComponent;
  let fixture: ComponentFixture<CmspageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmspageListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmspageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
