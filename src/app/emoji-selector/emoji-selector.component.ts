import {Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'vvc-emoji-selector',
  templateUrl: './emoji-selector.component.html',
  styleUrls: ['./emoji-selector.component.scss']
})
export class EmojiSelectorComponent implements OnInit {
  emojis = ['😀','😬','😁','😂','😃','😄','😅','😆','😇','😉','😊','🙂','🙃','☺️','😋','😌','😍','😘','😗','😙','😚','😜','😝','😛','🤑','🤓','😎','🤗','😏','😶','😐','😑','😒','🙄','🤔','😳','😞','😟','😠','😡','😔','😕','🙁','☹️','😣','😖','😫','😩','😤','😮','😱','😨','😰','😯','😦','😧','😢','😥','😪','😓','😵','😲','🤐','😷','🤒','🤕','😴','💤','💩','😈','👿','👹','👺','💀','👻','👽','🤖'];
  @Output() emoji = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  addEmoji(em) {
    this.emoji.emit(em);
  }

}
