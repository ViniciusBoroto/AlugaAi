using AlugaAi.Entities;
using Microsoft.EntityFrameworkCore;

namespace AlugaAi.Data
{
    public class AlugaAiDbContext : DbContext
    {
        public AlugaAiDbContext(DbContextOptions<AlugaAiDbContext> options) : base(options)
        {
        }

        public DbSet<Renter> Renters => Set<Renter>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Store> Stores => Set<Store>();
        public DbSet<Rent> Rents => Set<Rent>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Renter>(entity =>
            {
                entity.ToTable("renters");
                entity.HasKey(renter => renter.Id);

                entity.Property(renter => renter.Name).IsRequired().HasMaxLength(150);
                entity.Property(renter => renter.Cpf).IsRequired().HasMaxLength(14);
                entity.Property(renter => renter.Email).IsRequired().HasMaxLength(150);
                entity.Property(renter => renter.PasswordHash).IsRequired();
                entity.Property(renter => renter.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(renter => renter.CreatedAt).IsRequired();

                entity.HasIndex(renter => renter.Email).IsUnique();
                entity.HasIndex(renter => renter.Cpf).IsUnique();
            });
        }
    }
}
