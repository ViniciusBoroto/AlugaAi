using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AlugaAi.DTOs.InputModels
{
    public record CreateRenterInputModel(string Name, string Cpf, string Email, string PhoneNumber, string Password);
    
}