using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SimpleTodoList;

namespace SimpleTodoList.Data {
  public static class DbInitializer {
    public static void Initialize(SpaDbContext context) {
      context.Database.EnsureCreated();
    }
  }
}
