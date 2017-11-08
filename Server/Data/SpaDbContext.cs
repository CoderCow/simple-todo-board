using Microsoft.EntityFrameworkCore;

namespace SimpleTodoList.Data {
  public class SpaDbContext : DbContext {
    public SpaDbContext(DbContextOptions<SpaDbContext> options): base(options) {
      this.Database.EnsureCreated();
    }
  }
}
