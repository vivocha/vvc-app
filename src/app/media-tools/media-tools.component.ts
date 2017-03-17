import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {VvcWidgetState} from '../core/core.interfaces';

@Component({
  selector: '[vvc-media-tools]',
  templateUrl: './media-tools.component.html',
  styleUrls: ['./media-tools.component.scss']
})
export class MediaToolsComponent implements OnInit {

  @Input() state: VvcWidgetState;
  @Output() hangup = new EventEmitter();
  @Output() addvideo = new EventEmitter();
  @Output() remvideo = new EventEmitter();
  @Output() maximize = new EventEmitter();
  @Output() minimize = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

}
