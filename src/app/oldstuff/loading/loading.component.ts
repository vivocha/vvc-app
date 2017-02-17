import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-loading',
  templateUrl: './loading.component.html'
})
export class LoadingComponent implements OnInit {

  @Input() type;
  @Output() abandon = new EventEmitter();
  constructor() { }
  close() { this.abandon.emit(); }

  ngOnInit() {
  }

}
