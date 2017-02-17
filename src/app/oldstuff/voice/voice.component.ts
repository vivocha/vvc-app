import {Component, OnInit, Input} from '@angular/core';
import {VvcMediaState} from '../core/core.interfaces';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'vvc-voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.scss']
})
export class VoiceComponent implements OnInit {
  @Input() mediaState: VvcMediaState;
  private audioEnabled = true;
  constructor(private sanitizer: DomSanitizer) { }
  getAudioTrack() {
    return (this.mediaState &&
    this.mediaState['Voice'] &&
    this.mediaState['Voice'].data &&
    this.mediaState['Voice'].data.rx_stream) ? this.sanitizer.bypassSecurityTrustUrl(this.mediaState['Voice'].data.rx_stream.url) : "";
  }
  getType() {
    let type = 'VOICE';
    if (this.mediaState.Video && this.mediaState.Video.rx) type = 'VIDEO';
    return type;
  }
  ngOnInit() {
  }

}
