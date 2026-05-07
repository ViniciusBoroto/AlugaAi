using System.Security.Claims;
using AlugaAi.DTOs.InputModels;
using AlugaAi.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AlugaAi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;

        public AuthController(IAuthService service)
        {
            _service = service;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginInputModel request)
        {
            var response = await _service.LoginAsync(request);

            if (response is null)
            {
                return Unauthorized("Invalid email or password.");
            }

            return Ok(response);
        }

        [HttpPost("register/renter")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterRenter(CreateRenterInputModel request)
        {
            var response = await _service.RegisterRenterAsync(request);

            if (response is null)
            {
                return BadRequest("User already exists or invalid data.");
            }

            return CreatedAtAction(nameof(Me), response);
        }

        [HttpPost("register/store")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterStore(CreateStoreInputModel request)
        {
            var response = await _service.RegisterStoreAsync(request);

            if (response is null)
            {
                return BadRequest("User already exists or invalid data.");
            }

            return CreatedAtAction(nameof(Me), response);
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier)
                ?? User.FindFirstValue("userId");

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }

            var currentUser = await _service.GetCurrentUserAsync(userId);

            if (currentUser is null)
            {
                return NotFound();
            }

            return Ok(currentUser);
        }
    }
}
