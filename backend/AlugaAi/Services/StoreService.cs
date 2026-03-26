using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AlugaAi.Services
{
    public class StoreService : IStoreService
    {
        private readonly IStoreRepository _storeRepository;
        private readonly IPasswordHasher<string> _passwordHasher;

        public StoreService(IStoreRepository storeRepository, IPasswordHasher<string> passwordHasher)
        {
            _storeRepository = storeRepository;
            _passwordHasher = passwordHasher;
        }
        public async Task<StoreViewModel> CreateStoreAsync(CreateStoreInputModel request)
        {
            if (request.Password.Length < 6)
            {
                throw new ArgumentException("A senha deve conter pelo menos 6 caracteres.");
            }
            var hashedPassword = _passwordHasher.HashPassword(request.Email, request.Password);
            return await _storeRepository.CreateStoreAsync(request with { Password = hashedPassword });
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            return _storeRepository.DeleteAsync(id);
        }

        public Task<List<StoreViewModel>> GetAllAsync()
        {
            return _storeRepository.GetAllAsync();
        }

        public Task<RenterViewModel?> GetByIdAsync(string id)
        {
            return _storeRepository.GetByIdAsync(id);
        }

        public async Task<StoreViewModel> UpdateAsync(Guid id, UpdateStoreInputModel request)
        {
            string? hashedPassword = null;
            if(!string.IsNullOrEmpty(request.Password))
            {
                if (request.Password.Length < 6)
                {
                    throw new ArgumentException("A senha deve conter pelo menos 6 caracteres.");
                }
                hashedPassword = _passwordHasher.HashPassword(request.Email, request.Password);
            }
            return await _storeRepository.UpdateAsync(id, request, hashedPassword);
        }
    }
}
