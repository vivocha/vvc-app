import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'vvc-quick-message',
  templateUrl: './quick-message.component.html',
  styles: []
})
export class QuickMessageComponent implements OnInit {

  @Input() message;
  @Output() action = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  btnClicked(btn){
    this.action.emit(btn);
  }

}
