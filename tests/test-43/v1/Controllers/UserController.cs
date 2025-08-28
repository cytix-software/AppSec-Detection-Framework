using Microsoft.AspNetCore.Mvc;
using Test43.Models;
using System.IO;
using System.Text.Json;
using Microsoft.AspNetCore.Http;

namespace Test43.Controllers
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

        [HttpPost("login")]
        public IActionResult Login([FromForm] string username, [FromForm] string password)
        {
            var configPath = Path.Combine(Directory.GetCurrentDirectory(), "config.json");
            if (!System.IO.File.Exists(configPath))
                return StatusCode(StatusCodes.Status500InternalServerError, "Config file missing");

            var configJson = System.IO.File.ReadAllText(configPath);
            var config = JsonSerializer.Deserialize<Config>(configJson);
            var user = config?.users?.FirstOrDefault(u => u.username == username && u.password == password);
            if (user != null)
                return Ok($"Welcome, {user.username}!");
            else
                throw new System.Exception("Invalid credentials exception");
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
    }
}
