import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseModalComponent } from './close-modal.component';
import {MockTranslate} from '../_mocks/translate-mock.pipe';

describe('CloseModalComponent', () => {
  let component: CloseModalComponent;
  let fixture: ComponentFixture<CloseModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseModalComponent, MockTranslate ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
