/// <reference path="../../../../../node_modules/@types/jasmine/index.d.ts" />
import { MatDialog } from '@angular/material';
import { TodoItemServiceStub, TodoItemService } from './../../../core/services/todo-item.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ITodoGroup } from './../../../models/ITodoGroup';
import { ITodoItem } from './../../../models/ITodoItem';
import { TodoGroupService, TodoGroupServiceStub } from './../../../core/services/todo-group.service';
import { TodoGroupComponent } from './../todo-group/todo-group.component';
import { CoreModule } from './../../../core/core.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { ITodoItemViewModel } from '../../../models/ITodoItemViewModel';
import { DndModule } from 'ng2-dnd';
import { testDummyGenerator } from '../../../../test/dummies/TestDummyGenerator';
import { todoItemDummyFactory } from '../../../../test/dummies/todoItemDummyFactory';
import { todoGroupDummyFactory } from '../../../../test/dummies/todoGroupDummyFactory';

@Component({ selector: 'todo-item', template: '' })
class TodoItemComponent {
  @Input()
  public todo: ITodoItemViewModel;
  @Input()
  public todoDescriptionHtml: string;
  @Input()
  public editingTodo: ITodoItemViewModel;
  @Output()
  public deleteClicked = new EventEmitter();
}

class MatDialogStub {
  public open = jasmine.createSpy('open');
}

let dummyGenerator = testDummyGenerator()
  .registerFactory("ITodoItem", todoItemDummyFactory)
  .registerFactory("ITodoGroup", todoGroupDummyFactory);

