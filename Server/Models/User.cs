using System;
using System.ComponentModel.DataAnnotations;

namespace AspCoreServer.Models {
  public class User {
    public int Id { get; set; }
    public string Name { get; set; }

    [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
    [DataType(DataType.Date)]
    public DateTime EntryTime { get; set; }

    public User() {
      this.EntryTime = DateTime.Now;
    }
  }
}
