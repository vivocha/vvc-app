import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-queue',
  templateUrl: './queue.component.html'
})
export class QueueComponent implements OnInit {

  @Input() type = '';
  @Output() leave = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
