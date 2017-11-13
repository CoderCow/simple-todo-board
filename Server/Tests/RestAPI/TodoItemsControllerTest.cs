using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using SimpleTodoBoard.Data;
using SimpleTodoBoard.RestAPI;
using Xunit;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using SimpleTodoBoard.Models;
using System.Collections.Generic;
using AutoFixture;
using SimpleTodoBoard.Models.Data;
using System.Diagnostics;
using System.Text;
using FluentAssertions.Equivalency;
using FluentAssertions.Execution;
using FluentAssertions.Primitives;
using Microsoft.Data.Sqlite;

namespace SimpleTodoBoard.Tests.RestAPI {
  public class TodoItemsControllerTest: IDisposable {
    private readonly DbFixture dbFixture;
    private readonly Fixture fixture;
    private TodoItemsController sut;

    public TodoItemsControllerTest() {
      this.dbFixture = new DbFixture();

      this.fixture = new Fixture();
      this.fixture.Customize<TodoItem>(i => i
        .Without(ti => ti.Id));
      // prevent endless cyclic
      this.fixture.Customize<TodoGroup>(i => i
        .Without(ti => ti.Todos));

      this.sut = new TodoItemsController(this.dbFixture.ActionContext);
    }

    [Theory]
    [InlineData(0, 3)]
    [InlineData(1, 3)]
    [InlineData(2, 3)]
    public async Task Get_ReturnsSpecificItems(int itemIndex, int itemCount) {
      var todoItems = this.fixture.CreateMany<TodoItem>(itemCount).ToList();
      this.dbFixture.ArrangeContext.AddRange(todoItems);
      this.dbFixture.ArrangeContext.SaveChanges();
      var itemIdToGet = todoItems[itemIndex].Id;

      IActionResult result = await sut.Get(itemIdToGet);

      var resultItem = result.ToResultValue<TodoItemResultViewModel>();
      todoItems[itemIndex].Id.Should().Be(resultItem.Id);
      todoItems[itemIndex].GroupId.Should().Be(resultItem.GroupId);
      todoItems[itemIndex].Title.Should().Be(resultItem.Title);
      todoItems[itemIndex].DescriptionHtml.Should().Be(resultItem.DescriptionHtml);
      todoItems[itemIndex].UserOrder.Should().Be(resultItem.UserOrder);
    }

