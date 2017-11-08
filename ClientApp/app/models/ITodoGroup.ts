import { ITodoItem } from "./ITodoItem";

export interface ITodoGroup {
  id: number;
  title: string;
  todos: ITodoItem[];
}
