/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { MatDialog } from '@angular/material';
import { TodoItemServiceStub, TodoItemService } from './../../../core/services/todo-item.service';
import { Component, Input, Output, EventEmitter, DebugElement } from '@angular/core';
import { ITodoGroup } from './../../../models/ITodoGroup';
import { ITodoItem } from './../../../models/ITodoItem';
import { TodoGroupService, TodoGroupServiceStub } from './../../../core/services/todo-group.service';
import { TodoGroupComponent } from './../todo-group/todo-group.component';
import { CoreModule } from './../../../core/core.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By, DomSanitizer } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ITodoItemViewModel } from '../../../models/ITodoItemViewModel';
import { DndModule } from 'ng2-dnd';
import { TodoItemComponent } from './todo-item.component';
import { testDummyGenerator } from '../../../../test/dummies/TestDummyGenerator';
import { todoItemDummyFactory } from '../../../../test/dummies/todoItemDummyFactory';

class DomSanitizerStub {
  public sanitize = jasmine.createSpy('sanitize').and.callFake((context, text) => {
    return text;
  });
}

let dummyGenerator = testDummyGenerator()
  .registerFactory("ITodoItem", todoItemDummyFactory);

describe('TodoItemComponent', () => {
  let sut: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  let itemService: TodoItemServiceStub;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule],
      declarations: [
        TodoItemComponent
      ],
      providers: [
        { provide: TodoItemService, useValue: new TodoItemServiceStub() },
        { provide: DomSanitizer, useValue: new DomSanitizerStub() }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemComponent);

    sut = fixture.componentInstance;
    sut.todo = dummyGenerator.single("ITodoItem");

    itemService = TestBed.get(TodoItemService);
  });

  it("should create", () => {
    fixture.detectChanges();

    fixture.debugElement.query(By.css("*"));
    expect(sut).toBeTruthy();
  });

  describe("todoDescriptionHtml", () => {
    it("should convert newlines to <br>", () => {
      sut.todo.descriptionHtml = "Lorem\n Ipsum\r\n meroL \r.";

      expect(sut.todoDescriptionHtml).toBe("Lorem<br> Ipsum<br> meroL <br>.");
    });
  });

  describe("editing", () => {
    it("should set editingTodo to a clone of the original todo item", () => {
      expect(sut.editingTodo).toBeFalsy();

      sut.beginEdit();

      expect(sut.editingTodo).not.toBe(sut.todo);
      expect(sut.editingTodo).toEqual(sut.todo);
    });

    it("should render action bar in edit mode", () => {
      fixture.detectChanges();

      sut.beginEdit();
      fixture.detectChanges();

      expect(actionBar()).toBeTruthy();
    });

    it("shouldn't render action bar when not in edit mode", () => {
      fixture.detectChanges();

      sut.beginEdit();
      fixture.detectChanges();

      sut.endEdit(false);
      fixture.detectChanges();

      expect(actionBar()).toBeFalsy();
    });

    it("should discard values when endEdit(false) is called", () => {
      fixture.detectChanges();
      let originalTitle = sut.todo.title;

      sut.beginEdit();
      sut.editingTodo.title = "Looorem";
      sut.endEdit(false);

      expect(sut.todo.title).toBe(originalTitle);
    });

    it("should assign values when endEdit(true) is called", () => {
      fixture.detectChanges();
      let newTitle = "Looorem";

      sut.beginEdit();
      sut.editingTodo.title = "Looorem";
      sut.endEdit(true);

      expect(sut.todo.title).toBe(newTitle);
    });

    it("should render loading-spinner before performing remote call", () => {
      fixture.detectChanges();
      expect(loadingSpinner()).toBeFalsy();

      sut.beginEdit();
      sut.editingTodo.title = "Looorem";
      sut.endEdit(true);
      fixture.detectChanges();

      expect(loadingSpinner()).toBeTruthy();
    });

    it("shouldn't render loading-spinner when remote call has finished", fakeAsync(() => {
      setServiceReturnValue();
      fixture.detectChanges();
      expect(loadingSpinner()).toBeFalsy();

      sut.beginEdit();
      sut.editingTodo.title = "Looorem";
      sut.endEdit(true);
      fixture.detectChanges();
      tick(); // remote call
      fixture.detectChanges();

      expect(loadingSpinner()).toBeFalsy("no loading spinner rendered");
    }));

    function actionBar(): DebugElement {
      return fixture.debugElement.query(By.css("mat-card-actions"));
    }

    function loadingSpinner(): DebugElement {
      return fixture.debugElement.query(By.css("loading-spinner"));
    }

    function setServiceReturnValue(returnValue: any = undefined) {
      itemService.updateItem.and.returnValue(Observable.of(returnValue));
    }
  });

  describe("delete", () => {
    it("should emit deleteClicked", () => {
      let eventHandlerSpy = jasmine.createSpy('handler');
      sut.deleteClicked.subscribe(eventHandlerSpy);

      sut.delete();

      expect(eventHandlerSpy).toHaveBeenCalled();
    });
  });
});
