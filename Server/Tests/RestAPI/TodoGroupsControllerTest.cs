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

namespace SimpleTodoBoard.Tests.RestAPI {
  public class TodoGroupsControllerTest: IDisposable {
    private readonly DbFixture dbFixture;
    private Fixture fixture;
    private TodoGroupsController sut;

    public TodoGroupsControllerTest() {
      this.dbFixture = new DbFixture();

      this.fixture = new Fixture();
      this.fixture.Customize<TodoItem>(i => i
        .Without(ti => ti.Group)
        .Without(ti => ti.GroupId));

      this.sut = new TodoGroupsController(this.dbFixture.ActionContext);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(3)]
    public async Task Get_ReturnsAllGroups(int amount) {
      this.dbFixture.ArrangeContext.AddRange(this.fixture.CreateMany<TodoGroup>(amount));
      this.dbFixture.ArrangeContext.SaveChanges();

      IActionResult result = await sut.Get();

      var resultGroups = result.ToResultValue<List<TodoGroupResultViewModel>>();
      resultGroups.Count.Should().Be(amount);
    }

    [Fact]
    public async Task Get_ReturnsGroupsSortedByUserOrder() {
      var initialGroups = this.fixture.CreateMany<TodoGroup>(3).ToList();
      initialGroups[0].UserOrder = 2;
      initialGroups[1].UserOrder = 0;
      initialGroups[2].UserOrder = 1;
      this.dbFixture.ArrangeContext.AddRange(initialGroups);
      this.dbFixture.ArrangeContext.SaveChanges();

      IActionResult result = await sut.Get();

      var resultGroups = result.ToResultValue<List<TodoGroupResultViewModel>>();
      resultGroups[0].Id.Should().Be(initialGroups[1].Id);
      resultGroups[1].Id.Should().Be(initialGroups[2].Id);
      resultGroups[2].Id.Should().Be(initialGroups[0].Id);
    }

    [Fact]
    public async Task Get_ReturnsGroupsWithTheirItemsSortedByUserOrder() {
      var initialItems = this.fixture.CreateMany<TodoItem>(3).ToList();
      initialItems[0].UserOrder = 2;
      initialItems[1].UserOrder = 0;
      initialItems[2].UserOrder = 1;
      var initialGroup = this.fixture.Build<TodoGroup>().With(g => g.Todos, initialItems).Create();
      this.dbFixture.ArrangeContext.Add(initialGroup);
      this.dbFixture.ArrangeContext.SaveChanges();

      IActionResult result = await sut.Get();

      var resultGroups = result.ToResultValue<List<TodoGroupResultViewModel>>();
      resultGroups[0].Todos[0].Id.Should().Be(initialItems[1].Id);
      resultGroups[0].Todos[1].Id.Should().Be(initialItems[2].Id);
      resultGroups[0].Todos[2].Id.Should().Be(initialItems[0].Id);
    }

    [Theory]
    [InlineData(0, 3)]
    [InlineData(1, 3)]
    [InlineData(2, 3)]
    public async Task Get_ReturnsSpecificGroups(int itemIndex, int itemCount) {
      var todoGroups = this.fixture.CreateMany<TodoGroup>(itemCount).ToList();
      this.dbFixture.ArrangeContext.AddRange(todoGroups);
      this.dbFixture.ArrangeContext.SaveChanges();
      var groupIdToGet = todoGroups[itemIndex].Id;

      IActionResult result = await sut.Get(groupIdToGet);

      var resultGroup = result.ToResultValue<TodoGroupResultViewModel>();
      todoGroups[itemIndex].Id.Should().Be(resultGroup.Id);
    }

    [Fact]
    public async Task Get_ReturnsNotFoundIfGroupIdDoesntExist() {
      var initialGroups = this.fixture.CreateMany<TodoGroup>(3).ToList();
      int nonexistingGroupId = initialGroups.Max(g => g.Id) + 1;
      this.dbFixture.ArrangeContext.AddRange(initialGroups);

      IActionResult result = await sut.Get(nonexistingGroupId);

      result.Should().BeOfType<NotFoundResult>();
    }

    public void Dispose() {
      dbFixture?.Dispose();
      sut?.Dispose();
    }
  }
}
