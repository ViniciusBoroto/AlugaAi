namespace AlugaAi.Entities
{
    public class Renter : BaseEntity
    {
        public Guid UserId { get; set; }
        public User User { get; set; }
        public string Name { get; set; }
        public string Cpf { get; set; }
        public string PhoneNumber { get; set; }
    }
}
