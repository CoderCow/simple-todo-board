import { ITodoItem } from './ITodoItem';

export interface ITodoItemViewModel extends ITodoItem {
  isBeingEdited: boolean;
  /** Whether the item is currently deactivated because it does I/O with the server. */
  isBusy: boolean;
}
