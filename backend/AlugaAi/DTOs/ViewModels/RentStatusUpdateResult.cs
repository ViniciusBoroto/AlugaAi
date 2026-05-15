using AlugaAi.Entities;

namespace AlugaAi.DTOs.ViewModels
{
    public record RentStatusUpdateResult(
        RentViewModel Rent,
        RentStatus Status,
        string RenterEmail,
        string RenterName,
        string ProductName
    );
}
