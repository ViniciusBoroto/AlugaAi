using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Entities;

namespace AlugaAi.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseViewModel?> LoginAsync(LoginInputModel request);
        Task<AuthResponseViewModel?> RegisterRenterAsync(CreateRenterInputModel request);
        Task<AuthResponseViewModel?> RegisterStoreAsync(CreateStoreInputModel request);
        Task<CurrentUserViewModel?> GetCurrentUserAsync(Guid userId);
        AuthResponseViewModel GenerateAuthResponse(User user);
    }
}
