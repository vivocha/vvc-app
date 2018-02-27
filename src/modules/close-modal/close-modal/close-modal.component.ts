import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-close-modal',
  templateUrl: './close-modal.component.html'
})
export class CloseModalComponent implements OnInit {

  @Output() close = new EventEmitter();
  @Output() cancel = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
