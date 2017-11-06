using AspCoreServer.Data;
using AspCoreServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AspCoreServer.Controllers {
  [Route("api/[controller]")]
  public class UsersController : Controller {
    private readonly SpaDbContext context;

    public UsersController(SpaDbContext context) {
      this.context = context;
    }

    [HttpGet]
    public async Task<IActionResult> Get(int currentPageNo = 1, int pageSize = 20) {
      User[] users = await this.context.User
        .OrderByDescending(u => u.EntryTime)
        .Skip((currentPageNo - 1) * pageSize)
        .Take(pageSize)
        .ToArrayAsync();

      if (!users.Any())
        return this.NotFound("Users not Found");
      else
        return this.Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(int id) {
      User user = await this.context.User
        .Where(u => u.Id == id)
        .AsNoTracking()
        .SingleOrDefaultAsync(m => m.Id == id);

      if (user == null)
        return this.NotFound("User not Found");
      else
        return this.Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] User user) {
      if (!string.IsNullOrEmpty(user.Name)) {
        this.context.Add(user);
        await this.context.SaveChangesAsync();
        return this.CreatedAtAction("Post", user);
      } else {
        return this.BadRequest("User's name was not given");
      }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, [FromBody] User userUpdateValue) {
      try {
        userUpdateValue.EntryTime = DateTime.Now;

        var userToEdit = await this.context.User
          .AsNoTracking()
          .SingleOrDefaultAsync(m => m.Id == id);

        if (userToEdit == null) {
          return this.NotFound("Could not update user as it was not Found");
        } else {
          this.context.Update(userUpdateValue);
          await this.context.SaveChangesAsync();
          return this.Ok("Updated user - " + userUpdateValue.Name);
        }
      } catch (DbUpdateException) {
        //Log the error (uncomment ex variable name and write a log.)
        ModelState.AddModelError("", "Unable to save changes. " +
                                     "Try again, and if the problem persists, " +
                                     "see your system administrator.");
        return this.NotFound("User not Found");
      }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id) {
      User userToRemove = await this.context.User
        .AsNoTracking()
        .SingleOrDefaultAsync(m => m.Id == id);

      if (userToRemove == null) {
        return this.NotFound("Could not delete user as it was not Found");
      } else {
        this.context.User.Remove(userToRemove);
        await this.context.SaveChangesAsync();
        return this.Ok("Deleted user - " + userToRemove.Name);
      }
    }
  }
}
