namespace AlugaAi.DTOs.ViewModels
{
    public record ProductViewModel(
        Guid Id,
        string Name,
        string Description,
        decimal PricePerDay,
        string PhotoUrl,
        Guid CategoryId,
        Guid StoreId,
        string CategoryName,
        string StoreAddress
    );
}
