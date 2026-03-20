namespace AlugaAi.DTOs.InputModels
{
    public record UpdateRenterInputModel(
        string Name,
        string Cpf,
        string Email,
        string PhoneNumber,
        string? Password);
}
