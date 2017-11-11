using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleTodoBoard.Data;
using SimpleTodoBoard.Models;
using SimpleTodoBoard.Models.Data;

namespace SimpleTodoBoard.RestAPI {
  [Route("api/v1/todo-groups")]
  public class TodoGroupsController: Controller {
    private readonly SpaDbContext context;

    public TodoGroupsController(SpaDbContext context) {
      this.context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get() {
      List<TodoGroupResultViewModel> resultGroups = await this.context.TodoGroups
        .Include(g => g.Todos)
        .OrderBy(g => g.UserOrder)
        .Select(g => TodoGroupResultViewModel.FromModel(g))
        .ToListAsync();

      // TODO: put index on UserOrder and use the db context to order the todo items
      foreach (var resultGroup in resultGroups)
        resultGroup.Todos = resultGroup.Todos.OrderBy(i => i.UserOrder).ToArray();

      return this.Ok(resultGroups);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id) {
      TodoGroup todoGroup = await this.context.TodoGroups
        .Where(g => g.Id == id)
        .Include(g => g.Todos)
        .FirstOrDefaultAsync();

      if (todoGroup == null)
        return this.NotFound();

      var result = TodoGroupResultViewModel.FromModel(todoGroup);
      return this.Ok(result);
    }
  }
}
