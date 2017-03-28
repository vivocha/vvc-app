import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'vvc-queue',
  templateUrl: './queue.component.html'
})
export class QueueComponent implements OnInit {

  @Input() type = '';
  constructor() { }

  ngOnInit() {
  }

}
