import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'vvc-quick-message',
  templateUrl: './quick-message.component.html',
  styles: []
})
export class QuickMessageComponent implements OnInit {

  @Input() message;
  @Output() action = new EventEmitter();
  selectedOption;
  constructor() { }

  ngOnInit() {
  }

  btnClicked(btn){
    this.selectedOption = btn;
    this.action.emit(btn);
  }

  hasReplied(){
    return !!this.selectedOption;
  }

}
