namespace AlugaAi.DTOs.ViewModels
{
    public record ReviewViewModel(
        Guid Id,
        string Comment,
        int Rating,
        Guid RenterId,
        string RenterName,
        Guid ProductId,
        string ProductName
    );
}