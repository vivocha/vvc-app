import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'vvc-emoji-panel',
  templateUrl: './emoji-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmojiPanelComponent {

  @Output() toggleEmojiPanel = new EventEmitter();
  @Output() addEmoji = new EventEmitter();

  emojis = ['😀', '😬', '😁', '😂', '😃', '😄', '😅', '😆', '😇', '😉', '😊', '🙂', '🙃', '☺️', '😋',
    '😌', '😍', '😘', '😗', '😙', '😚', '😜', '😝', '😛', '🤑', '🤓', '😎', '🤗', '😏', '😶',
    '😐', '😑', '😒', '🙄', '🤔', '😳', '😞', '😟', '😠', '😡', '😔', '😕', '🙁', '☹️', '😣',
    '😖', '😫', '😩', '😤', '😮', '😱', '😨', '😰', '😯', '😦', '😧', '😢', '😥', '😪', '😓',
    '😵', '😲', '🤐', '😷', '🤒', '🤕', '😴', '💤', '💩', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '🤖'];
}
