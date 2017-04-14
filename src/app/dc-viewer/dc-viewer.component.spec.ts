import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DcViewerComponent } from './dc-viewer.component';

describe('DcViewerComponent', () => {
  let component: DcViewerComponent;
  let fixture: ComponentFixture<DcViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DcViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DcViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
