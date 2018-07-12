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

  hasImage(){
    let img = false;
    if (this.message && this.message.quick_replies){
      this.message.quick_replies.forEach( m => {
        if (m.image_url) {
          img = true;
        }
      });
    }
    return img;
  }
  showCentered(){
    return (this.message && this.message.quick_replies.length === 2);
  }
  showScrollers(){
    return (this.message && this.message.quick_replies.length > 2);
  }

  scrollRight(){
    this.container.nativeElement.scrollLeft = this.container.nativeElement.scrollLeft + 200;
  }

  scrollLeft(){
    this.container.nativeElement.scrollLeft = this.container.nativeElement.scrollLeft - 200;
  }

}
