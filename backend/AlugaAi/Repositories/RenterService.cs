using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AlugaAi.DTOs.InputModels;
using AlugaAi.DTOs.ViewModels;
using AlugaAi.Entities;
using AlugaAi.Interfaces;

namespace AlugaAi.Repositories
{
    public class RenterService : IRenterService
    {
        public RenterViewModel CreateRenter(CreateRenterInputModel request)
        {
            var renter = new Renter
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                PasswordHash = request.Password, 
                Cpf = request.Cpf,
                PhoneNumber = request.PhoneNumber
            };
            //TODO Salvar no banco de dados
            throw new NotImplementedException();
        }
    }
}