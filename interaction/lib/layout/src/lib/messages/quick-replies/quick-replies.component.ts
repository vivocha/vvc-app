import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit,
  Output, ViewChild
} from '@angular/core';

@Component({
  selector: 'vvc-quick-replies',
  templateUrl: './quick-replies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickRepliesComponent implements OnInit, OnDestroy {

  @Input() message;
  @Output() action = new EventEmitter();
  @Output() scrollUpdate = new EventEmitter();
  @ViewChild('qrContainer') container: ElementRef;
  hasReplied = false;

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

  btnClicked(btn) {
    this.action.emit({ action: btn, msgId: this.message.id });
  }

  hasImage() {
    let img = false;
    if (this.message && this.message.quick_replies) {
      this.message.quick_replies.forEach( m => {
        if (m.image_url) {
          img = true;
        }
      });
    }
    return img;
  }
  showCentered() {
    return (this.message && this.message.quick_replies.length === 2);
  }
  showScrollers() {
    return (this.message && this.message.quick_replies.length > 2);
  }

  scrollRight() {
    this.scrollOffset = this.scrollOffset + 200;
  }

  scrollLeft() {
    this.scrollOffset = this.scrollOffset - 200;
  }

}
