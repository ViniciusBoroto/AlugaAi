using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Interfaces;

namespace AlugaAi.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<CategoryViewModel> CreateAsync(CreateCategoryInputModel request)
        {
            if (string.IsNullOrWhiteSpace(request.CategoryName))
            {
                throw new ArgumentException("Name is required.");
            }

            return await _repository.CreateAsync(request);
        }

        public Task<List<CategoryViewModel>> GetAllAsync()
        {
            return _repository.GetAllAsync();
        }

        public Task<CategoryViewModel?> GetByIdAsync(Guid id)
        {
            return _repository.GetByIdAsync(id);
        }

        public async Task<CategoryViewModel?> UpdateAsync(Guid id, UpdateCategoryInputModel request)
        {
            if (string.IsNullOrWhiteSpace(request.CategoryName))
            {
                throw new ArgumentException("Name is required.");
            }

            return await _repository.UpdateAsync(id, request);
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            return _repository.DeleteAsync(id);
        }
    }
}