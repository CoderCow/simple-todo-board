using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SimpleTodoBoard.Models.Data {
  public class TodoGroup {
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(30, MinimumLength = 1)]
    public string Title { get; set; }

    [Required]
    [Range(0, Int32.MaxValue)]
    public int UserOrder { get; set; }

    public virtual ICollection<TodoItem> Todos { get; set; }

    public TodoGroup() {
      this.Todos = new List<TodoItem>();
    }

    public override string ToString() =>
      $"{{Id: {this.Id}, Title: {this.Title}, UserOrder: {this.UserOrder}, Todos: {this.Todos.ToString() ?? "null"}}}";
  }
}
