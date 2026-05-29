namespace AlugaAi.DTOs.InputModels
{
    public record UpdateProductInputModel(
        string Name,
        string Description,
        decimal PricePerDay,
        string PhotoUrl,
        Guid CategoryId,
        Guid StoreId,
        int Quantity
    );
}
