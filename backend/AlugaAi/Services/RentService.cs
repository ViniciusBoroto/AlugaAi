using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Interfaces;

namespace AlugaAi.Services
{
    public class RentService : IRentService
    {
        private readonly IRentRepository _repository;

        public RentService(IRentRepository repository)
        {
            _repository = repository;
        }

        public async Task<RentViewModel> CreateAsync(CreateRentInputModel request)
        {
            if (request.RentalDate >= request.ReturnDate)
            {
                throw new ArgumentException("ReturnDate must be after RentalDate.");
            }

            return await _repository.CreateAsync(request);
        }

        public Task<List<RentViewModel>> GetAllAsync()
        {
            return _repository.GetAllAsync();
        }

        public Task<RentViewModel?> GetByIdAsync(Guid id)
        {
            return _repository.GetByIdAsync(id);
        }

        public async Task<RentViewModel?> UpdateAsync(Guid id, UpdateRentInputModel request)
        {
            if (request.RentalDate >= request.ReturnDate)
            {
                throw new ArgumentException("ReturnDate must be after RentalDate.");
            }

            return await _repository.UpdateAsync(id, request);
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            return _repository.DeleteAsync(id);
        }
    }
}