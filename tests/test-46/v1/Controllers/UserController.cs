using Microsoft.AspNetCore.Mvc;
using Test46.Models;

namespace Test46.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private static List<User> _users = new();

        [HttpPost("register")]
        public IActionResult Register(User user)
        {
            // No manual validation - relying on automatic model validation
            // which is disabled in Program.cs
            _users.Add(user);
            return Ok();
        }

        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(_users);
        }
    }
} 