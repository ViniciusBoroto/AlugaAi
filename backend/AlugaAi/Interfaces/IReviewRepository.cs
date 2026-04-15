using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface IReviewRepository
    {
        Task<ReviewViewModel> CreateAsync(CreateReviewInputModel request);
        Task<List<ReviewViewModel>> GetAllAsync();
        Task<ReviewViewModel?> GetByIdAsync(Guid id);
        Task<ReviewViewModel?> UpdateAsync(Guid id, UpdateReviewInputModel request);
        Task<bool> DeleteAsync(Guid id);
    }
}