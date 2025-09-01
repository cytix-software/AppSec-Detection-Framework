using Microsoft.AspNetCore.Mvc;
using Test109.Models;
using System.IO;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using System.Security.Principal;

namespace Test109.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            var user = new User { Id = 1, Name = "Alice" };
            return Ok(user);
        }


        [HttpGet("impersonate")]
        public IActionResult Impersonate()
        {
            var identity = new GenericIdentity("admin");
            var principal = new GenericPrincipal(identity, new[] { "Administrators" });
            System.Threading.Thread.CurrentPrincipal = principal;
            HttpContext.Session.SetString("impersonated", "admin");
            return Ok($"Impersonated as: {System.Threading.Thread.CurrentPrincipal.Identity.Name}");
        }

        public class Config
        {
            public List<UserEntry> users { get; set; }
        }
        public class UserEntry
        {
            public string username { get; set; }
            public string password { get; set; }
        }

        [HttpPost("delete")]
        public IActionResult DeleteUser([FromForm] string username)
        {
            var impersonated = HttpContext.Session.GetString("impersonated");
            if (impersonated != "admin") {
                return StatusCode(StatusCodes.Status403Forbidden, "Only admin can delete users.");
            }

            var configPath = Path.Combine(Directory.GetCurrentDirectory(), "config.json");
            if (!System.IO.File.Exists(configPath))
                return StatusCode(StatusCodes.Status500InternalServerError, "Config file missing");

            var configJson = System.IO.File.ReadAllText(configPath);
            var config = JsonSerializer.Deserialize<Config>(configJson);
            var userToDelete = config?.users?.FirstOrDefault(u => u.username == username);
            if (userToDelete != null)
            {
                config.users.Remove(userToDelete);
                System.IO.File.WriteAllText(configPath, JsonSerializer.Serialize(config));
                return Ok($"User {username} deleted by admin!");
            }
            return StatusCode(StatusCodes.Status404NotFound, $"User {username} not found.");
        }

        [HttpGet("list")]
        public IActionResult ListUsers()
        {
            var configPath = Path.Combine(Directory.GetCurrentDirectory(), "config.json");
            if (!System.IO.File.Exists(configPath))
                return StatusCode(StatusCodes.Status500InternalServerError, "Config file missing");

            var configJson = System.IO.File.ReadAllText(configPath);
            var config = JsonSerializer.Deserialize<Config>(configJson);
            var usernames = config?.users?.Select(u => u.username).ToList() ?? new List<string>();
            return Ok(usernames);
        }
    }
}
