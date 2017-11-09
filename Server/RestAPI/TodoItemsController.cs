using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleTodoList.Data;
using SimpleTodoList.Models.Data;
using SimpleTodoList.Models;

namespace SimpleTodoList.RestAPI {
  [Route("api/v1/todo-items")]
  public class TodoItemsController: Controller {
    private readonly SpaDbContext context;

    public TodoItemsController(SpaDbContext context) {
      this.context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get(int id) {
      var todoItem = await TodoItemById(id);
      if (todoItem == null)
        return this.NotFound();

      return this.Ok(todoItem);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] TodoItemPostModel todoData) {
      if (!this.ModelState.IsValid)
        return this.BadRequest();

      TodoGroup todoGroup = await this.TodoGroupById(todoData.GroupId);
      if (todoGroup == null)
        this.BadRequest("Invalid group id.");

      // creation and last edit time should both be exactly the same
      DateTime timeOfCreation = DateTime.UtcNow;

      TodoItem newTodoItem = new TodoItem {
        Group = todoGroup,
        Title = todoData.Title,
        DescriptionHtml = todoData.DescriptionHtml == string.Empty ? null : todoData.DescriptionHtml,
        UserOrder = todoData.UserOrder,
        TimeOfCreation = timeOfCreation,
        TimeLastEdited = timeOfCreation
      };

      await this.context.TodoItems
        .Where(i => i.UserOrder >= todoData.UserOrder)
        .ForEachAsync(i => i.UserOrder++);

      await this.context.TodoItems.AddAsync(newTodoItem);
      await this.context.SaveChangesAsync();

      return this.Ok(newTodoItem);
    }

    [HttpPut]
    public async Task<IActionResult> Put(int id, [FromBody] TodoItemPutModel todoData) {
      if (!this.ModelState.IsValid)
        return this.BadRequest();

      TodoItem todoItem = await this.TodoItemById(id);
      if (todoItem == null)
        return this.NotFound();

      bool doChangeGroupId = todoData.GroupId != null;
      if (doChangeGroupId) {
        TodoGroup newTodoGroup = await TodoGroupById(todoData.GroupId.Value);
        if (newTodoGroup == null)
          this.BadRequest("Invalid group id.");

        todoItem.Group = newTodoGroup;
      }

      bool doChangeTitle = todoData.Title != null;
      if (doChangeTitle)
        todoItem.Title = todoData.Title;

      bool doChangeDescription = todoData.DescriptionHtml != null;
      if (doChangeDescription)
        todoItem.DescriptionHtml = todoItem.DescriptionHtml == string.Empty ? null : todoData.DescriptionHtml;

      bool doChangeUserOrder = todoData.UserOrder != null;
      // if item was moved
      if (doChangeUserOrder) {
        int oldOrderIndex = todoItem.UserOrder;
        int newOrderIndex = todoData.UserOrder.Value;

        if (newOrderIndex < oldOrderIndex) {
          await this.context.TodoItems
            .Where(i => i.UserOrder >= newOrderIndex && i.UserOrder < oldOrderIndex)
            .ForEachAsync(i => i.UserOrder++);
        } else if (newOrderIndex > oldOrderIndex) {
          await this.context.TodoItems
            .Where(i => i.UserOrder > oldOrderIndex && i.UserOrder <= newOrderIndex)
            .ForEachAsync(i => i.UserOrder--);
        }

        todoItem.UserOrder = todoData.UserOrder.Value;
      }

      this.context.Update(todoItem);
      await this.context.SaveChangesAsync();

      return this.NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(int id) {
      TodoItem todoItem = await this.TodoItemById(id);
      if (todoItem == null)
        return this.NotFound();

      this.context.Remove(todoItem);
      return this.NoContent();
    }

    private async Task<TodoGroup> TodoGroupById(int groupId) {
      return await this.context.TodoGroups
        .Where(g => g.Id == groupId)
        .FirstOrDefaultAsync();
    }

    private async Task<TodoItem> TodoItemById(int id) {
      return await this.context.TodoItems
        .Where(i => i.Id == id)
        .FirstOrDefaultAsync();
    }
  }
}
