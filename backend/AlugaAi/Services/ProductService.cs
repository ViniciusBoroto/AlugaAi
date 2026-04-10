using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Interfaces;

namespace AlugaAi.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;

        public ProductService(IProductRepository repository)
        {
            _repository = repository;
        }

        public async Task<ProductViewModel> CreateAsync(CreateProductInputModel request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("Name is required.");

            if (request.PricePerDay <= 0)
                throw new ArgumentException("PricePerDay must be greater than zero.");

            return await _repository.CreateAsync(request); // This line is unchanged
        }

        public Task<List<ProductViewModel>> GetAllAsync() => _repository.GetAllAsync();

        public Task<ProductViewModel?> GetByIdAsync(Guid id) => _repository.GetByIdAsync(id);

        public async Task<ProductViewModel?> UpdateAsync(Guid id, UpdateProductInputModel request)
        {
            if (string.IsNullOrWhiteSpace(request.Name))
                throw new ArgumentException("Name is required.");

            if (request.PricePerDay <= 0)
                throw new ArgumentException("PricePerDay must be greater than zero.");

            return await _repository.UpdateAsync(id, request);
        }

        public Task<bool> DeleteAsync(Guid id) => _repository.DeleteAsync(id);
    }
}
