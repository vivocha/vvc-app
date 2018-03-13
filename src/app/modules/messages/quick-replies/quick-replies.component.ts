import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-quick-replies',
  templateUrl: './quick-replies.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickRepliesComponent {

  @Input() message;
  @Output() action = new EventEmitter();
  selectedOption;

  hasReplied(){
    return !!this.selectedOption;
  }

  btnClicked(btn){
    this.selectedOption = btn;
    this.action.emit(btn);
  }

}
