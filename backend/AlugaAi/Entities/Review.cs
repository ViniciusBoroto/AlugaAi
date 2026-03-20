namespace AlugaAi.Entities
{
    public class Review:BaseEntity
     {
        public string Comment { get; set; }
        public int Rating { get; set; }
        public Guid RenterId { get; set; }
        public Renter Renter { get; set; }
        public Guid ProductId { get; set; }
        public Product Product { get; set; }
    }
}
