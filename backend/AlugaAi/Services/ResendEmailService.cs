using System.Net.Http.Headers;
using System.Net.Http.Json;
using AlugaAi.Interfaces;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace AlugaAi.Services
{
    public class ResendEmailService : IEmailService
    {
        private readonly HttpClient _httpClient;
        private readonly ResendOptions _options;
        private readonly ILogger<ResendEmailService> _logger;

        public ResendEmailService(HttpClient httpClient, IOptions<ResendOptions> options, ILogger<ResendEmailService> logger)
        {
            _httpClient = httpClient;
            _options = options.Value;
            _logger = logger;
        }

        public async Task SendAsync(string to, string subject, string htmlContent, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(_options.ApiKey))
            {
                throw new InvalidOperationException("Resend:ApiKey is not configured.");
            }

            if (string.IsNullOrWhiteSpace(_options.FromEmail))
            {
                throw new InvalidOperationException("Resend:FromEmail is not configured.");
            }

            _logger.LogInformation("Sending email to {To} with subject \"{Subject}\"", to, subject);

            using var request = new HttpRequestMessage(HttpMethod.Post, "emails");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);
            request.Content = JsonContent.Create(new
            {
                from = $"{_options.FromName} <{_options.FromEmail}>",
                to = new[] { to },
                subject,
                html = htmlContent
            });

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
                _logger.LogError("Failed to send email to {To}: status {Status} - {Body}", to, (int)response.StatusCode, responseBody);
                throw new InvalidOperationException($"Resend failed with status {(int)response.StatusCode}: {responseBody}");
            }

            _logger.LogInformation("Email sent successfully to {To}", to);
        }
    }
}
