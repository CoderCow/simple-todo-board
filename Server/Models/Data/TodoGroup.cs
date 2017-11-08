using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SimpleTodoList.Server.Models.Data {
  public class TodoGroup {
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(30, MinimumLength = 1)]
    public string Title { get; set; }

    public ICollection<TodoItem> Todos { get; set; }
  }
}
