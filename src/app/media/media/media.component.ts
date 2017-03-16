import {Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core';
import {VvcWidgetState} from '../../core/core.interfaces';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'vvc-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaComponent implements OnInit {

  @Input() state: VvcWidgetState;
  @Output() hangup = new EventEmitter();
  @Output() addvideo = new EventEmitter();
  @Output() remvideo = new EventEmitter();
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  trustedSrc(url) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

}
