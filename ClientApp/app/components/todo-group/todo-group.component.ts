import { Component, Input } from '@angular/core';
import { ITodoGroup } from '../../models/ITodoGroup';

@Component({
  selector: 'todo-group',
  templateUrl: './todo-group.component.html',
  styleUrls: ['./todo-group.component.scss']
})
export class TodoGroupComponent {
  @Input()
  public group: ITodoGroup;

  constructor() {}
}
