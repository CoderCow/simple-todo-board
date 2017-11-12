/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CofirmDeleteDialogComponent } from './cofirm-delete-dialog.component';
import { CoreModule } from '../../../../core/core.module';
import { MAT_DIALOG_DATA } from '@angular/material';

let todoItemDummy = Object.freeze({
  id: 0,
  groupId: 0,
  title: "Lorem",
  descriptionHtml: "Plaintext with\n a break in it.",
  userOrder: 0,
  isBeingEdited: false,
  isBusy: false
});

describe('CofirmDeleteDialogComponent', () => {
  let component: CofirmDeleteDialogComponent;
  let fixture: ComponentFixture<CofirmDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CofirmDeleteDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: todoItemDummy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CofirmDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
