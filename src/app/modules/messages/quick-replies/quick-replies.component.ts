import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input,
  Output, ViewChild
} from '@angular/core';

@Component({
  selector: 'vvc-quick-replies',
  templateUrl: './quick-replies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickRepliesComponent {

  @Input() message;
  @Output() action = new EventEmitter();
  @ViewChild('qrContainer') container: ElementRef;
  hasReplied = false;

  constructor(private cd: ChangeDetectorRef){}

  btnClicked(btn){
    this.action.emit({ action: btn, msgId: this.message.id });
  }

  scrollRight(){
    this.container.nativeElement.scrollLeft = this.container.nativeElement.scrollLeft + 200;
  }

  scrollLeft(){
    this.container.nativeElement.scrollLeft = this.container.nativeElement.scrollLeft - 200;
  }

}
