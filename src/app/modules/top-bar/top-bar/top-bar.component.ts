import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-top-bar',
  templateUrl: './top-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBarComponent{

  @Input() context;
  @Output() onMinimize = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Output() onRemove = new EventEmitter();

  isMenuVisible = false;
  avatarSrc;
  title;
  subtitle;

  constructor(private cd: ChangeDetectorRef){}

  closeMenu(){
    this.isMenuVisible = false;
  }
  hasMenu(){
    return (this.context && (this.context.canMaximize || this.context.canStartAudio || this.context.canStarVideo));
  }
  setAvatarUrl(avatarUrl){
    this.avatarSrc = avatarUrl;
    this.cd.markForCheck()
  }
  setSubtitle(subtitle){
    this.subtitle = subtitle;
    this.cd.markForCheck()
  }
  setTitle(title){
    this.title = title;
    this.cd.markForCheck()
  }
  setTopBar(title, subtitle, avatarSrc){
    this.setTitle(title);
    this.setSubtitle(subtitle);
    this.setAvatarUrl(avatarSrc);
  }
  showMenu(){
    this.isMenuVisible = true;
  }
}
