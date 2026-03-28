using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseViewModel?> LoginAsync(LoginInputModel request);
        Task<CurrentUserViewModel?> GetCurrentUserAsync(Guid userId);
    }
}
