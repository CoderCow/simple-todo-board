using System;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SimpleTodoBoard.Data;

namespace SimpleTodoBoard.Tests {
  public class DbFixture: IDisposable {
    public SpaDbContext ArrangeContext { get; set; }
    public SpaDbContext ActionContext { get; set; }
    public SpaDbContext AssertContext { get; set; }

    private readonly SqliteConnection dbConnection;
    private readonly DbContextOptions<SpaDbContext> dbContextOptions;

    public DbFixture() {
      this.dbConnection = new SqliteConnection("DataSource=:memory:");
      this.dbConnection.Open();

      this.dbContextOptions = new DbContextOptionsBuilder<SpaDbContext>()
        .UseSqlite(this.dbConnection)
        .Options;

      // one context per test step should be enough 99% of the time
      this.ArrangeContext = this.NewContext();
      this.ActionContext = this.NewContext();
      this.AssertContext = this.NewContext();
    }

    public SpaDbContext NewContext() => new SpaDbContext(this.dbContextOptions);

    public void Dispose() {
      dbConnection?.Dispose();
      ArrangeContext?.Dispose();
      ActionContext?.Dispose();
      AssertContext?.Dispose();
    }
  }
}
