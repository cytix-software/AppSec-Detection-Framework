using System.ComponentModel.DataAnnotations;

namespace Test46.Models
{
    public class User
    {
        [Required]
        [MinLength(3)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }

        [Required]
        [Range(0, 150)]
        public int Age { get; set; }
    }
} 