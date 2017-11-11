using System;
using System.ComponentModel.DataAnnotations;

namespace SimpleTodoBoard.Models {
  public class TodoItemPutViewModel {
    public int? GroupId { get; set; }

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

    [Range(0, Int32.MaxValue)]
    public int? UserOrder { get; set; }
  }
}
