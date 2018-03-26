import {ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'vvc-template-generic',
  templateUrl: './template-generic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateGenericComponent {

  @Input() message;
  @Output() action = new EventEmitter();
  @ViewChild('carousel') container: ElementRef;

  scrollRight(){
    this.container.nativeElement.scrollLeft = this.container.nativeElement.scrollLeft + 200;
  }

  scrollLeft(){
    this.container.nativeElement.scrollLeft = this.container.nativeElement.scrollLeft - 200;
  }
}
