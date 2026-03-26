namespace AlugaAi.Entities
{
    public class Store:BaseEntity
    {
        public Guid UserId { get; set; }
        public User User { get; set; }
        public string FantasyName { get; set; }
        public string Cnpj { get; set; }
        public string Adress { get; set; }
        public string CEP { get; set; }
        public string PhoneNumber { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
    }
}
