using Microsoft.EntityFrameworkCore;
using SimpleTodoList.Models.Data;

namespace SimpleTodoList.Data {
  public class SpaDbContext: DbContext {
    public DbSet<TodoGroup> TodoGroups { get; set; }
    public DbSet<TodoItem> TodoItems { get; set; }

    public SpaDbContext(DbContextOptions<SpaDbContext> options): base(options) {
      this.Database.EnsureCreated();
    }
  }
}
