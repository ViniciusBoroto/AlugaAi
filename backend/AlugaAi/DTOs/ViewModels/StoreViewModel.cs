namespace AlugaAi.DTOs.ViewModels
{
    public record StoreViewModel(
        Guid Id,
        string FantasyName,
        string Cnpj,
        string Adress,
        string CEP,
        string PhoneNumber,
        string Email
    );
}
