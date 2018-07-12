import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecontactFormComponent } from './recontact-form.component';

describe('RecontactFormComponent', () => {
  let component: RecontactFormComponent;
  let fixture: ComponentFixture<RecontactFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecontactFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecontactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
