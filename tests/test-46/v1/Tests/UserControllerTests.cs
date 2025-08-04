using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Test46.Models;
using Xunit;

namespace Test46.Tests
{
    public class UserControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;
        private readonly HttpClient _client;

        public UserControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task Register_WithInvalidModel_StillSucceeds()
        {
            // Arrange
            var invalidUser = new User
            {
                // Missing required fields
                Username = "", // Empty username
                Email = "not-an-email", // Invalid email format
                Password = "123" // Too short password
            };

            var content = new StringContent(
                JsonSerializer.Serialize(invalidUser),
                Encoding.UTF8,
                "application/json");

            // Act
            var response = await _client.PostAsync("/api/user/register", content);

            // Assert
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            
            // Verify the invalid user was actually added
            var getResponse = await _client.GetAsync("/api/user");
            var users = await JsonSerializer.DeserializeAsync<List<User>>(
                await getResponse.Content.ReadAsStreamAsync());
            
            Assert.Contains(users, u => u.Email == invalidUser.Email);
        }
    }
} 