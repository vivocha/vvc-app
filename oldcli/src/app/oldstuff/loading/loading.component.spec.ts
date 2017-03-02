/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {DebugElement, Component} from '@angular/core';

import { LoadingComponent } from './loading.component';

@Component({
  template: `
    <vvc-loading id="vvc-loading"
               class="flex flex-column"
               *ngIf="loading"
               [type]="initialMedia"
               (abandon)="onAbandon()"></vvc-loading>`
})
class TestHostComponent {
  abandoned = false;
  loading =  true;
  initialMedia = 'chat';
  onAbandon() {
    this.abandoned = true;
  }
}

describe('LoadingComponent', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingComponent, TestHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
  });

  it('should not display the loading if loading is false', () => {
    hostComponent.loading = false;
    hostFixture.detectChanges();
    const loadingTemplate = hostFixture.debugElement.query(By.css('#vvc-loading'));
    expect(loadingTemplate).not.toBeTruthy();
  });

  it('should set abandoned when abandon is emitted', () => {
    hostFixture.detectChanges();
    const closeButton = hostFixture.debugElement.query(By.css('.vvc-close'));
    closeButton.triggerEventHandler('click', null);
    hostFixture.detectChanges();
    expect(hostComponent.abandoned).toBeTruthy();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should dislay the chat icon if type is set to chat', () => {
    component.type = 'chat';
    fixture.detectChanges();
    expect(component.type).toEqual('chat', 'not equal to chat');

    const icon = fixture.debugElement.query(By.css('.loading-type i'));
    expect(icon.attributes['class'].indexOf('vvc-comments') !== -1).toBeTruthy();

  });

  it('should dislay the video icon if type is set to video', () => {
    component.type = 'video';
    fixture.detectChanges();
    expect(component.type).toEqual('video', 'not equal to video');

    const icon = fixture.debugElement.query(By.css('.loading-type i'));
    expect(icon.attributes['class'].indexOf('vvc-video-camera') !== -1).toBeTruthy();

  });

  it('should call close method when close icon is clicked', () => {
    fixture.detectChanges();
    const closeButton = fixture.debugElement.query(By.css('.vvc-close'));
    const spy = spyOn(component, 'close');
    closeButton.triggerEventHandler('click', null);
    expect(spy).toHaveBeenCalled();
  });
});
