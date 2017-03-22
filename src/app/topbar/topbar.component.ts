import {Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import {VvcWidgetState} from '../core/core.interfaces';

@Component({
  selector: 'vvc-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit {

  @Input() state: VvcWidgetState;
  @Output() close = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  getAgentName() {
    return (this.state.agent && this.state.agent.nick) ? this.state.agent.nick : 'nonick';
  }
  getAvatar() {
    return (this.state.agent &&
            this.state.agent.avatar &&
            this.state.agent.avatar.images &&
            this.state.agent.avatar.images[0] &&
            this.state.agent.avatar.images[0].file &&
            this.state.agent.avatar.base_url) ? this.state.agent.avatar.base_url + this.state.agent.avatar.images[0].file
                : 'assets/acct-img.png';
  }
}
