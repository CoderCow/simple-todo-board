import { ORIGIN_URL } from './../constants/baseurl.constants';
import { Observable } from 'rxjs/Observable';
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
    return this.http.get<ITodoGroup[]>(this.baseUrl + "/v1/todo-groups");
  }

  public getGroup(id: number): Observable<ITodoGroup> {
    return this.http.get<ITodoGroup>(this.baseUrl + "/v1/todo-groups/" + id);
  }
}
