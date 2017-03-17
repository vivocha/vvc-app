import {Component, OnInit, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {VvcWidgetState} from '../core/core.interfaces';

@Component({
  selector: '[vvc-video-wrapper]',
  templateUrl: './video-wrapper.component.html',
  styleUrls: ['./video-wrapper.component.scss']
})
export class VideoWrapperComponent implements OnInit {

  @Input() state: VvcWidgetState;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  trustedSrc(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
