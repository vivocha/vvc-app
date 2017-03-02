import {Component, OnInit, Input, ChangeDetectionStrategy} from '@angular/core';
import {VvcMediaState} from '../core/core.interfaces';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'vvc-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoComponent implements OnInit {

  @Input() mediaState: VvcMediaState;
  constructor(private sanitizer: DomSanitizer) { }
  getLocalVideo() {
    return (this.mediaState &&
    this.mediaState['Video'] &&
    this.mediaState['Video'].data &&
    this.mediaState['Video'].data.tx_stream &&
    this.mediaState['Video'].data.tx_stream.url) ? this.sanitizer.bypassSecurityTrustUrl(this.mediaState['Video'].data.tx_stream.url) : "";
  }
  getRemoteVideo() {
    return (this.mediaState &&
    this.mediaState['Video'] &&
    this.mediaState['Video'].data &&
    this.mediaState['Video'].data.rx_stream &&
    this.mediaState['Video'].data.rx_stream.url) ? this.sanitizer.bypassSecurityTrustUrl(this.mediaState['Video'].data.rx_stream.url) : "";

  }
  ngOnInit() {
  }

}
