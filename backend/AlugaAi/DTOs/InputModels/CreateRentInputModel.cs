namespace AlugaAi.DTOs.InputModels
{
    public record CreateRentInputModel(
        DateTime RentalDate,
        DateTime ReturnDate,
        Guid ProductId,
        Guid RenterId
    );
}