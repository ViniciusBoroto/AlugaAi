namespace AlugaAi.Entities
{
    public class Store:BaseEntity
    {
        public string FantasyName { get; set; }
        public string Cnpj { get; set; }
        public string Adress { get; set; }
        public string CEP { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public string PasswordHash { get; set; }
    }
}
