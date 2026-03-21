using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface ICategoryService
    {
        Task<CategoryViewModel> CreateAsync(CreateCategoryInputModel request);
        Task<List<CategoryViewModel>> GetAllAsync();
        Task<CategoryViewModel?> GetByIdAsync(Guid id);
        Task<CategoryViewModel?> UpdateAsync(Guid id, UpdateCategoryInputModel request);
        Task<bool> DeleteAsync(Guid id);
    }
}