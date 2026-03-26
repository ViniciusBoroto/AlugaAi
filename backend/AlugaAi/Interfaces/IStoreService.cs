using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface IStoreService
    {
        Task<StoreViewModel> CreateStoreAsync(CreateStoreInputModel request);
        Task<List<StoreViewModel>> GetAllAsync();
        Task<StoreViewModel?> GetByIdAsync(Guid id);
        Task<StoreViewModel?> UpdateAsync(Guid id, UpdateStoreInputModel request);
        Task<bool> DeleteAsync(Guid id);
    }
}
