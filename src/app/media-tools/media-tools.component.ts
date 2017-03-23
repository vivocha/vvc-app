import {Component, OnInit, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {VvcWidgetState} from '../core/core.interfaces';

@Component({
  selector: '[vvc-media-tools]',
  templateUrl: './media-tools.component.html',
  styleUrls: ['./media-tools.component.scss']
})
export class MediaToolsComponent implements OnInit, OnDestroy {

  @Input() state: VvcWidgetState;
  @Output() hangup = new EventEmitter();
  @Output() addvideo = new EventEmitter();
  @Output() remvideo = new EventEmitter();
  @Output() maximize = new EventEmitter();
  @Output() minimize = new EventEmitter();
  callInterval;
  callTime = '00:00:00';
  constructor() { }

  ngOnInit() {
    console.log('media tool init');
    let localTime = 0;
    this.callInterval = setInterval(() => {
      localTime++;
      const date = new Date(null);
      date.setSeconds(localTime);
      this.callTime = date.toISOString().substr(11, 8);
    }, 1000);
  }
  ngOnDestroy() {
    console.log('destroying media tools, should stop the timer');
    clearInterval(this.callInterval);
  }

}
