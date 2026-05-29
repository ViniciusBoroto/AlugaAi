namespace AlugaAi.Entities
{
    public class Product:BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal PricePerDay { get; set; }
        public string PhotoUrl { get; set; }
        public int Quantity { get; set; }
        public Category Category { get; set; }
        public Guid CategoryId { get; set; }
        public Guid StoreId { get; set; }
        public Store Store { get; set; }
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