describe('TodoGroupComponent', () => {
  let sut: TodoGroupComponent;
  let fixture: ComponentFixture<TodoGroupComponent>;
  let itemService: TodoItemServiceStub;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DndModule.forRoot()],
      declarations: [
        TodoGroupComponent,
        TodoItemComponent // stub
      ],
      providers: [
        { provide: TodoItemService, useValue: new TodoItemServiceStub() },
        { provide: MatDialog, useValue: new MatDialogStub() },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoGroupComponent);

    sut = fixture.componentInstance;
    sut.group = dummyGenerator.single("ITodoGroup");
    sut.group.todos = [];

    itemService = TestBed.get(TodoItemService);
  });

  it('should create', () => {
    fixture.detectChanges();

    fixture.debugElement.query(By.css("*"));
    expect(sut).toBeTruthy();
  });

  it("shouldn't render add button if allowAdd=false", () => {
    sut.allowAdd = false;

    fixture.detectChanges();

    let buttonElements = fixture.debugElement.queryAll(By.css(".groupbox-edge-button"));
    expect(buttonElements.length).toBe(0, "button was not rendered");
  });

  it("should render add button if allowAdd=true", () => {
    sut.allowAdd = true;

    fixture.detectChanges();

    let buttonElements = fixture.debugElement.queryAll(By.css(".groupbox-edge-button"));
    expect(buttonElements.length).toBe(1, "button was not rendered");
  });

  it("shouldn't render done cards if containsDoneCards=false", () => {
    sut.containsDoneCards = false;

    fixture.detectChanges();

    let groupboxBodyElement = fixture.debugElement.query(By.css(".groupbox-body"));
    expect(groupboxBodyElement.nativeElement.classList.contains("done-cards")).toBeFalsy();
  });

  it("should render done cards if containsDoneCards=true", () => {
    sut.containsDoneCards = true;

    fixture.detectChanges();

    let groupboxBodyElement = fixture.debugElement.query(By.css(".groupbox-body"));
    expect(groupboxBodyElement.nativeElement.classList.contains("done-cards")).toBeTruthy();
  });

  for (let i = 0; i <= 2; i++) {
    it(`should render ${i} if ${i} items in group`, () => {
      sut.group.todos = dummyGenerator.multiple("ITodoItem", i);

      fixture.detectChanges(); // init

      let itemElements = fixture.debugElement.queryAll(By.css("todo-item"));
      expect(itemElements.length).toBe(i);
    });
  }

  describe("addItem", () => {
    it("should use item template if no parameter provided", () => {
      expect(sut.group.todos.length === 0).toBeTruthy("no items in group for this test");

      sut.addItem();

      expect(sut.group.todos.length === 1).toBeTruthy("item count has increased");
    });

    it("should use provided item if passed by parameter", () => {
      expect(sut.group.todos.length === 0).toBeTruthy("no items in group for this test");
      let itemToAdd = dummyGenerator.single("ITodoItem");

      sut.addItem(itemToAdd);

      expect(sut.group.todos.length === 1).toBeTruthy("item count has increased");
      expect(sut.group.todos[0]).toBe(itemToAdd);
    });

    it("should set groupid of added item", () => {
      sut.group.id = 123;
      let itemToAdd = dummyGenerator.single("ITodoItem");

      sut.addItem(itemToAdd);

      expect(sut.group.todos[0].groupId).toBe(sut.group.id);
    });

    it("should set userOrder of added item", () => {
      let itemToAdd = dummyGenerator.single("ITodoItem");
      itemToAdd.userOrder = 123;

      sut.addItem(itemToAdd);

      expect(itemToAdd.userOrder).toBe(0);
    });

    it("should set busy status of added item", () => {
      let itemToAdd = dummyGenerator.single("ITodoItem");
      itemToAdd.isBusy = false;

      sut.addItem(itemToAdd);

      expect(itemToAdd.isBusy).toBeTruthy();
    });

    it("should increase userOrder of all existing items", () => {
      let initialTodos = dummyGenerator.multiple("ITodoItem", 3);
      sut.group.todos = initialTodos.map(t => Object.assign({}, t));

      sut.addItem();

      for (let i = 1; i < sut.group.todos.length; i++)
        expect(sut.group.todos[i].userOrder).toBeGreaterThan(initialTodos[i - 1].userOrder);
    });

    it("should insert item at index 0", () => {
      sut.group.todos = dummyGenerator.multiple("ITodoItem", 3);
      let itemToAdd = dummyGenerator.single("ITodoItem");

      sut.addItem(itemToAdd);

      expect(sut.group.todos[0]).toBe(itemToAdd);
    });

    it("should remote add the item using the service", () => {
      let itemToAdd = dummyGenerator.single("ITodoItem");

      sut.addItem(itemToAdd);

      expect(itemService.addItem).toHaveBeenCalled();
      expect(itemService.addItem).toHaveBeenCalledWith(itemToAdd);
    });

    it("should assign item id from remote added item", fakeAsync(() => {
      let itemToAdd = dummyGenerator.single("ITodoItem");
      itemToAdd.id = 123;
      let expectedItem = Object.assign({}, itemToAdd);
      expectedItem.id = 321;
      setServiceReturnValue(expectedItem);

      sut.addItem(itemToAdd);
      tick();

      expect(itemToAdd.id).toEqual(expectedItem.id);
    }));

    it("should mark item as non busy when remote call ended", fakeAsync(() => {
      let itemToAdd = dummyGenerator.single("ITodoItem");
      setServiceReturnValue(itemToAdd);

      sut.addItem(itemToAdd);
      tick();

      expect(itemToAdd.isBusy).toBeFalsy();
    }));

    function setServiceReturnValue(returnValue: ITodoItem = undefined) {
      itemService.addItem.and.returnValue(Observable.of(returnValue));
    }
  });

  describe("deleteItem", () => {
    let confirmDialog: MatDialogStub;

    beforeEach(() => {
      confirmDialog = TestBed.get(MatDialog);
    });

    it("shouldn't do anything if the item has already been deleted", fakeAsync(() => {
      let itemToDelete = dummyGenerator.single("ITodoItem");
      sut.group.todos = dummyGenerator.multiple("ITodoItem", 2);

      sut.deleteItem(<ITodoItemViewModel>sut.group.todos[2]);
      tick(); // perform confirmation (if any)
      tick(); // remote call (if any)

      expect(sut.group.todos.length).toBe(2, "items didn't change");
    }));

    it("shouldn't do anything if confirmation is not complete", () => {
      sut.group.todos = dummyGenerator.multiple("ITodoItem", 2);

      sut.deleteItem(<ITodoItemViewModel>sut.group.todos[0]);

      expect(sut.group.todos.length).toBe(2, "items didn't change");
    });

    it("should delete item if confirmed", fakeAsync(() => {
      sut.group.todos = dummyGenerator.multiple("ITodoItem", 3);
      let initialTodos = [].concat(sut.group.todos);
      setDialogResult("true");
      setServiceReturnValue();

      sut.deleteItem(<ITodoItemViewModel>sut.group.todos[1]);
      tick(); // perform confirmation, but not remote call

      expect(sut.group.todos.length).toBe(2, "an item was deleted");
      expect(sut.group.todos[0]).toBe(initialTodos[0], "correct item was deleted");
      expect(sut.group.todos[1]).toBe(initialTodos[2], "correct item was deleted");
    }));

    it("shouldn't delete item if not confirmed", fakeAsync(() => {
      sut.group.todos = dummyGenerator.multiple("ITodoItem", 3);
      setDialogResult("false");
      setServiceReturnValue();

      sut.deleteItem(<ITodoItemViewModel>sut.group.todos[1]);
      tick(); // perform confirmation, but not remote call

      expect(sut.group.todos.length).toBe(3, "no item was deleted");
    }));

    it("should remove item before invoking remote call", fakeAsync(() => {
      sut.group.todos = [dummyGenerator.single("ITodoItem")];
      setDialogResult("true");
      setServiceReturnValue();

      sut.deleteItem(<ITodoItemViewModel>sut.group.todos[0]);
      tick(); // perform confirmation, but not remote call

      expect(sut.group.todos.length).toBe(0, "item was deleted");
    }));

    it("should decrease userOrder of items below the deleted", fakeAsync(() => {
      sut.group.todos = dummyGenerator.multiple("ITodoItem", 3);
      let initialThirdItemOrder = sut.group.todos[2].userOrder;
      setDialogResult("true");
      setServiceReturnValue();

      sut.deleteItem(<ITodoItemViewModel>sut.group.todos[1]);
      tick(); // perform confirmation, but not remote call

      expect(sut.group.todos[1].userOrder).toBeLessThan(initialThirdItemOrder);
    }));

    function setDialogResult(result: string) {
      let dialogRef = {
        afterClosed: () => Observable.of(result)
      };
      confirmDialog.open.and.returnValue(dialogRef);
    }

    function setServiceReturnValue(returnValue: any = undefined) {
      itemService.removeItem.and.returnValue(Observable.of(returnValue));
    }
  });

  // TODO: add itemDrag tests
});
