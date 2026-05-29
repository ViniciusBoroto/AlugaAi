using AlugaAi.Entities;

namespace AlugaAi.DTOs.ViewModels
{
    public record RentCreateResult(
        RentViewModel Rent,
        string RenterEmail,
        string RenterName,
        string ProductName,
        string StoreEmail,
        string StoreName
    );
}
