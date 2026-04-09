using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface IProductRepository
    {
        Task<ProductViewModel> CreateAsync(CreateProductInputModel request);
        Task<List<ProductViewModel>> GetAllAsync();
        Task<ProductViewModel?> GetByIdAsync(Guid id);
        Task<ProductViewModel?> UpdateAsync(Guid id, UpdateProductInputModel request);
        Task<bool> DeleteAsync(Guid id);
    }
}
