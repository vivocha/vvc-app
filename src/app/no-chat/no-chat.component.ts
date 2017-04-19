import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'vvc-no-chat',
  templateUrl: './no-chat.component.html'
})
export class NoChatComponent implements OnInit {

  @Input() state;
  constructor() { }

  ngOnInit() {
  }

}
