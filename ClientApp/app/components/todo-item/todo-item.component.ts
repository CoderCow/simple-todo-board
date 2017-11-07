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

  @ViewChild('beginEditFocusTarget')
  set beginEditFocusTarget(element: ElementRef) {
    // once the target element becomes available, focus it
    if (element !== undefined)
      element.nativeElement.focus();
  }

  constructor(private domSanitizer: DomSanitizer) {}

  public beginEdit() {
    this.editingTodo = Object.assign({}, this.todo);
    this.isEditMode = true;
  }

  public endEdit(doSave: boolean) {
    if (doSave) {
      Object.assign(this.todo, this.editingTodo);
    }

    this.isEditMode = false;
  }

  public delete() {
    this.deleteClicked.emit();
  }

  private static newlineToBr(text: string) {
    return text.replace(/\r\n|\r|\n/g, "<br>");
  }
}
