import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncDcComponent } from './inc-dc.component';

describe('IncDcComponent', () => {
  let component: IncDcComponent;
  let fixture: ComponentFixture<IncDcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncDcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncDcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
