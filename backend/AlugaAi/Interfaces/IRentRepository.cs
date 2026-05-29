using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface IRentRepository
    {
        Task<RentCreateResult> CreateAsync(CreateRentInputModel request);
        Task<List<RentCreateResult>> CreateManyAsync(IEnumerable<CreateRentInputModel> requests);
        Task<int> GetActiveQuantityByProductIdAsync(Guid productId);
        Task<List<RentViewModel>> GetAllAsync();
        Task<List<RentViewModel>> GetByRenterIdAsync(Guid renterId);
        Task<List<RentViewModel>> GetByStoreIdAsync(Guid storeId);
        Task<RentViewModel?> GetByIdAsync(Guid id);
        Task<RentViewModel?> UpdateAsync(Guid id, UpdateRentInputModel request);
        Task<RentStatusUpdateResult?> UpdateStatusAsync(Guid id, UpdateRentStatusInputModel request);
        Task<bool> DeleteAsync(Guid id);
    }
}
