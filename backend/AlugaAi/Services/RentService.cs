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
        private readonly IEmailService _emailService;

        public RentService(IRentRepository repository, IEmailService emailService)
        {
            _repository = repository;
            _emailService = emailService;
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
