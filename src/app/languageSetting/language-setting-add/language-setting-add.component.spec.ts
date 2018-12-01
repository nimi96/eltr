import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageSettingAddComponent } from './language-setting-add.component';

describe('LanguageSettingAddComponent', () => {
  let component: LanguageSettingAddComponent;
  let fixture: ComponentFixture<LanguageSettingAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageSettingAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageSettingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
