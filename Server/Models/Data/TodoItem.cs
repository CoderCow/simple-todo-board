using System;
using System.ComponentModel.DataAnnotations;

namespace SimpleTodoList.Server.Models.Data {
  public class TodoItem {
    [Key]
    public int Id { get; set; }

    [Required]
    public TodoGroup Group { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Title { get; set; }

    [DataType(DataType.MultilineText)]
    [StringLength(1024)]
    public string DescriptionHtml { get; set; }

    [Required]
    public DateTime TimeOfCreation { get; set; }

    [Required]
    public DateTime TimeLastEdited { get; set; }
  }
}
