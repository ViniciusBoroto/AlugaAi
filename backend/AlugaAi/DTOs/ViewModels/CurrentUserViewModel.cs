namespace AlugaAi.DTOs.ViewModels
{
    public record CurrentUserViewModel(
        Guid UserId,
        string Email,
        string Role);
}
