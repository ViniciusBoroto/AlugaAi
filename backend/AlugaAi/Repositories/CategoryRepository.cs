using AlugaAi.Data;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Entities;
using AlugaAi.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AlugaAi.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AlugaAiDbContext _context;

        public CategoryRepository(AlugaAiDbContext context)
        {
            _context = context;
        }

        public async Task<CategoryViewModel> CreateAsync(CreateCategoryInputModel request)
        {
            var category = new Category
            {
                Id = Guid.NewGuid(),
                Name = request.CategoryName
            };

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return ToViewModel(category);
        }

        public async Task<List<CategoryViewModel>> GetAllAsync()
        {
            return await _context.Categories
                .AsNoTracking()
                .Where(category => category.RemovedAt == null)
                .OrderBy(category => category.Name)
                .Select(category => ToViewModel(category))
                .ToListAsync();
        }

        public async Task<CategoryViewModel?> GetByIdAsync(Guid id)
        {
            return await _context.Categories
                .AsNoTracking()
                .Where(category => category.Id == id && category.RemovedAt == null)
                .Select(category => ToViewModel(category))
                .FirstOrDefaultAsync();
        }

        public async Task<CategoryViewModel?> UpdateAsync(Guid id, UpdateCategoryInputModel request)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(current => current.Id == id && current.RemovedAt == null);

            if (category is null)
            {
                return null;
            }

            category.Name = request.CategoryName;

            await _context.SaveChangesAsync();

            return ToViewModel(category);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var category = await _context.Categories
                .FirstOrDefaultAsync(current => current.Id == id && current.RemovedAt == null);

            if (category is null)
            {
                return false;
            }

            category.RemovedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        private static CategoryViewModel ToViewModel(Category category)
        {
            return new CategoryViewModel(
                category.Id,
                category.Name);
        }
    }
}