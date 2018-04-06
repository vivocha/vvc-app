import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-quick-replies',
  templateUrl: './quick-replies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickRepliesComponent {

  @Input() message;
  @Output() action = new EventEmitter();
  hasReplied = false;

  constructor(private cd: ChangeDetectorRef){}

  btnClicked(btn){
    this.action.emit({ action: btn, msgId: this.message.id });
  }

}
