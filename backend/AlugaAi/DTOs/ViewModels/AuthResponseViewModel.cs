namespace AlugaAi.DTOs.ViewModels
{
    public record AuthResponseViewModel(
        string Token,
        DateTime ExpiresAt,
        Guid UserId,
        string Role);
}
