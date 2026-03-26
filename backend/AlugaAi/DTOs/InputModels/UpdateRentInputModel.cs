namespace AlugaAi.DTOs.InputModels
{
    public record UpdateRentInputModel(
        DateTime RentalDate,
        DateTime ReturnDate,
        DateTime? DeliveredAt,
        DateTime? ReturnedAt
    );
}