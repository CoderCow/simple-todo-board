using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleTodoList.Data;
using SimpleTodoList.Models.Data;

namespace SimpleTodoList.RestAPI {
  [Route("api/v1/todo-groups")]
  public class TodoGroupsController: Controller {
    private readonly SpaDbContext context;

    public TodoGroupsController(SpaDbContext context) {
      this.context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get() {
      TodoGroup[] todoGroups = await this.context.TodoGroups
        .OrderBy(g => g.UserOrder)
        .ToArrayAsync();

      return this.Ok(todoGroups);
    }

    [HttpGet]
    public async Task<IActionResult> Get(int id) {
      TodoGroup todoGroup = await this.context.TodoGroups
        .Where(g => g.Id == id)
        .FirstOrDefaultAsync();

      if (todoGroup == null)
        return this.NotFound();

      return this.Ok(todoGroup);
    }
  }
}
