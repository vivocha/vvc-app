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

  isMenuVisible = false;
  closeAttempts = 0;

  constructor(){}

  closeMenu(){
    this.isMenuVisible = false;
  }
  hasMenu(){
    return (this.context && (this.context.canMaximize || this.context.canStartAudio || this.context.canStarVideo));
  }
  removeApp(){
    if (this.context.hasSurvey) {
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
