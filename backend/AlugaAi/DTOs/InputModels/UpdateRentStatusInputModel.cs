using AlugaAi.Entities;

namespace AlugaAi.DTOs.InputModels
{
    public record UpdateRentStatusInputModel(
        RentStatus Status,
        DateTime? OccurredAt
    );
}
