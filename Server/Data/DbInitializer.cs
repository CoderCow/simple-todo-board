using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SimpleTodoBoard;
using SimpleTodoBoard.Models;
using SimpleTodoBoard.Models.Data;

namespace SimpleTodoBoard.Data {
  public static class DbInitializer {
    public static void Initialize(SpaDbContext context) {
      context.Database.EnsureCreated();

      SeedTodoGroupsAndItems(context);
    }

    private static void SeedTodoGroupsAndItems(SpaDbContext context) {
      if (context.TodoGroups.Any())
        return;

      context.TodoGroups.AddRange(
        new TodoGroup {
          Title = "Todo",
          UserOrder = 0,
          Todos = new List<TodoItem> {
            new TodoItem {
              Title = "Task 1",
              DescriptionHtml =
                "Lorem ipsumLorem ipsum dolor sit amet, consetetur sadipscing elitr.\nSed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
              UserOrder = 0,
              TimeOfCreation = DateTime.UtcNow,
              TimeLastEdited = DateTime.UtcNow
            },
            new TodoItem {
              Title = "Task 2",
              DescriptionHtml = "Lorem ipsumLorem ipsum dolor sit amet, consetetur sadipscing elitr.",
              UserOrder = 1,
              TimeOfCreation = DateTime.UtcNow - TimeSpan.FromDays(3),
              TimeLastEdited = DateTime.UtcNow
            }
          }
        },
        new TodoGroup {
          Title = "Doing",
          UserOrder = 1,
          Todos = new List<TodoItem> {
            new TodoItem {
              Title = "Task 3",
              DescriptionHtml =
                "Lorem ipsumLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
              UserOrder = 0,
              TimeOfCreation = DateTime.UtcNow - TimeSpan.FromDays(14),
              TimeLastEdited = DateTime.UtcNow - TimeSpan.FromDays(8)
            }
          }
        },
        new TodoGroup {
          Title = "Done",
          UserOrder = 2
        }
      );

      context.SaveChanges();
    }
  }
}
