using FluentAssertions;
using Microsoft.AspNetCore.Mvc;

namespace SimpleTodoBoard.Tests {
  public static class ResultExtensions {
    public static T ToResultValue<T>(this IActionResult actionResult) {
      actionResult.Should().BeOfType<OkObjectResult>();
      var okResult = (OkObjectResult)actionResult;

      return (T)okResult.Value;
    }
  }
}
