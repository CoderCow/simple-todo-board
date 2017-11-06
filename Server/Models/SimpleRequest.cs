using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SimpleTodoList.Server.Models {
  public class SimpleRequest {
    public object Cookies { get; set; }
    public object Headers { get; set; }
    public object Host { get; set; }
  }
}
