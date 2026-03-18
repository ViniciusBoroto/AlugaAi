namespace AlugaAi.Entities
{
    public class Renter : BaseEntity
    {
        public string Name { get; set; }
        public string Cpf { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string PhoneNumber { get; set; }
    }
}
