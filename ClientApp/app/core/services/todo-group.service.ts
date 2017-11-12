import { ORIGIN_URL } from './../constants/baseurl.constants';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import { ITodoGroup } from './../../models/ITodoGroup';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TodoGroupService {
  private baseUrl: string;

  public constructor(
    private http: HttpClient,
    private injector: Injector
  ) {
    this.baseUrl = this.injector.get(ORIGIN_URL) + "/api";
  }

  /** Retrieves todo groups sorted by user order. */
  public getGroups(): Observable<ITodoGroup[]> {
    return this.http.get<ITodoGroup[]>(this.baseUrl + "/v1/todo-groups").delay(2000);
  }

  public getGroup(id: number): Observable<ITodoGroup> {
    return this.http.get<ITodoGroup>(this.baseUrl + "/v1/todo-groups/" + id).delay(1000);
  }
}

export class TodoGroupServiceStub {
  public getGroups = jasmine.createSpy('getGroups');
  public getGroup = jasmine.createSpy('getGroups');
}
