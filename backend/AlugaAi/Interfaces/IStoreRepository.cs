using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface IStoreRepository
    {
        Task<StoreViewModel> CreateStoreAsync(CreateStoreInputModel request, string hashedPassword);
        Task<List<StoreViewModel>> GetAllAsync();
        Task<RenterViewModel?> GetByIdAsync(string id); 
        Task<StoreViewModel> UpdateAsync(Guid id, UpdateStoreInputModel request, string? hashedPassword);
        Task<bool> DeleteAsync(Guid id);
    }
}
