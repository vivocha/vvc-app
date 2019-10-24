import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy, OnInit,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'vvc-template-generic',
  templateUrl: './template-generic.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateGenericComponent implements OnInit, OnDestroy {

  @Input() message;
  @Output() action = new EventEmitter();
  @Output() scrollUpdate = new EventEmitter();
  @ViewChild('carousel') container: ElementRef;

  scrollOffset = 0;
  transition = 'none';

  constructor() {}

  ngOnInit() {
    if (this.message) {
      this.scrollOffset = this.message.scrollLeft;
      this.transition = 'smooth';
    }
  }

  ngOnDestroy() {
    if (this.scrollOffset !== this.message.scrollLeft) {
      this.scrollUpdate.emit({scrollLeft: this.scrollOffset, messageId: this.message.id});
    }
  }

  scrollRight() {
    this.scrollOffset = this.scrollOffset + 260;
  }

  scrollLeft() {
    this.scrollOffset = this.scrollOffset - 260;
  }

  defaultAction(elem) {
    if (elem.default_action) {
      this.action.emit(elem.default_action);
    }
  }
}
