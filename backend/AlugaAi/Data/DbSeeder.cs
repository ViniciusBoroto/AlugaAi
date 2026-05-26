using AlugaAi.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace AlugaAi.Data
{
    public static class DbSeeder
    {
        private static readonly DateTime SeedCreatedAt = new(2026, 5, 26, 0, 0, 0, DateTimeKind.Utc);

        private static readonly Guid StoreUserId = Guid.Parse("8bb4543b-4bf3-4efd-9762-7b9243e8de10");
        private static readonly Guid StoreId = Guid.Parse("28cd9f6e-75d1-4611-81fa-61367ea79a31");

        private static readonly CategorySeed[] CategorySeeds =
        [
            new("Construção", "19e1d91b-f176-4c4a-b801-f0f239841eb4"),
            new("Jardinagem", "4b235613-2bf8-4821-b26f-c6b0cde11f5e"),
            new("Doméstica", "f65dd234-4921-4574-a29d-9c7db263fcf8"),
            new("Automotivo", "92ef5452-e237-4fc8-8bf3-8c5ef17fda16"),
        ];

        private static readonly ProductSeed[] ProductSeeds =
        [
            new(
                "Furadeira de Impacto",
                "650W, mandril 3/4, ideal para concreto e alvenaria.",
                35m,
                "https://lojawap.vtexassets.com/arquivos/ids/176185/parafusadeira-e-furadeira-de-impacto-wap-wf-700-fe_01.png?v=638793668909000000",
                "19e1d91b-f176-4c4a-b801-f0f239841eb4",
                "7e52d458-7268-4684-abf2-9eb19bb5320d"),
            new(
                "Betoneira 120L",
                "Motor 1/2 CV, tambor basculante e estrutura reforçada para obra.",
                89m,
                "https://casadopicapau.vtexassets.com/arquivos/ids/164635/40104201.png?v=638248684185000000",
                "19e1d91b-f176-4c4a-b801-f0f239841eb4",
                "8a5d2579-e869-4248-baaf-2cf634cc533d"),
            new(
                "Serra Circular",
                "1200W, disco 7.1/4 e profundidade de corte de 65mm.",
                45m,
                "https://madeirasgasometro.vtexassets.com/arquivos/ids/174359/serra-circular-185mm-sc16-stanley-imagem-01.jpg?v=637139100535670000",
                "19e1d91b-f176-4c4a-b801-f0f239841eb4",
                "cd6f1fc8-ca50-4972-8916-c94f35b8a83d"),
            new(
                "Cortador de Grama",
                "Motor a gasolina 4T, 3.5HP e corte de 46cm.",
                55m,
                "https://images.tcdn.com.br/img/img_prod/1103256/cortador_de_grama_eletrico_trapp_mc_50e_505095609_1_fcef2609ebc7a80914e8397ed17df267.jpg",
                "4b235613-2bf8-4821-b26f-c6b0cde11f5e",
                "7cfdb2ee-26e7-4131-aa2f-b68d65c36484"),
            new(
                "Motosserra 16",
                "40cc, corrente automática e partida fácil para poda e corte.",
                70m,
                "https://m.media-amazon.com/images/I/31Ulzu8teNL._AC_UF894,1000_QL80_.jpg",
                "4b235613-2bf8-4821-b26f-c6b0cde11f5e",
                "1ad0232e-18f5-412e-bdb7-0dd7e0ceae0b"),
            new(
                "Lavadora de Alta Pressão",
                "1800 PSI, mangueira de 5m e ideal para quintais e fachadas.",
                50m,
                "https://lojawap.vtexassets.com/arquivos/ids/174272/lavadora-de-alta-pressao-1400w-1500psi-wap-eco-fit-2200_01.png?v=638792139812700000",
                "f65dd234-4921-4574-a29d-9c7db263fcf8",
                "225cb554-faa0-44c7-ba17-44faec0dca5b"),
            new(
                "Escada Articulada",
                "4x4 degraus, alumínio e suporte de até 150kg.",
                30m,
                "https://www.reisam.com.br/wp-content/uploads/2021/01/articulada-1.png",
                "f65dd234-4921-4574-a29d-9c7db263fcf8",
                "6fe4ef02-6d31-40b8-a474-7f6495f92477"),
            new(
                "Compressor de Ar",
                "24L, 2HP, indicado para calibragem e pintura leve.",
                58m,
                "https://brasmetal.com/wp-content/uploads/2019/02/Imagens-recortadas_37.png",
                "92ef5452-e237-4fc8-8bf3-8c5ef17fda16",
                "d8e0a11e-7021-49a4-81e4-1892ae64fd56"),
            new(
                "Scanner Automotivo",
                "OBD2, leitura de falhas e compatível com carros nacionais.",
                46m,
                "https://www.alfatest.com.br/wp-content/uploads/2023/10/rf-ALFATEST-116-recorte-Grande.png",
                "92ef5452-e237-4fc8-8bf3-8c5ef17fda16",
                "e12e3f4d-aa31-4194-b66a-a5df66a59e0d"),
        ];

        public static async Task SeedAsync(
            AlugaAiDbContext dbContext,
            IPasswordHasher<string> passwordHasher,
            ILogger logger)
        {
            await SeedStoreAsync(dbContext, passwordHasher);
            await SeedCategoriesAsync(dbContext);
            await SeedProductsAsync(dbContext);

            logger.LogInformation("Database seed completed.");
        }

        private static async Task SeedStoreAsync(
            AlugaAiDbContext dbContext,
            IPasswordHasher<string> passwordHasher)
        {
            var storeUser = await dbContext.Users.FirstOrDefaultAsync(user => user.Id == StoreUserId);
            if (storeUser is null)
            {
                storeUser = new User
                {
                    Id = StoreUserId,
                    Email = "loja.demo@alugaai.local",
                    PasswordHash = passwordHasher.HashPassword("loja.demo@alugaai.local", "Demo123!"),
                    Role = UserRole.Store,
                    CreatedAt = SeedCreatedAt,
                };
                dbContext.Users.Add(storeUser);
            }

            var store = await dbContext.Stores.FirstOrDefaultAsync(current => current.Id == StoreId);
            if (store is null)
            {
                dbContext.Stores.Add(new Store
                {
                    Id = StoreId,
                    UserId = StoreUserId,
                    FantasyName = "AlugaAi Tools",
                    Cnpj = "12.345.678/0001-90",
                    Adress = "Av. Central, 1000 - São Paulo/SP",
                    CEP = "01000-000",
                    PhoneNumber = "(11) 4000-1234",
                    CreatedAt = SeedCreatedAt,
                });
            }

            await dbContext.SaveChangesAsync();
        }

        private static async Task SeedCategoriesAsync(AlugaAiDbContext dbContext)
        {
            foreach (var categorySeed in CategorySeeds)
            {
                var categoryId = Guid.Parse(categorySeed.Id);
                var existingCategory = await dbContext.Categories
                    .FirstOrDefaultAsync(category => category.Id == categoryId);

                if (existingCategory is not null)
                {
                    continue;
                }

                dbContext.Categories.Add(new Category
                {
                    Id = categoryId,
                    Name = categorySeed.Name,
                    CreatedAt = SeedCreatedAt,
                });
            }

            await dbContext.SaveChangesAsync();
        }

        private static async Task SeedProductsAsync(AlugaAiDbContext dbContext)
        {
            foreach (var productSeed in ProductSeeds)
            {
                var productId = Guid.Parse(productSeed.Id);
                var existingProduct = await dbContext.Products
                    .FirstOrDefaultAsync(product => product.Id == productId);

                if (existingProduct is not null)
                {
                    continue;
                }

                dbContext.Products.Add(new Product
                {
                    Id = productId,
                    Name = productSeed.Name,
                    Description = productSeed.Description,
                    PricePerDay = productSeed.PricePerDay,
                    PhotoUrl = productSeed.PhotoUrl,
                    CategoryId = Guid.Parse(productSeed.CategoryId),
                    StoreId = StoreId,
                    CreatedAt = SeedCreatedAt,
                });
            }

            await dbContext.SaveChangesAsync();
        }

        private sealed record CategorySeed(string Name, string Id);

        private sealed record ProductSeed(
            string Name,
            string Description,
            decimal PricePerDay,
            string PhotoUrl,
            string CategoryId,
            string Id);
    }
}
