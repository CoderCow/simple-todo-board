using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using SimpleTodoBoard.Models.Data;

namespace SimpleTodoBoard.Models {
  public class TodoItemResultViewModel {
    public int GroupId { get; set; }
    public int Id { get; set; }
    public string Title { get; set; }
    public string DescriptionHtml { get; set; }
    public int UserOrder { get; set; }

    public static TodoItemResultViewModel FromModel(TodoItem todoItem) =>
      new TodoItemResultViewModel {
        Id = todoItem.Id,
        GroupId = todoItem.Group.Id,
        Title = todoItem.Title,
        DescriptionHtml = todoItem.DescriptionHtml,
        UserOrder = todoItem.UserOrder
      };
  }
}
