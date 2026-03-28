using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;

namespace AlugaAi.Interfaces
{
    public interface IRenterRepository
    {
        Task<RenterViewModel> CreateRenterAsync(CreateRenterInputModel request, string hashedPassword);
        Task<List<RenterViewModel>> GetAllAsync();
        Task<RenterViewModel?> GetByIdAsync(Guid id);
        Task<RenterViewModel?> UpdateAsync(Guid id, UpdateRenterInputModel request);
        Task<bool> DeleteAsync(Guid id);
    }
}
