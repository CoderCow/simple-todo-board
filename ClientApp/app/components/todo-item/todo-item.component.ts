import { Component, ElementRef, EventEmitter, Input, Output, SecurityContext, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ITodoItem } from '../../models/ITodoItem';
import { SafeHtml } from "@angular/platform-browser";

@Component({
  selector: 'todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input()
  public todo: ITodoItem;

  @Input()
  public get todoDescriptionHtml(): SafeHtml {
    let withBreaks = TodoItemComponent.newlineToBr(this.todo.description);
    return this.domSanitizer.sanitize(SecurityContext.HTML, withBreaks);
  }

  @Input()
  public editingTodo: ITodoItem;

  public isEditMode: boolean = false;

  @Output()
  public deleteClicked = new EventEmitter();

  constructor(private domSanitizer: DomSanitizer) {}

  // region Editing
  private editFocusTargetQuerySelector: string;

  @ViewChild('editCardContentElement')
  set editCardContentElement(element: ElementRef) {
    // when the edit card becomes available
    if (element !== undefined)
      element.nativeElement.querySelector(this.editFocusTargetQuerySelector).focus();
  }

  public beginEdit(editFocusTargetQuerySelector: string = "input.todo-title") {
    if (this.isEditMode)
      return;

    this.editingTodo = Object.assign({}, this.todo);
    this.isEditMode = true;
    this.editFocusTargetQuerySelector = editFocusTargetQuerySelector;
  }

  public endEdit(doSave: boolean) {
    if (doSave) {
      Object.assign(this.todo, this.editingTodo);
    }

    this.isEditMode = false;
  }
  // endregion

  public delete() {
    this.deleteClicked.emit();
  }

  private static newlineToBr(text: string) {
    return text.replace(/\r\n|\r|\n/g, "<br>");
  }
}
