namespace AlugaAi.DTOs.InputModels
{
    public record UpdateStoreInputModel(
        string FantasyName,
        string Cnpj,
        string Adress,
        string CEP,
        string Email,
        string PhoneNumber,
        string? Password);
}
