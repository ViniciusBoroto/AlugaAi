namespace AlugaAi.Entities
{
    public class Rent:BaseEntity
    {
        public DateTime RentalDate { get; set; }
        public DateTime ReturnDate { get; set; }
        public DateTime? DeliveredAt { get; set; } = null;
        public DateTime? ReturnedAt{ get; set; } = null;
        public Product Product { get; set; }
        public Guid ProductId { get; set; }
        public Renter Renter { get; set; }
        public Guid RenterId { get; set; }
    }
}
