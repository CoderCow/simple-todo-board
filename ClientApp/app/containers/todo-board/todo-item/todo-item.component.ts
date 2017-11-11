import { ITodoItemViewModel } from './../../../models/ITodoItemViewModel';
import { Component, ElementRef, EventEmitter, Input, Output, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ITodoItem } from '../../../models/ITodoItem';
import { SafeHtml } from "@angular/platform-browser";
import { TodoItemService } from '../../../core/services/todo-item.service';

@Component({
  selector: 'todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input()
  public todo: ITodoItemViewModel;

  @Input()
  public get todoDescriptionHtml(): SafeHtml {
    let withBreaks = TodoItemComponent.newlineToBr(this.todo.descriptionHtml);
    return this.domSanitizer.sanitize(SecurityContext.HTML, withBreaks);
  }

  @Input()
  public editingTodo: ITodoItemViewModel;

  @Output()
  public deleteClicked = new EventEmitter();

  constructor(
    private domSanitizer: DomSanitizer,
    public todoItemService: TodoItemService
  ) {}

  // region Editing
  private editFocusTargetQuerySelector: string;

  @ViewChild('editCardContentElement')
  set editCardContentElement(element: ElementRef) {
    // when the edit card becomes available
    if (element !== undefined)
      element.nativeElement.querySelector(this.editFocusTargetQuerySelector).focus();
  }

  public beginEdit(editFocusTargetQuerySelector: string = "input.todo-title") {
    if (this.todo.isBeingEdited)
      return;

    this.editingTodo = Object.assign({}, this.todo);
    this.todo.isBeingEdited = true;
    this.editFocusTargetQuerySelector = editFocusTargetQuerySelector;
  }

  public async endEdit(doSave: boolean): Promise<any> {
    if (doSave) {
      // TODO: rollback if update fails
      Object.assign(this.todo, this.editingTodo);
      this.todo.isBeingEdited = false;

      this.todo.isBusy = true;
      await this.todoItemService.updateItem(this.editingTodo.id, this.editingTodo).toPromise();
      this.todo.isBusy = false;
    } else {
      this.todo.isBeingEdited = false;
    }
  }
  // endregion

  public delete() {
    this.deleteClicked.emit();
  }

  private static newlineToBr(text: string) {
    return text.replace(/\r\n|\r|\n/g, "<br>");
  }
}
