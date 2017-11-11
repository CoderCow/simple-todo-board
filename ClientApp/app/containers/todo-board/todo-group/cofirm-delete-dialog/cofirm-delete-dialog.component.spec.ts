/// <reference path="../../../../../../node_modules/@types/jasmine/index.d.ts" />
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CofirmDeleteDialogComponent } from './cofirm-delete-dialog.component';

describe('CofirmDeleteDialogComponent', () => {
  let component: CofirmDeleteDialogComponent;
  let fixture: ComponentFixture<CofirmDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CofirmDeleteDialogComponent ]
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
