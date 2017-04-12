import {Component, OnInit, Input, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'vvc-inc-dc',
  templateUrl: './inc-dc.component.html'
})
export class IncDcComponent implements OnInit {

  @Input() message;
  @Output() show = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
