import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'vvc-chat',
  templateUrl: './chat.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent {

  @Input() set context(_context){
    if (_context.showEmojiPanel === true){
      this._showEmojiPanel = true;
      this._showMessageArea = false;
    }
    else {
      this._showEmojiPanel = false;
      this._showMessageArea = true;
    }
  }
  _showEmojiPanel = false;
  _showMessageArea = true;
}
