import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSettingListComponent } from './language-setting-list.component';

describe('LanguageSettingListComponent', () => {
  let component: LanguageSettingListComponent;
  let fixture: ComponentFixture<LanguageSettingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageSettingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSettingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
