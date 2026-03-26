using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface IRentRepository
    {
        Task<RentViewModel> CreateAsync(CreateRentInputModel request);
        Task<List<RentViewModel>> GetAllAsync();
        Task<RentViewModel?> GetByIdAsync(Guid id);
        Task<RentViewModel?> UpdateAsync(Guid id, UpdateRentInputModel request);
        Task<bool> DeleteAsync(Guid id);
    }
}