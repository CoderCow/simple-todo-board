import { ITodoItem } from './../../models/ITodoItem';
import { ORIGIN_URL } from './../constants/baseurl.constants';
import { Observable } from 'rxjs/Observable';
import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TodoItemService {
  private baseUrl: string;

  public constructor(
    private http: HttpClient,
    private injector: Injector
  ) {
    this.baseUrl = this.injector.get(ORIGIN_URL) + "/api";
  }

  public getItem(id: number): Observable<ITodoItem> {
    return this.http.get<ITodoItem>(this.baseUrl + "/v1/todo-items/" + id).delay(1000);
  }

  public updateItem(id: number, itemUpdates: {}): Observable<Object> {
    return this.http.put(this.baseUrl + "/v1/todo-items/" + id, itemUpdates).delay(1000);
  }

  public addItem(item: ITodoItem): Observable<ITodoItem> {
    return this.http.post<ITodoItem>(this.baseUrl + "/v1/todo-items", item).delay(1000);
  }

  public removeItem(id: number): Observable<Object> {
    return this.http.delete(this.baseUrl + "/v1/todo-items/" + id).delay(1000);
  }
}
