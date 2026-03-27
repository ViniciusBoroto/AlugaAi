using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AlugaAi.Data;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AlugaAi.Services
{
    public class AuthService : IAuthService
    {
        private readonly AlugaAiDbContext _context;
        private readonly IPasswordHasher<string> _passwordHasher;
        private readonly IConfiguration _configuration;

        public AuthService(
            AlugaAiDbContext context,
            IPasswordHasher<string> passwordHasher,
            IConfiguration configuration)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
        }

        public async Task<AuthResponseViewModel?> LoginAsync(LoginInputModel request)
        {
            var user = await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(current =>
                    current.Email == request.Email &&
                    current.RemovedAt == null);

            if (user is null)
            {
                return null;
            }

            var passwordVerificationResult = _passwordHasher.VerifyHashedPassword(
                request.Email,
                user.PasswordHash,
                request.Password);

            if (passwordVerificationResult == PasswordVerificationResult.Failed)
            {
                return null;
            }

            var token = GenerateToken(user.Id, user.Email, user.Role.ToString(), out var expiresAt);

            return new AuthResponseViewModel(
                token,
                expiresAt,
                user.Id,
                user.Role.ToString());
        }

        public async Task<CurrentUserViewModel?> GetCurrentUserAsync(Guid userId)
        {
            return await _context.Users
                .AsNoTracking()
                .Where(user => user.Id == userId && user.RemovedAt == null)
                .Select(user => new CurrentUserViewModel(
                    user.Id,
                    user.Email,
                    user.Role.ToString()))
                .FirstOrDefaultAsync();
        }

        private string GenerateToken(Guid userId, string email, string role, out DateTime expiresAt)
        {
            var jwtKey = _configuration["Jwt:Key"]
                ?? throw new InvalidOperationException("Jwt:Key is not configured.");
            var jwtIssuer = _configuration["Jwt:Issuer"]
                ?? throw new InvalidOperationException("Jwt:Issuer is not configured.");
            var jwtAudience = _configuration["Jwt:Audience"]
                ?? throw new InvalidOperationException("Jwt:Audience is not configured.");
            var expiresInMinutes = int.TryParse(_configuration["Jwt:ExpiresInMinutes"], out var parsedValue)
                ? parsedValue
                : 60;

            expiresAt = DateTime.UtcNow.AddMinutes(expiresInMinutes);
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim("userId", userId.ToString()),
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Role, role),
                new Claim("role", role)
            };

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
