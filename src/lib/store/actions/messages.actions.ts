import {Action} from '@ngrx/store';

export const NEW_MESSAGE = '[Message] New message';
export const UPDATE_MESSAGE = '[Message] Update message';
export const REM_IS_WRITING = '[Message] Remove is writing';
export const REM_MESSAGE = '[Message] Remove message';

export class NewMessage implements Action {
  readonly type = NEW_MESSAGE;
  constructor(public payload: any) {}
}
export class UpdateMessage implements Action {
  readonly type = UPDATE_MESSAGE;
  constructor(public payload: any) {}
}
export class RemoveIsWriting implements Action {
  readonly type = REM_IS_WRITING;
}
export class RemoveMessage implements Action {
  readonly type = REM_MESSAGE;
  constructor(public payload: any) {}
}

export type MessagesActions = NewMessage | UpdateMessage | RemoveIsWriting | RemoveMessage;
