import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CmspageAddComponent } from './cmspage-add.component';

describe('CmspageAddComponent', () => {
  let component: CmspageAddComponent;
  let fixture: ComponentFixture<CmspageAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CmspageAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CmspageAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
