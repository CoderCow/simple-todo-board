/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />
import { Input } from '@angular/core';
import { Component, DebugElement } from '@angular/core';
import { ITodoGroup } from './../../models/ITodoGroup';
import { TodoGroupService, TodoGroupServiceStub } from './../../core/services/todo-group.service';
import { TodoBoardModule } from './todo-board.module';
import { CoreModule } from './../../core/core.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoBoardComponent } from './todo-board.component';
import { By } from '@angular/platform-browser';
import { tick } from '@angular/core/testing';
import { fakeAsync } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Component({ selector: 'todo-group', template: '' })
class TodoGroupComponent {
  @Input()
  public group: ITodoGroup;
  @Input()
  public allowAdd: boolean = false;
  @Input()
  public containsDoneCards: boolean = false;
}

describe('TodoBoardComponent', () => {
  let sut: TodoBoardComponent;
  let fixture: ComponentFixture<TodoBoardComponent>;
  let groupService: TodoGroupServiceStub;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CoreModule],
      declarations: [
        TodoBoardComponent,
        TodoGroupComponent // stub
      ],
      providers: [
        { provide: TodoGroupService, useValue: new TodoGroupServiceStub() },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoBoardComponent);
    sut = fixture.componentInstance;
    groupService = TestBed.get(TodoGroupService);
  });

  it('should create', () => {
    setServiceReturnValue();

    fixture.detectChanges();

    fixture.debugElement.query(By.css("*"));
    expect(sut).toBeTruthy();
  });

  describe("todo groups", () => {
    it('should load using service', () => {
      setServiceReturnValue();

      fixture.detectChanges(); // init

      expect(groupService.getGroups).toHaveBeenCalled();
    });

    it('should render loading spinner while loading', () => {
      groupService.getGroups.and.returnValue(Observable.of([]).delay(1));

      fixture.detectChanges(); // init

      expect(loadingSpinner()).toBeTruthy("one loading spinner rendered");
    });

    it('should not render loading spinner when loading has finished', () => {
      setServiceReturnValue();

      fixture.detectChanges(); // init

      expect(loadingSpinner()).toBeFalsy("no loading spinner rendered");
    });

    for (let i = 0; i <= 3; i++) {
      it(`should render ${i} if ${i} groups loaded`, () => {
        setServiceReturnValue(new Array(i));

        fixture.detectChanges(); // init

        let groupElements = fixture.debugElement.queryAll(By.css("todo-group"));
        expect(groupElements.length).toBe(i);
      });
    }

    for (let i = 0; i <= 3; i++) {
      // note that one single group will allow adding cards and contain done cards aswell
      it(`first group should allow adding items, last group should contain done cards (${i} groups)`, () => {
        let getGroupsResult = Observable.of(new Array(i));
        groupService.getGroups.and.returnValue(getGroupsResult);

        fixture.detectChanges(); // init

        let groupElements = fixture.debugElement.queryAll(By.css("todo-group"));
        for (let x = 0; x < groupElements.length; x++) {
          let groupComponent = groupElements[x].componentInstance;

          expect(groupComponent.allowAdd)
          .toBe(x === 0, 'first element should allow adding cards');
          expect(groupComponent.containsDoneCards)
          .toBe(x === groupElements.length - 1, 'last element should contain done cards');
        }
      });
    }
  });

  function loadingSpinner(): DebugElement {
    return fixture.debugElement.query(By.css("loading-spinner"));
  }

  function setServiceReturnValue(returnValue: any = []) {
    groupService.getGroups.and.returnValue(Observable.of(returnValue));
  }
});
