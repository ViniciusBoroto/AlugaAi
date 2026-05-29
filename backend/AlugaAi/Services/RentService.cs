using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Entities;
using AlugaAi.Interfaces;
using Microsoft.Extensions.Logging;
using System.Net;

namespace AlugaAi.Services
{
    public class RentService : IRentService
    {
        private readonly IRentRepository _repository;
        private readonly IProductRepository _productRepository;
        private readonly IEmailService _emailService;
        private readonly ILogger<RentService> _logger;

        public RentService(
            IRentRepository repository,
            IProductRepository productRepository,
            IEmailService emailService,
            ILogger<RentService> logger)
        {
            _repository = repository;
            _productRepository = productRepository;
            _emailService = emailService;
            _logger = logger;
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

            var result = await _repository.CreateAsync(request);

            _logger.LogInformation("Rent {RentId} created for product {ProductName} by renter {RenterName}",
                result.Rent.Id, result.ProductName, result.RenterName);

            await SendCreationEmails(result);

            return result.Rent;
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

            var results = await _repository.CreateManyAsync(requestList);

            foreach (var result in results)
            {
                _logger.LogInformation("Rent {RentId} created (batch) for product {ProductName} by renter {RenterName}",
                    result.Rent.Id, result.ProductName, result.RenterName);

                await SendCreationEmails(result);
            }

            return results.Select(r => r.Rent).ToList();
        }

        private async Task SendCreationEmails(RentCreateResult result)
        {
            await _emailService.SendAsync(
                result.RenterEmail,
                GetCreationRenterSubject(),
                GetCreationRenterHtml(result));

            await _emailService.SendAsync(
                result.StoreEmail,
                GetCreationStoreSubject(),
                GetCreationStoreHtml(result));
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

            _logger.LogInformation("Sending status email to {Email} for rent {RentId} (status: {Status})",
                result.RenterEmail, result.Rent.Id, result.Status);

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

        private static string GetCreationRenterSubject()
        {
            return "Sua reserva foi confirmada!";
        }

        private static string GetCreationRenterHtml(RentCreateResult result)
        {
            var renterName = WebUtility.HtmlEncode(result.RenterName);
            var productName = WebUtility.HtmlEncode(result.ProductName);
            var storeName = WebUtility.HtmlEncode(result.StoreName);

            return $"""
                <p>Olá, {renterName}.</p>
                <p>Sua reserva do produto <strong>{productName}</strong> na loja <strong>{storeName}</strong> foi confirmada!</p>
                <p>Período: {result.Rent.RentalDate:dd/MM/yyyy} até {result.Rent.ReturnDate:dd/MM/yyyy}.</p>
                <p>Quantidade: {result.Rent.Quantity} unidade(s).</p>
                """;
        }

        private static string GetCreationStoreSubject()
        {
            return "Novo aluguel registrado!";
        }

        private static string GetCreationStoreHtml(RentCreateResult result)
        {
            var renterName = WebUtility.HtmlEncode(result.RenterName);
            var productName = WebUtility.HtmlEncode(result.ProductName);
            var storeName = WebUtility.HtmlEncode(result.StoreName);

            return $"""
                <p>Olá, {storeName}.</p>
                <p>O cliente <strong>{renterName}</strong> acabou de alugar <strong>{productName}</strong>.</p>
                <p>Período: {result.Rent.RentalDate:dd/MM/yyyy} até {result.Rent.ReturnDate:dd/MM/yyyy}.</p>
                <p>Quantidade: {result.Rent.Quantity} unidade(s).</p>
                """;
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
