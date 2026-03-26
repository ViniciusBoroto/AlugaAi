using AlugaAi.Data;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Entities;
using AlugaAi.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AlugaAi.Repositories
{
    public class StoreRepository : IStoreRepository
    {
        private readonly AlugaAiDbContext _context;

        public StoreRepository(AlugaAiDbContext context)
        {
            _context = context;
        }

        public async Task<StoreViewModel> CreateStoreAsync(CreateStoreInputModel request, string hashedPassword)
        {
            var store = new Store
            {
                Id = Guid.NewGuid(),
                FantasyName = request.FantasyName,
                Cnpj = request.Cnpj,
                Adress = request.Adress,
                CEP = request.CEP,
                PhoneNumber = request.PhoneNumber,
                Email = request.Email,
                PasswordHash = hashedPassword
            };

            _context.Stores.Add(store);
            await _context.SaveChangesAsync();

            return ToViewModel(store);
        }

        public async Task<bool> DeleteAsync(Guid id)
        {
            var store = await _context.Stores
                .FirstOrDefaultAsync(s => s.Id == id && s.RemovedAt == null);
            if (store == null) { return false; }

            store.RemovedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        public Task<List<StoreViewModel>> GetAllAsync()
        {
            return _context.Stores
                .Where(store => store.RemovedAt == null)
                .OrderBy(store => store.FantasyName)
                .Select(store => ToViewModel(store))
                .ToListAsync();
        }

        public async Task<StoreViewModel?> GetByIdAsync(Guid id)
        {
            return await _context.Stores
                .AsNoTracking()
                .Where(store => store.Id == id && store.RemovedAt == null)
                .Select(store => ToViewModel(store))
                .FirstOrDefaultAsync();
        }

        public async Task<StoreViewModel?> UpdateAsync(Guid id, UpdateStoreInputModel request, string? hashedPassword)
        {
            var store = await _context.Stores
                .FirstOrDefaultAsync(current => current.Id == id && current.RemovedAt == null);

            if (store == null)
            {
                return null;
            }

            store.FantasyName = request.FantasyName;
            store.Cnpj = request.Cnpj;
            store.Adress = request.Adress;
            store.CEP = request.CEP;
            store.PhoneNumber = request.PhoneNumber;
            store.Email = request.Email;


            if (!string.IsNullOrEmpty(hashedPassword))
            {
                store.PasswordHash = hashedPassword;
            }

            await _context.SaveChangesAsync();

            return ToViewModel(store);
        }

        private static StoreViewModel ToViewModel(Store store)
        {
            return new StoreViewModel(
                store.Id,
                store.FantasyName,
                store.Cnpj,
                store.Adress,
                store.CEP,
                store.PhoneNumber,
                store.Email);
        }
    }
}
