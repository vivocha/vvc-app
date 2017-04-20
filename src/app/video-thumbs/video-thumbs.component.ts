import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'vvc-video-thumbs',
  templateUrl: './video-thumbs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoThumbsComponent implements OnInit {

  @Input() state;
  @Output() maximize = new EventEmitter();
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  trustedSrc(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
