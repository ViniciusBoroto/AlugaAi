using AlugaAi.Data;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Entities;
using AlugaAi.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AlugaAi.Repositories
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly AlugaAiDbContext _context;

        public ReviewRepository(AlugaAiDbContext context)
        {
            _context = context;
        }

        public async Task<ReviewViewModel> CreateAsync(CreateReviewInputModel request)
        {
            var review = new Review
            {
                Id = Guid.NewGuid(),
                Comment = request.Comment,
                Rating = request.Rating,
                RenterId = request.RenterId,
                ProductId = request.ProductId
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            var created = await _context.Reviews
                .Include(r => r.Renter)
                .Include(r => r.Product)
                .FirstAsync(r => r.Id == review.Id);

            return ToViewModel(created);
        }

        public async Task<List<ReviewViewModel>> GetAllAsync()
        {
            return await _context.Reviews
                .AsNoTracking()
                .Include(r => r.Renter)
                .Include(r => r.Product)
                .Where(r => r.RemovedAt == null)
                .OrderBy(r => r.CreatedAt)
                .Select(r => ToViewModel(r))
                .ToListAsync();
        }

        public async Task<ReviewViewModel?> GetByIdAsync(Guid id)
        {
            var review = await _context.Reviews
                .AsNoTracking()
                .Include(r => r.Renter)
                .Include(r => r.Product)
                .Where(r => r.Id == id && r.RemovedAt == null)
                .FirstOrDefaultAsync();

            if (review is null)
            {
                return null;
            }

            return ToViewModel(review);
        }

        public async Task<ReviewViewModel?> UpdateAsync(Guid id, UpdateReviewInputModel request)
        {
            var review = await _context.Reviews
                .Include(r => r.Renter)
                .Include(r => r.Product)
                .FirstOrDefaultAsync(r => r.Id == id && r.RemovedAt == null);

            if (review is null)
            {
                return null;
            }

            review.Comment = request.Comment;
            review.Rating = request.Rating;

            await _context.SaveChangesAsync();

            return ToViewModel(review);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var review = await _context.Reviews
                .FirstOrDefaultAsync(r => r.Id == id && r.RemovedAt == null);

            if (review is null)
            {
                return false;
            }

            review.RemovedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        private static ReviewViewModel ToViewModel(Review review)
        {
            return new ReviewViewModel(
                review.Id,
                review.Comment,
                review.Rating,
                review.RenterId,
                review.Renter.Name,
                review.ProductId,
                review.Product.Name);
        }
    }
}