import { ITodoItem } from './ITodoItem';

export interface ITodoItemViewModel extends ITodoItem {
  isBeingEdited: boolean;
}
