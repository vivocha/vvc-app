import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'vvc-top-bar',
  templateUrl: './top-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopBarComponent{

  @Input() context;
  @Output() onMinimize = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Output() onSurvey = new EventEmitter();
  @Output() onRemove = new EventEmitter();
  @Output() onHideChat = new EventEmitter();
  @Output() onVoiceUpgrade = new EventEmitter();
  @Output() onVideoUpgrade = new EventEmitter();
  @Output() onMaximize = new EventEmitter();

  isMenuVisible = false;
  closeAttempts = 0;

  constructor(){}

  closeContact(){
    this.onClose.emit({
      forceClose: !this.context.variables.askCloseConfirm,
      stayInAppAfterClose: this.context.variables.stayInAppAfterClose,
      hasSurvey: this.context.hasSurvey
    });
  }
  closeMenu(){
    this.isMenuVisible = false;
  }
  hasMenu(){
    let itemNumber = 0;
    if (this.context && !this.context.isMediaConnecting){
      if (this.context.canMinimize) itemNumber++;
      if (this.context.canMaximize && !this.context.isFullScreen) itemNumber++;
      if (this.context.canStartAudio) itemNumber++;
      if (this.context.canStartVideo && !this.context.isMediaConnected) itemNumber++;
      if (this.context.isMediaMinimized && !this.context.isAutoChat) itemNumber++;
    }
    return (itemNumber > 1);
  }
  removeApp(){
    if (this.context.hasSurvey) {
      if (this.context.showSurveyPanel) this.closeAttempts++;
      if (this.closeAttempts > 0) {
        this.onRemove.emit();
      } else {
        this.closeAttempts++;
        this.onSurvey.emit();
      }
    }
    else this.onRemove.emit();
  }
  showMenu(){
    this.isMenuVisible = true;
  }
}
