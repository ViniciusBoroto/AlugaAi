namespace AlugaAi.Interfaces
{
    public interface IEmailService
    {
        Task SendAsync(string to, string subject, string htmlContent, CancellationToken cancellationToken = default);
    }
}
