namespace AlugaAi.Entities
{
    public class BaseEntity
    {
        public Guid Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? RemovedAt { get; set; } = null;
    }
}
