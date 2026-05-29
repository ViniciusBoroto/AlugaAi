using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface IRentService
    {
        Task<RentViewModel> CreateAsync(CreateRentInputModel request);
        Task<List<RentViewModel>> CreateManyAsync(IEnumerable<CreateRentInputModel> requests);
        Task<List<RentViewModel>> GetAllAsync();
        Task<List<RentViewModel>> GetByRenterIdAsync(Guid renterId);
        Task<List<RentViewModel>> GetByStoreIdAsync(Guid storeId);
        Task<RentViewModel?> GetByIdAsync(Guid id);
        Task<RentViewModel?> UpdateAsync(Guid id, UpdateRentInputModel request);
        Task<RentViewModel?> UpdateStatusAsync(Guid id, UpdateRentStatusInputModel request);
        Task<bool> DeleteAsync(Guid id);
    }
}
