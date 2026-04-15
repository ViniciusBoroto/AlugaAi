using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Interfaces;

namespace AlugaAi.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _repository;

        public ReviewService(IReviewRepository repository)
        {
            _repository = repository;
        }

        public async Task<ReviewViewModel> CreateAsync(CreateReviewInputModel request)
        {
            if (string.IsNullOrWhiteSpace(request.Comment))
            {
                throw new ArgumentException("Comment is required.");
            }

            if (request.Rating < 1 || request.Rating > 5)
            {
                throw new ArgumentException("Rating must be between 1 and 5.");
            }

            return await _repository.CreateAsync(request);
        }

        public Task<List<ReviewViewModel>> GetAllAsync()
        {
            return _repository.GetAllAsync();
        }

        public Task<ReviewViewModel?> GetByIdAsync(Guid id)
        {
            return _repository.GetByIdAsync(id);
        }

        public async Task<ReviewViewModel?> UpdateAsync(Guid id, UpdateReviewInputModel request)
        {
            if (string.IsNullOrWhiteSpace(request.Comment))
            {
                throw new ArgumentException("Comment is required.");
            }

            if (request.Rating < 1 || request.Rating > 5)
            {
                throw new ArgumentException("Rating must be between 1 and 5.");
            }

            return await _repository.UpdateAsync(id, request);
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            return _repository.DeleteAsync(id);
        }
    }
}