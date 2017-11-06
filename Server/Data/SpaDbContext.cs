using AspCoreServer.Models;
using Microsoft.EntityFrameworkCore;

namespace AspCoreServer.Data {
  public class SpaDbContext : DbContext {
    //List of DB Models - Add your DB models here
    public DbSet<User> User { get; set; }

    public SpaDbContext(DbContextOptions<SpaDbContext> options): base(options) {
      this.Database.EnsureCreated();
    }
  }
}
