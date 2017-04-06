import {Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter} from '@angular/core';
import {VvcWidgetState} from '../core/core.interfaces';

@Component({
  selector: 'vvc-topbar',
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent implements OnInit {

  @Input() state: VvcWidgetState;
  @Output() close = new EventEmitter();
  @Output() upgrade = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  askForUpgrade(media) {
      if (!this.state[media] && !this.state.mediaOffering) {
          this.upgrade.emit(media.toUpperCase());
      }
  }
  canStartMediaRequest(media) {
      switch (media) {
          case 'voice':
              return this.state.canAddVoice &&
                     this.state.localCaps &&
                     this.state.localCaps.WebRTC &&
                     this.state.localCaps.WebRTC.AudioCapture &&
                     this.state.remoteCaps &&
                     this.state.remoteCaps.WebRTC &&
                     this.state.remoteCaps.WebRTC.AudioCapture &&
                     this.state.remoteCaps.MediaAvailability &&
                     this.state.remoteCaps.MediaAvailability.Voice;
          case 'video':
              return this.state.canAddVideo &&
                     this.state.localCaps &&
                     this.state.localCaps.WebRTC &&
                     this.state.localCaps.WebRTC.VideoCapture &&
                     this.state.remoteCaps &&
                     this.state.remoteCaps.WebRTC &&
                     this.state.remoteCaps.WebRTC.VideoCapture &&
                     this.state.remoteCaps.MediaAvailability &&
                     this.state.remoteCaps.MediaAvailability.Video;
      }
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
