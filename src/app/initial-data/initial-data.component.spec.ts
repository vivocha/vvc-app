import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialDataComponent } from './initial-data.component';

describe('InitialDataComponent', () => {
  let component: InitialDataComponent;
  let fixture: ComponentFixture<InitialDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