    [Fact]
    public async Task Get_ReturnsNotFoundIfItemIdDoesntExist() {
      var initialTodoItems = this.fixture.CreateMany<TodoItem>(3).ToList();
      this.dbFixture.ArrangeContext.AddRange(initialTodoItems);
      this.dbFixture.ArrangeContext.SaveChanges();
      int nonexistingItemId = initialTodoItems.Max(g => g.UserOrder) + 1;

      IActionResult result = await sut.Get(nonexistingItemId);

      result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Post_ReturnsBadRequestIfGroupIdIsInvalid() {
      var groupDummies = this.fixture.CreateMany<TodoGroup>(3).ToList();
      this.dbFixture.ArrangeContext.AddRange(groupDummies);
      this.dbFixture.ArrangeContext.SaveChanges();
      int notExistingGroupId = groupDummies.Max(g => g.Id) + 1;
      var postModel = this.fixture.Build<TodoItemPostViewModel>()
        .With(p => p.GroupId, notExistingGroupId)
        .Create();

      IActionResult result = await sut.Post(postModel);

      result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public async Task Post_ChangesUserOrderOfExistingItemsAccordingly() {
      var group = NewGroupWithItems(100, out List<TodoItem> originalItems);

      var newItem = this.fixture.Build<TodoItemPostViewModel>()
        .With(p => p.GroupId, group.Id)
        .Create();

      this.dbFixture.ArrangeContext.Add(group);
      this.dbFixture.ArrangeContext.SaveChanges();

      // Action
      IActionResult result = await sut.Post(newItem);

      // Assert
      result.Should().BeOfType<OkObjectResult>();

      var actualNewItem = result.ToResultValue<TodoItemResultViewModel>();
      var itemsInDbWithoutNewItem = this.dbFixture.AssertContext.TodoItems.Where(i => i.Id != actualNewItem.Id).ToList();
      CompareItems(originalItems, itemsInDbWithoutNewItem, (originalItem, itemInDb) => {
        if (originalItem.UserOrder >= newItem.UserOrder)
          return itemInDb.UserOrder > originalItem.UserOrder;
        if (originalItem.UserOrder < newItem.UserOrder)
          return itemInDb.UserOrder == originalItem.UserOrder;

        throw new AssertionFailedException("Failed to compare items.");
      });
    }

    [Fact]
    public async Task Put_ChangesItemPropertiesAccordingly() {
      var groups = this.fixture.CreateMany<TodoGroup>(2).ToList();
      var initialItem = new TodoItem {
        Id = 123,
        GroupId = groups[0].Id,
        Title = "some item",
        DescriptionHtml = "somedesc",
        TimeLastEdited = DateTime.Now,
        TimeOfCreation = DateTime.UtcNow,
        UserOrder = 0
      };
      var editData = new TodoItemPutViewModel {
        Title = "new title",
        DescriptionHtml = "new desc",
        GroupId = groups[1].Id,
        UserOrder = 123
      };
      this.dbFixture.ArrangeContext.AddRange(groups);
      this.dbFixture.ArrangeContext.Add(initialItem);
      this.dbFixture.ArrangeContext.SaveChanges();

      // Action
      IActionResult result = await sut.Put(initialItem.Id, editData);

      // Assert
      result.Should().BeOfType<NoContentResult>();

      TodoItem itemFromDb = await this.dbFixture.AssertContext.TodoItems.Where(i => i.Id == initialItem.Id).FirstAsync();
      itemFromDb.Title.Should().Be(editData.Title);
      itemFromDb.DescriptionHtml.Should().Be(editData.DescriptionHtml);
      itemFromDb.GroupId.Should().Be(editData.GroupId);
      itemFromDb.UserOrder.Should().Be(editData.UserOrder);
    }

    [Fact]
    public async Task Put_ChangesDescriptionToNullIfSetToEmptyString() {
      var item = this.fixture.Create<TodoItem>();
      this.dbFixture.ArrangeContext.Add(item);
      this.dbFixture.ArrangeContext.SaveChanges();
      var editData = new TodoItemPutViewModel { DescriptionHtml = "" };

      // Action
      IActionResult result = await sut.Put(item.Id, editData);

      // Assert
      result.Should().BeOfType<NoContentResult>();

      TodoItem itemFromDb = await this.dbFixture.AssertContext.TodoItems.Where(i => i.Id == item.Id).FirstAsync();
      itemFromDb.DescriptionHtml.Should().BeNull();
    }

    [Fact]
    public async Task Put_ChangesNoValuesIfNullButLastEditDate() {
      var initialItem = this.fixture.Create<TodoItem>();
      initialItem.TimeLastEdited = DateTime.UtcNow - TimeSpan.FromHours(1);
      this.dbFixture.ArrangeContext.Add(initialItem);
      this.dbFixture.ArrangeContext.SaveChanges();
      var editData = new TodoItemPutViewModel();

      // Action
      IActionResult result = await sut.Put(initialItem.Id, editData);

      // Assert
      result.Should().BeOfType<NoContentResult>();

      TodoItem itemFromDb = await this.dbFixture.AssertContext.TodoItems.Where(i => i.Id == initialItem.Id).FirstAsync();
      itemFromDb.Title.Should().Be(initialItem.Title);
      itemFromDb.DescriptionHtml.Should().Be(initialItem.DescriptionHtml);
      itemFromDb.GroupId.Should().Be(initialItem.GroupId);
      itemFromDb.UserOrder.Should().Be(initialItem.UserOrder);
      itemFromDb.TimeLastEdited.Should().BeAfter(initialItem.TimeLastEdited);
    }

    [Fact]
    public async Task Put_ReturnsNotFoundIfItemIdIsInvalid() {
      var items = this.fixture.CreateMany<TodoItem>(10).ToList();
      this.dbFixture.ArrangeContext.AddRange(items);
      this.dbFixture.ArrangeContext.SaveChanges();
      int notExistingItemId = items.Max(i => i.Id) + 1;

      IActionResult result = await sut.Put(notExistingItemId, new TodoItemPutViewModel());

      result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Put_ReturnsBadRequestIfGroupIdIsInvalid() {
      var group = NewGroupWithItems(10, out List<TodoItem> items);
      this.dbFixture.ArrangeContext.Add(group);
      this.dbFixture.ArrangeContext.SaveChanges();
      int nonExistingGroupId = group.Id + 1;

      // Action
      var editData = new TodoItemPutViewModel { GroupId = nonExistingGroupId };
      IActionResult result = await sut.Put(items[0].Id, editData);

      // Assert
      result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Theory]
    // item format is: <Title>:<UserOrder>
    [InlineData(new[] { "a:0", "b:10", "c:20" },             "b", 11, new[] { "a:0", "b:11", "c:20" })]
    [InlineData(new[] { "a:0", "b:10", "c:20" },             "b", 9,  new[] { "a:0", "b:9", "c:20" })]
    [InlineData(new[] { "a:0", "b:1", "c:2", "d:3", "e:4" }, "b", 3,  new[] { "a:0", "c:1", "d:2", "b:3", "e:4" })]
    [InlineData(new[] { "a:0", "b:1", "c:2" },               "a", 2,  new[] { "b:0", "c:1", "a:2" })]
    [InlineData(new[] { "a:0", "b:1", "c:2" },               "a", 3,  new[] { "b:0", "c:1", "a:3" })]
    [InlineData(new[] { "a:0", "b:10", "c:20" },             "c", 0,  new[] { "c:0", "a:1", "b:11"})]
    public async Task Put_ChangesUserOrderOfExistingItemsAccordinglyWithinSameGroup(
      string[] initialItemsAndOrders,
      string itemToPut,
      int newUserOrder,
      string[] expectedItemsAndOrders
    ) {
      var group = this.fixture.Create<TodoGroup>();
      group.Todos = ItemsFromStringArray(initialItemsAndOrders).ToList();
      this.dbFixture.ArrangeContext.Add(group);
      this.dbFixture.ArrangeContext.SaveChanges();

      int itemToEditId = group.Todos.Where(i => i.Title == itemToPut).First().Id;
      var editData = new TodoItemPutViewModel { UserOrder = newUserOrder };

      // Action
      IActionResult result = await sut.Put(itemToEditId, editData);

      // Assert
      result.Should().BeOfType<NoContentResult>();

      var itemsInDb = this.dbFixture.AssertContext.TodoItems.ToList();
      var expectedItems = ItemsFromStringArray(expectedItemsAndOrders).ToList();
      CompareItems(expectedItems, itemsInDb, (expectedItem, itemInDb) =>
        itemInDb.Title == expectedItem.Title &&
        itemInDb.UserOrder == expectedItem.UserOrder,
      $"Expected items to be like: {ItemsToReadableString(expectedItems)} but got {ItemsToReadableString(itemsInDb)}",
      itemsOtherItemsComparator: (a, b) => a.Title == b.Title);

      // --- local functions
      IEnumerable<TodoItem> ItemsFromStringArray(string[] itemDefinitions) {
        return itemDefinitions.Select(itemDef => {
          string[] itemDefDataRaw = itemDef.Split(':');
          string defTitle = itemDefDataRaw[0];
          string defUserOrderRaw = itemDefDataRaw[1];

          if (!int.TryParse(itemDefDataRaw[1], out int defUserOrder))
            throw new ArgumentException($"\"{defUserOrderRaw}\" is not an integer.");

          return this.fixture.Build<TodoItem>()
            .Without(i => i.Group)
            .Without(i => i.GroupId)
            .With(i => i.Title, defTitle)
            .With(i => i.UserOrder, defUserOrder)
            .Create();
        });
      }

      string ItemsToReadableString(IEnumerable<TodoItem> items) =>
        string.Join(", ", items.Select(i => $"{i.Title}:{i.UserOrder}"));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(5)]
    [InlineData(9)]
    public async Task Delete_RemoveRequestedItem(int itemIndexToDelete) {
      var originalItems = this.fixture.CreateMany<TodoItem>(10).ToList();
      this.dbFixture.ArrangeContext.AddRange(originalItems);
      this.dbFixture.ArrangeContext.SaveChanges();
      int itemIdToDelete = originalItems[itemIndexToDelete].Id;

      IActionResult result = await sut.Delete(itemIdToDelete);

      result.Should().BeOfType<NoContentResult>();
      List<TodoItem> itemsInDb = await this.dbFixture.AssertContext.TodoItems.ToListAsync();
      itemsInDb.Should().HaveCount(9);
      itemsInDb.Should().NotContain(i => i.Id == itemIdToDelete);
    }

    [Fact]
    public async Task Delete_ReturnsNotFoundIfItemIdIsInvalid() {
      var items = this.fixture.CreateMany<TodoItem>(10).ToList();
      this.dbFixture.ArrangeContext.AddRange(items);
      this.dbFixture.ArrangeContext.SaveChanges();
      int notExistingItemId = items.Max(i => i.Id) + 1;

      IActionResult result = await sut.Delete(notExistingItemId);

      result.Should().BeOfType<NotFoundResult>();
    }

    [Fact]
    public async Task Delete_ChangesUserOrderOfExistingItemsAccordingly() {
      var group = NewGroupWithItems(100, out List<TodoItem> originalItems);
      this.dbFixture.ArrangeContext.Add(group);
      this.dbFixture.ArrangeContext.SaveChanges();
      TodoItem itemToDelete = originalItems.RandomItem();

      // Action
      IActionResult result = await sut.Delete(itemToDelete.Id);

      // Assert
      result.Should().BeOfType<NoContentResult>();

      var itemsInDb = this.dbFixture.AssertContext.TodoItems.ToList();
      CompareItems(itemsInDb, originalItems, (itemInDb, originalItem) => {
        if (originalItem.UserOrder >= itemToDelete.UserOrder)
          return itemInDb.UserOrder < originalItem.UserOrder;
        if (originalItem.UserOrder < itemToDelete.UserOrder)
          return itemInDb.UserOrder == originalItem.UserOrder;

        throw new AssertionFailedException("Failed to compare items.");
      });
    }

    /// <param name="itemsOtherItemsComparator">
    ///   In order to find the respective item in <c>otherItems</c>, this comparator function is used.
    ///   Default is comparing items and other items by their Ids.
    /// </param>
    public void CompareItems(
      IEnumerable<TodoItem> items,
      IEnumerable<TodoItem> otherItems,
      Func<TodoItem, TodoItem, bool> predicate,
      string errorMsg = null,
      Func<TodoItem, TodoItem, bool> itemsOtherItemsComparator = null
    ) {
      itemsOtherItemsComparator = itemsOtherItemsComparator ?? ((a, b) => a.Id == b.Id);

      items.ForEach(item => {
        TodoItem otherItem = otherItems.FirstOrDefault(i => itemsOtherItemsComparator(i, item));
        if (otherItem == null)
          throw new AssertionFailedException($"{nameof(items)} contains item with an id which doesn't exist in {nameof(otherItems)}.");

        if (!predicate(item, otherItem))
          throw new AssertionFailedException(errorMsg ?? $"{item.ToString()} and {otherItem.ToString()} did not match predicate.");
      });
    }

    private TodoGroup NewGroupWithItems(int itemCount) =>
      NewGroupWithItems(itemCount, out List<TodoItem> dummy);

    private TodoGroup NewGroupWithItems(int itemCount, out List<TodoItem> items) {
      var group = this.fixture.Create<TodoGroup>();
      items = this.fixture.Build<TodoItem>()
        .With(i => i.GroupId, group.Id)
        .With(i => i.Group, group)
        .CreateMany(itemCount)
        .ToList();

      group.Todos = items;
      return group;
    }

    public void Dispose() => this.dbFixture?.Dispose();
  }
}
