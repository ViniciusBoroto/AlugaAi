namespace AlugaAi.DTOs.InputModels
{
    public record CreateReviewInputModel(
        string Comment,
        int Rating,
        Guid RenterId,
        Guid ProductId
    );
}