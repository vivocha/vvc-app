import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';

import {VvcWidgetState} from '../core/core.interfaces';

declare var vivocha: any;

@Component({
  selector: 'vvc-topbar',
  templateUrl: './topbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopbarComponent {

  @Input() state: VvcWidgetState;
  @Input() variables;
  @Output() close = new EventEmitter();
  @Output() minimize = new EventEmitter();
  @Output() upgrade = new EventEmitter();
  constructor() { }

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
  drag($event) {
    const mouseMove$ = Observable.fromEvent(document, 'mousemove');
    const mouseUp$ = Observable.fromEvent(document, 'mouseup');
    mouseMove$
      .takeUntil(mouseUp$)
      .subscribe(evt => {
        if (this.variables.canBeDragged) { // can be dragged
          vivocha.pageRequest('move', {
            top: evt['movementY'],
            left: evt['movementX']
          });
        } else {
          // do nothing;
        }
      }, err => {}, () => {
        //this.dragWindow();
      });
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
                : this.variables.companyLogoUrl;
  }
}
