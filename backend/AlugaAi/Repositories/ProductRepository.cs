using AlugaAi.Data;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Entities;
using AlugaAi.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AlugaAi.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly AlugaAiDbContext _context;

        public ProductRepository(AlugaAiDbContext context)
        {
            _context = context;
        }

        public async Task<ProductViewModel> CreateAsync(CreateProductInputModel request)
        {
            var product = new Product
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Description = request.Description,
                PricePerDay = request.PricePerDay,
                PhotoUrl = request.PhotoUrl,
                CategoryId = request.CategoryId,
                StoreId = request.StoreId
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return await GetByIdAsync(product.Id) ?? throw new InvalidOperationException();
        }

        public Task<List<ProductViewModel>> GetAllAsync()
        {
            return _context.Products
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.Store)
                .Where(p => p.RemovedAt == null)
                .OrderBy(p => p.Name)
                .Select(p => ToViewModel(p))
                .ToListAsync();
        }

        public Task<List<ProductViewModel>> GetByStoreIdAsync(Guid storeId)
        {
            return _context.Products
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.Store)
                .Where(p => p.StoreId == storeId && p.RemovedAt == null)
                .OrderBy(p => p.Name)
                .Select(p => ToViewModel(p))
                .ToListAsync();
        }

        public async Task<ProductViewModel?> GetByIdAsync(Guid id)
        {
            return await _context.Products
                .AsNoTracking()
                .Include(p => p.Category)
                .Include(p => p.Store)
                .Where(p => p.Id == id && p.RemovedAt == null)
                .Select(p => ToViewModel(p))
                .FirstOrDefaultAsync();
        }

        public async Task<ProductViewModel?> UpdateAsync(Guid id, UpdateProductInputModel request)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && p.RemovedAt == null);

            if (product is null) return null;

            product.Name = request.Name;
            product.Description = request.Description;
            product.PricePerDay = request.PricePerDay;
            product.PhotoUrl = request.PhotoUrl;
            product.CategoryId = request.CategoryId;
            product.StoreId = request.StoreId;

            await _context.SaveChangesAsync();

            return await GetByIdAsync(product.Id);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id && p.RemovedAt == null);

            if (product is null) return false;

            product.RemovedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        private static ProductViewModel ToViewModel(Product p)
        {
            return new ProductViewModel(
                p.Id,
                p.Name,
                p.Description,
                p.PricePerDay,
                p.PhotoUrl,
                p.CategoryId,
                p.StoreId,
                p.Category?.Name ?? string.Empty,
                p.Store?.Adress ?? string.Empty
            );
        }
    }
}
