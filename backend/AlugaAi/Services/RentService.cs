using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Entities;
using AlugaAi.Interfaces;
using System.Net;

namespace AlugaAi.Services
{
    public class RentService : IRentService
    {
        private readonly IRentRepository _repository;
        private readonly IProductRepository _productRepository;
        private readonly IEmailService _emailService;

        public RentService(IRentRepository repository, IProductRepository productRepository, IEmailService emailService)
        {
            _repository = repository;
            _productRepository = productRepository;
            _emailService = emailService;
        }

        public async Task<RentViewModel> CreateAsync(CreateRentInputModel request)
        {
            if (request.RentalDate >= request.ReturnDate)
            {
                throw new ArgumentException("ReturnDate must be after RentalDate.");
            }

            if (request.Quantity <= 0)
            {
                throw new ArgumentException("Quantity must be greater than zero.");
            }

            await ValidateStockAsync(request.ProductId, request.Quantity);

            return await _repository.CreateAsync(request);
        }

        public async Task<List<RentViewModel>> CreateManyAsync(IEnumerable<CreateRentInputModel> requests)
        {
            var requestList = requests.ToList();
            if (!requestList.Any())
            {
                return new List<RentViewModel>();
            }

            foreach (var req in requestList)
            {
                if (req.RentalDate >= req.ReturnDate)
                {
                    throw new ArgumentException("ReturnDate must be after RentalDate.");
                }
            }

            var productQuantities = requestList
                .GroupBy(r => r.ProductId)
                .ToDictionary(g => g.Key, g => g.Sum(r => r.Quantity));

            foreach (var (productId, totalRequested) in productQuantities)
            {
                await ValidateStockAsync(productId, totalRequested);
            }

            var created = await _repository.CreateManyAsync(requestList);

            return created;
        }

        private async Task ValidateStockAsync(Guid productId, int requestedQuantity)
        {
            var product = await _productRepository.GetByIdAsync(productId)
                ?? throw new ArgumentException("Product not found.");

            var activeQuantity = await _repository.GetActiveQuantityByProductIdAsync(productId);

            var available = product.Quantity - activeQuantity;

            if (requestedQuantity > available)
            {
                throw new ArgumentException(
                    $"Insufficient stock. Only {available} unit(s) available for this product.");
            }
        }

        public Task<List<RentViewModel>> GetAllAsync()
        {
            return _repository.GetAllAsync();
        }

        public Task<List<RentViewModel>> GetByRenterIdAsync(Guid renterId)
        {
            return _repository.GetByRenterIdAsync(renterId);
        }

        public Task<List<RentViewModel>> GetByStoreIdAsync(Guid storeId)
        {
            return _repository.GetByStoreIdAsync(storeId);
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

        public async Task<RentViewModel?> UpdateStatusAsync(Guid id, UpdateRentStatusInputModel request)
        {
            var result = await _repository.UpdateStatusAsync(id, request);
            if (result is null)
            {
                return null;
            }

            await _emailService.SendAsync(
                result.RenterEmail,
                GetStatusEmailSubject(result.Status),
                GetStatusEmailHtml(result));

            return result.Rent;
        }

        public Task<bool> DeleteAsync(Guid id)
        {
            return _repository.DeleteAsync(id);
        }

        private static string GetStatusEmailSubject(RentStatus status)
        {
            return status switch
            {
                RentStatus.Pending => "Sua reserva voltou para pendente",
                RentStatus.Delivered => "Seu aluguel foi marcado como entregue",
                RentStatus.Returned => "Seu aluguel foi marcado como devolvido",
                _ => "Status do aluguel atualizado"
            };
        }

        private static string GetStatusEmailHtml(RentStatusUpdateResult result)
        {
            var renterName = WebUtility.HtmlEncode(result.RenterName);
            var productName = WebUtility.HtmlEncode(result.ProductName);
            var status = WebUtility.HtmlEncode(GetStatusLabel(result.Status));

            return $"""
                <p>Olá, {renterName}.</p>
                <p>O status do seu aluguel do produto <strong>{productName}</strong> foi atualizado para <strong>{status}</strong>.</p>
                <p>Período reservado: {result.Rent.RentalDate:dd/MM/yyyy} até {result.Rent.ReturnDate:dd/MM/yyyy}.</p>
                """;
        }

        private static string GetStatusLabel(RentStatus status)
        {
            return status switch
            {
                RentStatus.Pending => "Pendente",
                RentStatus.Delivered => "Entregue",
                RentStatus.Returned => "Devolvido",
                _ => status.ToString()
            };
        }
    }
}
