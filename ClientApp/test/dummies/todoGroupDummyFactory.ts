import * as faker from "faker";
import { ITodoGroup } from "../../app/models/ITodoGroup";
import { todoItemDummyFactory } from "./todoItemDummyFactory";

export function todoGroupDummyFactory(amount: number): ITodoGroup[] {
  let results: ITodoGroup[] = new Array(amount);

  for (let i = 0; i < amount; i++) {
    results[i] = {
      id: i,
      title: faker.random.arrayElement(["Todo", "Doing", "Done"]),
      userOrder: i,
      todos: todoItemDummyFactory(5 + faker.random.number(3))
    };
  }

  return results;
}
