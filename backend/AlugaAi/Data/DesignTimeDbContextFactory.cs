using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AlugaAi.Data
{
    // Design-time factory to allow EF tools to create the DbContext without building the full app
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AlugaAiDbContext>
    {
        public AlugaAiDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<AlugaAiDbContext>();

            // Try common environment variables, otherwise fall back to a local default connection string
            var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__Supabase")
                ?? Environment.GetEnvironmentVariable("SUPABASE_CONNECTION")
                ?? "Host=localhost;Database=alugaai;Username=postgres;Password=postgres";

            builder.UseNpgsql(connectionString);

            return new AlugaAiDbContext(builder.Options);
        }
    }
}
