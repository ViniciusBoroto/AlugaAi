namespace AlugaAi.DTOs.InputModels
{
    public record CreateProductInputModel(
        string Name,
        string Description,
        decimal PricePerDay,
        string PhotoUrl,
        Guid CategoryId
    );
}
