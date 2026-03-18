using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlugaAi.DTOs.ViewModels
{
    public record RenterViewModel(
        Guid Id,
        string Name,
        string Cpf,
        string Email,
        string PhoneNumber
    );
}