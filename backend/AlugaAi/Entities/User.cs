namespace AlugaAi.Entities
{
    public class User : BaseEntity
    {
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public UserRole Role { get; set; }
        public Renter? Renter { get; set; }
        public Store? Store { get; set; }
    }
}
