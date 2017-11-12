import * as faker from "faker";
import { ITodoItemViewModel } from "../../app/models/ITodoItemViewModel";

export function todoItemDummyFactory(amount: number): ITodoItemViewModel[] {
  let results: ITodoItemViewModel[] = new Array(amount);

  for (let i = 0; i < amount; i++) {
    results[i] = {
      id: i,
      groupId: 0,
      title: faker.name.title(),
      descriptionHtml: faker.random.words(10),
      userOrder: i,
      isBeingEdited: false,
      isBusy: false
    };
  }

  return results;
}
