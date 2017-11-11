using System;
using System.ComponentModel.DataAnnotations;

namespace SimpleTodoList.Models.Data {
  public class TodoItem {
    [Key]
    public int Id { get; set; }

    public int GroupId { get; set; }

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

    [Required]
    [Range(0, Int32.MaxValue)]
    public int UserOrder { get; set; }
  }
}
