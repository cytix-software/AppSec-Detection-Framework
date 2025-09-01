using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;
using Microsoft.AspNetCore.Mvc.Testing;

namespace Test109.Tests
{
    public class UserControllerTests : IClassFixture<WebApplicationFactory<Test109.Program>>
    {
        private readonly HttpClient _client;

        public UserControllerTests(WebApplicationFactory<Test109.Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Get_ReturnsUser()
        {
            var response = await _client.GetAsync("/User");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.Contains("Alice", content);
        }

        [Fact]
        public async Task Impersonate_ReturnsAdmin()
        {
            var response = await _client.GetAsync("/User/impersonate");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            Assert.Contains("Impersonated as: admin", content);
        }
    }
}
