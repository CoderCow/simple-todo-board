using System;
using System.ComponentModel.DataAnnotations;
using SimpleTodoList.Models.Data;

namespace SimpleTodoList.Models {
  public class TodoItemPostViewModel {
    [Required]
    public int GroupId { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 1)]
    public string Title { get; set; }

    /// <summary>
    ///   The multiline description text supporting safe html tags.
    /// </summary>
    /// <remarks>
    ///   Passing an empty string will set the description to no value (DBNULL) in the database.
    /// </remarks>
    [StringLength(1024)]
    public string DescriptionHtml { get; set; }

    [Required]
    [Range(0, Int32.MaxValue)]
    public int UserOrder { get; set; }

    public TodoItem ToModel(TodoGroup todoGroup) {
      // creation and last edit time should both be exactly the same
      DateTime timeOfCreation = DateTime.UtcNow;

      return new TodoItem {
        Group = todoGroup,
        Title = this.Title,
        DescriptionHtml = this.DescriptionHtml == string.Empty ? null : this.DescriptionHtml,
        UserOrder = this.UserOrder,
        TimeOfCreation = timeOfCreation,
        TimeLastEdited = timeOfCreation
      };
    }
  }
}
