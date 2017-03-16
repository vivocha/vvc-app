import {Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessagesComponent implements OnInit {

  @Input() messages;
  @Output() rejectOffer = new EventEmitter();
  @Output() acceptOffer = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
