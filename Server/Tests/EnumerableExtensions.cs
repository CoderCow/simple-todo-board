using System;
using System.Collections.Generic;

namespace SimpleTodoBoard.Tests {
  public static class ListExtensions {
    private static Lazy<Random> random = new Lazy<Random>(() => new Random());

    public static T RandomItem<T>(this IList<T> list) {
      int itemIndex = random.Value.Next(0, list.Count - 1);
      return list[itemIndex];
    }
  }
}
