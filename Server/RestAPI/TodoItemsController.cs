using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SimpleTodoBoard.Data;
using SimpleTodoBoard.Models.Data;
using SimpleTodoBoard.Models;

namespace SimpleTodoBoard.RestAPI {
  [Route("api/v1/todo-items")]
  public class TodoItemsController: Controller {
    private readonly SpaDbContext context;

    public TodoItemsController(SpaDbContext context) {
      this.context = context;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id) {
      var todoItem = await TodoItemById(id);
      if (todoItem == null)
        return this.NotFound();

      var resultModel = TodoItemResultViewModel.FromModel(todoItem);
      return this.Ok(resultModel);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] TodoItemPostViewModel todoData) {
      if (!this.ModelState.IsValid)
        return this.BadRequest();

      TodoGroup todoGroup = await this.TodoGroupById(todoData.GroupId);
      if (todoGroup == null)
        this.BadRequest("Invalid group id.");

      TodoItem newTodoItem = todoData.ToModel(todoGroup);

      // fix user order
      await this.context.TodoItems
        .Where(i => i.GroupId == todoGroup.Id)
        .Where(i => i.UserOrder >= todoData.UserOrder)
        .ForEachAsync(i => i.UserOrder++);

      TodoItem createdTodoItem = (await this.context.TodoItems.AddAsync(newTodoItem)).Entity;
      await this.context.SaveChangesAsync();

      var resultModel = TodoItemResultViewModel.FromModel(createdTodoItem);
      return this.Ok(resultModel);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] TodoItemPutViewModel newTodoData) {
      if (!this.ModelState.IsValid)
        return this.BadRequest();

      TodoItem itemToUpdate = await this.TodoItemById(id);
      if (itemToUpdate == null)
        return this.NotFound();

      await ChangeModelByPutModel(itemToUpdate, newTodoData);

      this.context.Update(itemToUpdate);
      await this.context.SaveChangesAsync();

      return this.NoContent();
    }

    private async Task ChangeModelByPutModel(TodoItem itemToUpdate, TodoItemPutViewModel putModel) {
      bool doChangeGroupId = putModel.GroupId != null && itemToUpdate.GroupId != putModel.GroupId;
      if (doChangeGroupId) {
        TodoGroup newTodoGroup = await TodoGroupById(putModel.GroupId.Value);
        if (newTodoGroup == null)
          this.BadRequest("Invalid group id.");

        itemToUpdate.Group = newTodoGroup;
      }

      bool doChangeTitle = putModel.Title != null;
      if (doChangeTitle)
        itemToUpdate.Title = putModel.Title;

      bool doChangeDescription = putModel.DescriptionHtml != null;
      if (doChangeDescription)
        itemToUpdate.DescriptionHtml = itemToUpdate.DescriptionHtml == string.Empty ? null : putModel.DescriptionHtml;

      bool doChangeUserOrder = putModel.UserOrder != null;
      // if item was moved
      if (doChangeUserOrder) {
        int oldOrder = itemToUpdate.UserOrder;
        int newOrder = putModel.UserOrder.Value;

        bool isSameGroup = !doChangeGroupId;
        if (isSameGroup) {
          if (newOrder < oldOrder) {
            await this.context.TodoItems
              .Where(i => i.GroupId == itemToUpdate.GroupId)
              .Where(i => i.UserOrder >= newOrder && i.UserOrder < oldOrder)
              .ForEachAsync(i => i.UserOrder++);
          } else if (newOrder > oldOrder) {
            await this.context.TodoItems
              .Where(i => i.GroupId == itemToUpdate.GroupId)
              .Where(i => i.UserOrder > oldOrder && i.UserOrder <= newOrder)
              .ForEachAsync(i => i.UserOrder--);
          }
        } else {
          await this.context.TodoItems
            .Where(i => i.GroupId == itemToUpdate.GroupId)
            .Where(i => i.UserOrder >= newOrder)
            .ForEachAsync(i => i.UserOrder++);
        }

        itemToUpdate.UserOrder = putModel.UserOrder.Value;
      }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
      TodoItem todoItem = await this.TodoItemById(id);
      if (todoItem == null)
        return this.NotFound();

      // fix user order
      await this.context.TodoItems
        .Where(i => i.GroupId == todoItem.GroupId)
        .Where(i => i.UserOrder > todoItem.UserOrder)
        .ForEachAsync(i => i.UserOrder--);

      this.context.Remove(todoItem);
      await this.context.SaveChangesAsync();

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
