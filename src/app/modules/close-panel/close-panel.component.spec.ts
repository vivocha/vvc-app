import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosePanelComponent } from './close-panel.component';

describe('ClosePanelComponent', () => {
  let component: ClosePanelComponent;
  let fixture: ComponentFixture<ClosePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
