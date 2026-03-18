using System;
using System.Collections.Generic;
using System.Linq;
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
        public RenterViewModel CreateRenter(CreateRenterInputModel request)
        {
            if (request.Password.Length < 6)
            {
                throw new ArgumentException("Password must be at least 6 characters long.");
            }
            var hashedPassword = _hasher.HashPassword(request.Email, request.Password);

            return _repository.CreateRenter(request, hashedPassword);
        }
    }
}