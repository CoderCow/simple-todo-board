using Microsoft.EntityFrameworkCore;
using SimpleTodoList.Models;

namespace SimpleTodoList.Data {
  public class SpaDbContext : DbContext {
    //List of DB Models - Add your DB models here
    public DbSet<User> User { get; set; }

    public SpaDbContext(DbContextOptions<SpaDbContext> options): base(options) {
      this.Database.EnsureCreated();
    }
  }
}
