using System.Collections.Generic;
using System.Linq;
using SimpleTodoBoard.Models.Data;

namespace SimpleTodoBoard.Models {
  public class TodoGroupResultViewModel {
    public int Id { get; set; }
    public string Title { get; set; }
    public int UserOrder { get; set; }
    public TodoItemResultViewModel[] Todos { get; set; }

    public static TodoGroupResultViewModel FromModel(TodoGroup model) {
      TodoItemResultViewModel[] todoItems = model.Todos
        .Select(t => TodoItemResultViewModel.FromModel(t))
        .ToArray();

      return new TodoGroupResultViewModel {
        Id = model.Id,
        Title = model.Title,
        UserOrder = model.UserOrder,
        Todos = todoItems
      };
    }
  }
}
