namespace AlugaAi.DTOs.ViewModels
{
    public record RentViewModel(
        Guid Id,
        DateTime RentalDate,
        DateTime ReturnDate,
        DateTime? DeliveredAt,
        DateTime? ReturnedAt,
        Guid ProductId,
        string ProductName,
        Guid RenterId,
        string RenterName
    );
}