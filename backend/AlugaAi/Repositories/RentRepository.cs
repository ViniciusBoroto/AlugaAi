using AlugaAi.Data;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Entities;
using AlugaAi.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AlugaAi.Repositories
{
    public class RentRepository : IRentRepository
    {
        private readonly AlugaAiDbContext _context;

        public RentRepository(AlugaAiDbContext context)
        {
            _context = context;
        }

        public async Task<RentViewModel> CreateAsync(CreateRentInputModel request)
        {
            var rent = new Rent
            {
                Id = Guid.NewGuid(),
                RentalDate = request.RentalDate,
                ReturnDate = request.ReturnDate,
                ProductId = request.ProductId,
                RenterId = request.RenterId
            };

            _context.Rents.Add(rent);
            await _context.SaveChangesAsync();

            var created = await _context.Rents
                .Include(r => r.Product)
                .Include(r => r.Renter)
                .FirstAsync(r => r.Id == rent.Id);

            return ToViewModel(created);
        }

        public async Task<List<RentViewModel>> GetAllAsync()
        {
            return await _context.Rents
                .AsNoTracking()
                .Include(r => r.Product)
                .Include(r => r.Renter)
                .Where(r => r.RemovedAt == null)
                .OrderBy(r => r.RentalDate)
                .Select(r => ToViewModel(r))
                .ToListAsync();
        }

        public async Task<RentViewModel?> GetByIdAsync(Guid id)
        {
            var rent = await _context.Rents
                .AsNoTracking()
                .Include(r => r.Product)
                .Include(r => r.Renter)
                .Where(r => r.Id == id && r.RemovedAt == null)
                .FirstOrDefaultAsync();

            if (rent is null)
            {
                return null;
            }

            return ToViewModel(rent);
        }

        public async Task<RentViewModel?> UpdateAsync(Guid id, UpdateRentInputModel request)
        {
            var rent = await _context.Rents
                .Include(r => r.Product)
                .Include(r => r.Renter)
                .FirstOrDefaultAsync(r => r.Id == id && r.RemovedAt == null);

            if (rent is null)
            {
                return null;
            }

            rent.RentalDate = request.RentalDate;
            rent.ReturnDate = request.ReturnDate;
            rent.DeliveredAt = request.DeliveredAt;
            rent.ReturnedAt = request.ReturnedAt;

            await _context.SaveChangesAsync();

            return ToViewModel(rent);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var rent = await _context.Rents
                .FirstOrDefaultAsync(r => r.Id == id && r.RemovedAt == null);

            if (rent is null)
            {
                return false;
            }

            rent.RemovedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        private static RentViewModel ToViewModel(Rent rent)
        {
            return new RentViewModel(
                rent.Id,
                rent.RentalDate,
                rent.ReturnDate,
                rent.DeliveredAt,
                rent.ReturnedAt,
                rent.ProductId,
                rent.Product.Name,
                rent.RenterId,
                rent.Renter.Name);
        }
    }
}