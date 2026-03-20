using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace AlugaAi.Services
{
    public class RenterService : IRenterService
    {
        private readonly IPasswordHasher<string> _hasher;
        private readonly IRenterRepository _repository;

        public RenterService(IPasswordHasher<string> hasher, IRenterRepository repository)
        {
            _hasher = hasher;
            _repository = repository;
        }

        public async Task<RenterViewModel> CreateRenterAsync(CreateRenterInputModel request)
        {
            if (request.Password.Length < 6)
            {
                throw new ArgumentException("Password must be at least 6 characters long.");
            }

            var hashedPassword = _hasher.HashPassword(request.Email, request.Password);
            return await _repository.CreateRenterAsync(request, hashedPassword);
        }

        public Task<List<RenterViewModel>> GetAllAsync()
        {
            return _repository.GetAllAsync();
        }

        public Task<RenterViewModel?> GetByIdAsync(Guid id)
        {
            return _repository.GetByIdAsync(id);
        }

        public async Task<RenterViewModel?> UpdateAsync(Guid id, UpdateRenterInputModel request)
        {
            string? hashedPassword = null;

            if (!string.IsNullOrWhiteSpace(request.Password))
            {
                if (request.Password.Length < 6)
                {
                    throw new ArgumentException("Password must be at least 6 characters long.");
                }

                hashedPassword = _hasher.HashPassword(request.Email, request.Password);
            }

            return await _repository.UpdateAsync(id, request, hashedPassword);
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            return _repository.DeleteAsync(id);
        }
    }
}
