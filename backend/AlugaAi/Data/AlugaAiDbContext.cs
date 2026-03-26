using AlugaAi.Entities;
using Microsoft.EntityFrameworkCore;

namespace AlugaAi.Data
{
    public class AlugaAiDbContext : DbContext
    {
        public AlugaAiDbContext(DbContextOptions<AlugaAiDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Renter> Renters => Set<Renter>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Store> Stores => Set<Store>();
        public DbSet<Rent> Rents => Set<Rent>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(user => user.Id);

                entity.Property(user => user.Email).IsRequired().HasMaxLength(150);
                entity.Property(user => user.PasswordHash).IsRequired();
                entity.Property(user => user.Role).IsRequired();
                entity.Property(user => user.CreatedAt).IsRequired();

                entity.HasIndex(user => user.Email).IsUnique();
            });

            modelBuilder.Entity<Renter>(entity =>
            {
                entity.ToTable("renters");
                entity.HasKey(renter => renter.Id);

                entity.Property(renter => renter.UserId).IsRequired();
                entity.Property(renter => renter.Name).IsRequired().HasMaxLength(150);
                entity.Property(renter => renter.Cpf).IsRequired().HasMaxLength(14);
                entity.Property(renter => renter.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(renter => renter.CreatedAt).IsRequired();

                entity.HasIndex(renter => renter.Cpf).IsUnique();
                entity.HasIndex(renter => renter.UserId).IsUnique();

                entity.HasOne(renter => renter.User)
                    .WithOne(user => user.Renter)
                    .HasForeignKey<Renter>(renter => renter.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Store>(entity =>
            {
                entity.ToTable("stores");
                entity.HasKey(store => store.Id);

                entity.Property(store => store.UserId).IsRequired();
                entity.Property(store => store.FantasyName).IsRequired().HasMaxLength(150);
                entity.Property(store => store.Cnpj).IsRequired().HasMaxLength(18);
                entity.Property(store => store.Adress).IsRequired().HasMaxLength(255);
                entity.Property(store => store.CEP).IsRequired().HasMaxLength(20);
                entity.Property(store => store.PhoneNumber).IsRequired().HasMaxLength(20);
                entity.Property(store => store.CreatedAt).IsRequired();

                entity.HasIndex(store => store.Cnpj).IsUnique();
                entity.HasIndex(store => store.UserId).IsUnique();

                entity.HasOne(store => store.User)
                    .WithOne(user => user.Store)
                    .HasForeignKey<Store>(store => store.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
