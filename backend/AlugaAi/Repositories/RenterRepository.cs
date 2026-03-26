using AlugaAi.Data;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Entities;
using AlugaAi.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AlugaAi.Repositories
{
    public class RenterRepository : IRenterRepository
    {
        private readonly AlugaAiDbContext _context;

        public RenterRepository(AlugaAiDbContext context)
        {
            _context = context;
        }

        public async Task<RenterViewModel> CreateRenterAsync(CreateRenterInputModel request, string hashedPassword)
        {
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = request.Email,
                PasswordHash = hashedPassword,
                Role = UserRole.Renter
            };

            var renter = new Renter
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                User = user,
                Name = request.Name,
                Cpf = request.Cpf,
                PhoneNumber = request.PhoneNumber
            };

            _context.Renters.Add(renter);
            await _context.SaveChangesAsync();

            return ToViewModel(renter);
        }

        public async Task<List<RenterViewModel>> GetAllAsync()
        {
            return await _context.Renters
                .AsNoTracking()
                .Include(renter => renter.User)
                .Where(renter => renter.RemovedAt == null)
                .OrderBy(renter => renter.Name)
                .Select(renter => ToViewModel(renter))
                .ToListAsync();
        }

        public async Task<RenterViewModel?> GetByIdAsync(Guid id)
        {
            return await _context.Renters
                .AsNoTracking()
                .Include(renter => renter.User)
                .Where(renter => renter.Id == id && renter.RemovedAt == null)
                .Select(renter => ToViewModel(renter))
                .FirstOrDefaultAsync();
        }

        public async Task<RenterViewModel?> UpdateAsync(Guid id, UpdateRenterInputModel request, string? hashedPassword)
        {
            var renter = await _context.Renters
                .Include(current => current.User)
                .FirstOrDefaultAsync(current => current.Id == id && current.RemovedAt == null);

            if (renter is null)
            {
                return null;
            }

            renter.Name = request.Name;
            renter.Cpf = request.Cpf;
            renter.PhoneNumber = request.PhoneNumber;
            renter.User.Email = request.Email;

            if (!string.IsNullOrWhiteSpace(hashedPassword))
            {
                renter.User.PasswordHash = hashedPassword;
            }

            await _context.SaveChangesAsync();

            return ToViewModel(renter);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var renter = await _context.Renters
                .Include(current => current.User)
                .FirstOrDefaultAsync(current => current.Id == id && current.RemovedAt == null);

            if (renter is null)
            {
                return false;
            }

            renter.RemovedAt = DateTime.UtcNow;
            renter.User.RemovedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return true;
        }

        private static RenterViewModel ToViewModel(Renter renter)
        {
            return new RenterViewModel(
                renter.Id,
                renter.Name,
                renter.Cpf,
                renter.User.Email,
                renter.PhoneNumber);
        }
    }
}
